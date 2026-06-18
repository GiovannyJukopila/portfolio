import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SOCIAL_LINKS } from '../../profile';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <div class="container footer-inner">
        <a class="logo" (click)="scrollTop()">
          <span class="bracket">&lt;</span>gioDev<span class="bracket">/&gt;</span>
        </a>

        <div class="socials">
          <a [href]="social.github" target="_blank" rel="noopener" aria-label="GitHub"><i class="ph ph-github-logo"></i></a>
          <a [href]="social.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
          <a [href]="social.whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="ph ph-whatsapp-logo"></i></a>
          <a [href]="'mailto:' + social.email" aria-label="Email"><i class="ph ph-envelope-simple"></i></a>
        </div>

        <p class="copy">&copy; {{ year }} Giovanny Zdenco Jukopila · {{ social.location }}</p>
      </div>
    </footer>
  `,
  styles: [`
    @use 'mixins' as *;

    footer {
      padding: 2.5rem 0;
      background: rgba(5, 5, 9, 0.6);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      margin-top: 2rem;
    }

    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      text-align: center;
    }

    .logo {
      font-family: 'Roboto Mono', monospace;
      font-weight: 700;
      font-size: 1.2rem;
      color: #fff;
      cursor: pointer;
      .bracket { color: var(--color-primary); }
      &:hover { color: var(--color-primary); }
    }

    .socials {
      display: flex;
      gap: 1.25rem;

      a {
        width: 42px;
        height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        font-size: 1.3rem;
        color: rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s var(--ease-out);

        &:hover {
          color: #04110c;
          background: var(--color-primary);
          border-color: var(--color-primary);
          transform: translateY(-3px);
        }
      }
    }

    .copy { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
  social = SOCIAL_LINKS;

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
