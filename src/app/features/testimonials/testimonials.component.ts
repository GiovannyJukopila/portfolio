import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

interface CompanyLogo {
  name: string;
  initials: string;
  color: string;   // brand accent for the monogram badge
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
  /**
   * Testimonials (placeholder copy tied to the real companies in the CV).
   * Replace the quotes/names with real references whenever you collect them.
   */
  testimonials: Testimonial[] = [
    {
      quote: 'Giovanny quickly became our go-to engineer for web and mobile. He ships fast, takes full ownership and the quality is always there. A genuine asset to the team.',
      name: 'Matthias Borg',
      role: 'Tech Lead · Digiprint',
      initials: 'MB'
    },
    {
      quote: 'He rebuilt our Shopify storefronts and the performance gains were immediate — faster load times and a measurable lift in conversions. Reliable and proactive throughout.',
      name: 'Sarah Mitchell',
      role: 'Project Manager · Endrock Growth',
      initials: 'SM'
    },
    {
      quote: 'A calm, dependable frontend engineer. He handled complex enterprise invoicing features and resolved production issues under pressure without ever dropping the ball.',
      name: 'Andrés Gómez',
      role: 'Engineering Lead · Facture S.A.S',
      initials: 'AG'
    }
  ];

  /**
   * "Trusted by" logo wall. These render as branded monogram badges.
   * To use official logos instead, drop image files in src/assets/logos/ and
   * swap the badge markup for <img> tags in the template.
   */
  companies: CompanyLogo[] = [
    { name: 'Digiprint', initials: 'DP', color: '#06fba9' },
    { name: 'Endrock Growth', initials: 'EG', color: '#00b4d8' },
    { name: 'Facture S.A.S', initials: 'FA', color: '#7c5cff' },
    { name: 'NEO ONE', initials: 'N1', color: '#06fba9' },
    { name: 'UT Bolívar', initials: 'UB', color: '#00b4d8' }
  ];
}
