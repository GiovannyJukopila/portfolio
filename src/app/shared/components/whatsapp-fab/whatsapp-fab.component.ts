import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SOCIAL_LINKS } from '../../../core/profile';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <a class="wa-fab" [href]="whatsapp" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
      <span class="wa-tooltip">{{ 'COMMON.WHATSAPP_CTA' | translate }}</span>
      <span class="wa-pulse"></span>
      <svg class="wa-icon" viewBox="0 0 32 32" aria-hidden="true">
        <path fill="currentColor" d="M16.04 4C9.96 4 5.02 8.94 5.02 15.02c0 2.05.56 4.05 1.62 5.8L4.9 27.1l6.46-1.7a11 11 0 0 0 4.68 1.05h.01c6.08 0 11.02-4.94 11.02-11.02 0-2.95-1.15-5.72-3.23-7.8A10.94 10.94 0 0 0 16.04 4zm0 20.2h-.01c-1.45 0-2.87-.39-4.11-1.13l-.3-.17-3.83 1 1.02-3.73-.2-.31a9.13 9.13 0 0 1-1.4-4.86c0-5.05 4.11-9.16 9.17-9.16 2.45 0 4.75.96 6.48 2.69a9.1 9.1 0 0 1 2.68 6.48c0 5.06-4.11 9.16-9.17 9.16zm5.03-6.86c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.28-.14-1.16-.43-2.21-1.36-.82-.73-1.37-1.63-1.53-1.9-.16-.28-.02-.43.12-.56.12-.12.28-.32.41-.48.14-.16.18-.27.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.45-.46-.61-.46l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.84c.14.18 1.94 2.96 4.7 4.15.66.28 1.17.45 1.57.58.66.21 1.26.18 1.74.11.53-.08 1.63-.67 1.86-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.18-.53-.32z"/>
      </svg>
    </a>
  `,
  styles: [`
    .wa-fab {
      position: fixed;
      right: 22px;
      bottom: 22px;
      z-index: 950;
      width: 58px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #25d366;
      color: #fff;
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.45);
      transition: transform 0.3s var(--ease-spring), box-shadow 0.3s ease;
    }

    .wa-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 30px rgba(37, 211, 102, 0.6);
    }

    .wa-fab:hover .wa-tooltip {
      opacity: 1;
      transform: translateX(0);
      visibility: visible;
    }

    .wa-icon { width: 32px; height: 32px; position: relative; z-index: 2; }

    .wa-pulse {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #25d366;
      z-index: 1;
      animation: wa-pulse 2.2s ease-out infinite;
    }

    .wa-tooltip {
      position: absolute;
      right: 72px;
      white-space: nowrap;
      background: #11111f;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.55rem 0.9rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
      opacity: 0;
      visibility: hidden;
      transform: translateX(8px);
      transition: all 0.3s var(--ease-out);
    }

    .wa-tooltip::after {
      content: '';
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 10px;
      height: 10px;
      background: #11111f;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 600px) {
      .wa-fab { right: 16px; bottom: 16px; width: 52px; height: 52px; }
      .wa-icon { width: 28px; height: 28px; }
      .wa-tooltip { display: none; }
    }

    @keyframes wa-pulse {
      0% { transform: scale(1); opacity: 0.6; }
      70% { transform: scale(1.6); opacity: 0; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .wa-pulse { animation: none; }
    }
  `]
})
export class WhatsappFabComponent {
  whatsapp = SOCIAL_LINKS.whatsapp;
}
