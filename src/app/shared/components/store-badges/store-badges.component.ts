import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store-badges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="store-badges" [class.compact]="compact">
      <a *ngIf="ios" [href]="ios" target="_blank" rel="noopener" class="store-badge" aria-label="Download on the App Store">
        <svg class="store-svg" viewBox="0 0 384 512" aria-hidden="true">
          <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
        </svg>
        <span class="store-text"><small>Download on the</small><strong>App Store</strong></span>
      </a>

      <a *ngIf="android" [href]="android" target="_blank" rel="noopener" class="store-badge" aria-label="Get it on Google Play">
        <svg class="store-svg gplay" viewBox="0 0 512 512" aria-hidden="true">
          <path fill="#00d3ff" d="M48 28.3v455.4c0 9 4.9 16.9 12.6 21L307.7 256 60.6 7.3C52.9 11.4 48 19.3 48 28.3z"/>
          <path fill="#00f076" d="M60.6 7.3c4.9-2.6 11-3 16.5.1L370 175.9l-62.3 80.1L60.6 7.3z"/>
          <path fill="#ffce00" d="M370 175.9l81.2 46.7c14.4 8.3 14.4 29.2 0 37.5L370 306.1 307.7 256 370 175.9z"/>
          <path fill="#ff3b30" d="M60.6 504.7c5.5 3.1 11.6 2.7 16.5.1L370 336.1 307.7 256 60.6 504.7z"/>
        </svg>
        <span class="store-text"><small>GET IT ON</small><strong>Google Play</strong></span>
      </a>
    </div>
  `,
  styles: [`
    .store-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .store-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      padding: 0.5rem 0.95rem;
      border-radius: 10px;
      background: linear-gradient(180deg, #1c1c2b 0%, #101019 100%);
      border: 1px solid rgba(255, 255, 255, 0.14);
      color: #fff;
      transition: all 0.3s var(--ease-out);
    }

    .store-svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: #fff;
    }
    .store-svg.gplay { color: inherit; }

    .store-text {
      display: flex;
      flex-direction: column;
      line-height: 1.05;
      text-align: left;

      small {
        font-size: 0.56rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.7);
      }
      strong { font-size: 0.92rem; font-weight: 600; }
    }

    .store-badge:hover {
      border-color: var(--color-primary);
      box-shadow: 0 8px 22px rgba(6, 251, 169, 0.22);
      transform: translateY(-2px);
    }

    .compact .store-badge { padding: 0.4rem 0.8rem; }
    .compact .store-svg { width: 18px; height: 18px; }
    .compact .store-text strong { font-size: 0.82rem; }
  `]
})
export class StoreBadgesComponent {
  @Input() ios?: string;
  @Input() android?: string;
  @Input() compact = false;
}
