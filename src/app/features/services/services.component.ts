import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

interface Service {
  icon: string;
  titleKey: string;
  textKey: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  services: Service[] = [
    { icon: 'ph-browsers', titleKey: 'SERVICES.S1_TITLE', textKey: 'SERVICES.S1_TEXT' },
    { icon: 'ph-device-mobile', titleKey: 'SERVICES.S2_TITLE', textKey: 'SERVICES.S2_TEXT' },
    { icon: 'ph-rocket-launch', titleKey: 'SERVICES.S3_TITLE', textKey: 'SERVICES.S3_TEXT' },
    { icon: 'ph-users-three', titleKey: 'SERVICES.S4_TITLE', textKey: 'SERVICES.S4_TEXT' }
  ];

  scrollToContact() {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
