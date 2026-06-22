import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SOCIAL_LINKS, BOOKING_API_URL } from '../../core/profile';
import { BookingModalComponent } from '../../shared/components/booking-modal/booking-modal.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, BookingModalComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  social = SOCIAL_LINKS;
  sent = false;

  /** Controls the booking calendar modal. */
  bookingOpen = signal(false);
  /** True once the booking backend URL has been configured in profile.ts. */
  get hasBooking(): boolean { return !!BOOKING_API_URL; }

  /** Open the calendar modal, or fall back to email if the backend isn't set up yet. */
  openBooking() {
    if (this.hasBooking) {
      this.bookingOpen.set(true);
    } else {
      const subject = encodeURIComponent('Intro call request');
      window.location.href = `mailto:${this.social.email}?subject=${subject}`;
    }
  }

  trustSignals = [
    { icon: 'ph-lightning', key: 'CONTACT.TRUST_RESPONSE' },
    { icon: 'ph-clock', key: 'CONTACT.TRUST_TIMEZONE' },
    { icon: 'ph-globe-hemisphere-west', key: 'CONTACT.TRUST_REMOTE' },
    { icon: 'ph-translate', key: 'CONTACT.TRUST_LANGS' }
  ];

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  onSubmit() {
    if (this.contactForm.valid) {
      // Open the user's mail client pre-filled (no backend required).
      const { name, email, message } = this.contactForm.value;
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name} (${email})`);
      window.location.href = `mailto:${this.social.email}?subject=${subject}&body=${body}`;
      this.sent = true;
      this.contactForm.reset();
      setTimeout(() => (this.sent = false), 5000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
