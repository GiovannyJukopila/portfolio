import {
  Component, EventEmitter, Input, Output, inject, signal, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BOOKING_API_URL } from '../../../core/profile';

type Step = 'calendar' | 'time' | 'confirm' | 'done';
interface Slot { start: string; end: string; key: string; }

const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 18;
const SLOT_MINUTES = 30;

function fmt(h: number, m: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

function validateEmail(email: string): string | null {
  const v = (email || '').trim();
  if (!v) return 'ERR';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'ERR';
  return null;
}

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss'
})
export class BookingModalComponent implements OnChanges {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  private http = inject(HttpClient);
  private translate = inject(TranslateService);

  step = signal<Step>('calendar');
  viewYear = signal(new Date().getFullYear());
  viewMonth = signal(new Date().getMonth());
  selectedDate = signal<Date | null>(null);
  selectedSlot = signal<Slot | null>(null);
  takenSlots = signal<string[]>([]);
  slotsLoading = signal(false);
  loading = signal(false);
  error = signal('');
  emailError = signal(false);
  meetLink = signal<string | null>(null);

  form = { name: '', email: '', company: '' };

  readonly allSlots: Slot[] = this.buildSlots();
  readonly dayLabels = this.buildDayLabels();

  private today = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  private maxDate = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + 60); return d; })();

  ngOnChanges(ch: SimpleChanges) {
    if (ch['open']) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = this.open ? 'hidden' : '';
      }
      if (!this.open) setTimeout(() => this.reset(), 300);
    }
  }

  // ── Calendar ───────────────────────────────────────────────
  get monthLabel(): string {
    return new Date(this.viewYear(), this.viewMonth(), 1)
      .toLocaleDateString(this.locale(), { month: 'long', year: 'numeric' });
  }

  days(): (Date | null)[] {
    const year = this.viewYear(), month = this.viewMonth();
    const lastDay = new Date(year, month + 1, 0);
    const out: (Date | null)[] = [];
    let startDow = new Date(year, month, 1).getDay();
    startDow = startDow === 0 ? 6 : startDow - 1; // Monday-first
    for (let i = 0; i < startDow; i++) out.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) out.push(new Date(year, month, d));
    return out;
  }

  isDisabled(date: Date): boolean {
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    const dow = d.getDay();
    return d < this.today || d > this.maxDate || dow === 0 || dow === 6;
  }

  isToday(date: Date): boolean { return date.toDateString() === new Date().toDateString(); }
  isSelected(date: Date): boolean { return this.selectedDate()?.toDateString() === date.toDateString(); }

  prevMonth() {
    if (this.viewMonth() === 0) { this.viewMonth.set(11); this.viewYear.update(y => y - 1); }
    else this.viewMonth.update(m => m - 1);
  }
  nextMonth() {
    if (this.viewMonth() === 11) { this.viewMonth.set(0); this.viewYear.update(y => y + 1); }
    else this.viewMonth.update(m => m + 1);
  }

  selectDay(date: Date) {
    if (this.isDisabled(date)) return;
    this.selectedDate.set(date);
    this.step.set('time');
    this.fetchTakenSlots(date);
  }

  // ── Time ───────────────────────────────────────────────────
  isTaken(slot: Slot): boolean { return this.takenSlots().includes(slot.key); }

  selectSlot(slot: Slot) {
    if (this.isTaken(slot)) return;
    this.selectedSlot.set(slot);
    this.step.set('confirm');
  }

  private fetchTakenSlots(date: Date) {
    if (!BOOKING_API_URL) { this.takenSlots.set([]); return; }
    this.slotsLoading.set(true);
    this.http.get<{ takenSlots: string[] }>(`${BOOKING_API_URL}/api/slots?date=${this.dateKey(date)}`)
      .subscribe({
        next: r => { this.takenSlots.set(r.takenSlots ?? []); this.slotsLoading.set(false); },
        error: () => { this.takenSlots.set([]); this.slotsLoading.set(false); }
      });
  }

  // ── Confirm ────────────────────────────────────────────────
  submit() {
    const date = this.selectedDate(), slot = this.selectedSlot();
    if (!date || !slot) return;
    if (validateEmail(this.form.email)) { this.emailError.set(true); return; }

    this.loading.set(true);
    this.error.set('');

    this.http.post<{ success?: boolean; meetLink?: string; error?: string }>(
      `${BOOKING_API_URL}/api/booking`,
      { date: this.dateKey(date), slot, name: this.form.name, email: this.form.email, company: this.form.company || undefined }
    ).subscribe({
      next: r => {
        this.meetLink.set(r.meetLink ?? null);
        this.step.set('done');
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        if (err?.status === 409) {
          this.error.set(this.translate.instant('BOOKING.SLOT_TAKEN'));
          this.fetchTakenSlots(date);
          setTimeout(() => { this.step.set('time'); this.error.set(''); }, 1900);
        } else {
          this.error.set(this.translate.instant('BOOKING.ERROR'));
        }
      }
    });
  }

  onEmailBlur() { this.emailError.set(!!validateEmail(this.form.email)); }
  clearEmailError() { if (this.emailError()) this.emailError.set(false); }

  // ── Shell ──────────────────────────────────────────────────
  close() { this.closed.emit(); }
  backToCalendar() { this.step.set('calendar'); }

  onBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('booking-backdrop')) this.close();
  }

  formatSelectedDate(): string {
    const d = this.selectedDate();
    return d ? d.toLocaleDateString(this.locale(), { weekday: 'long', month: 'long', day: 'numeric' }) : '';
  }

  private reset() {
    this.step.set('calendar');
    this.selectedDate.set(null);
    this.selectedSlot.set(null);
    this.takenSlots.set([]);
    this.form = { name: '', email: '', company: '' };
    this.emailError.set(false);
    this.error.set('');
    this.meetLink.set(null);
  }

  private locale(): string { return this.translate.currentLang === 'es' ? 'es-ES' : 'en-US'; }

  private dateKey(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private buildSlots(): Slot[] {
    const slots: Slot[] = [];
    for (let h = SLOT_START_HOUR; h < SLOT_END_HOUR; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        const endMin = (m + SLOT_MINUTES) % 60;
        const endHour = m + SLOT_MINUTES >= 60 ? h + 1 : h;
        slots.push({ start: fmt(h, m), end: fmt(endHour, endMin), key: `${h}:${m}` });
      }
    }
    return slots;
  }

  private buildDayLabels(): string[] {
    // 2024-01-01 is a Monday → produce Mon-first short weekday labels.
    const labels: string[] = [];
    for (let i = 0; i < 7; i++) {
      labels.push(new Date(2024, 0, 1 + i).toLocaleDateString(this.locale(), { weekday: 'short' }));
    }
    return labels;
  }
}
