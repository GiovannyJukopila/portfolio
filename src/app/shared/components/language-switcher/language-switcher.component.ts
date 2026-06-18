import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="lang-btn" (click)="toggleLanguage()">
      <span [class.active]="langService.currentLang() === 'en'">EN</span>
      <span class="divider">/</span>
      <span [class.active]="langService.currentLang() === 'es'">ES</span>
    </button>
  `,
  styles: [`
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 4px 8px;
      border-radius: 4px;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      .active {
        color: var(--color-primary);
        font-weight: 700;
      }

      .divider {
        font-size: 0.8em;
        opacity: 0.5;
      }
    }
  `]
})
export class LanguageSwitcherComponent {
  langService = inject(LanguageService);

  toggleLanguage() {
    const newLang = this.langService.currentLang() === 'en' ? 'es' : 'en';
    this.langService.setLanguage(newLang);
  }
}
