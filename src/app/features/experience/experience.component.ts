import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TimelineComponent, TimelineEvent } from '../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, TranslateModule, TimelineComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  experienceEvents: TimelineEvent[] = [
    {
      date: 'May 2023 – Present',
      title: 'Full Stack Developer',
      company: 'Digiprint',
      location: 'Msida, Malta',
      description: 'Design, build, deploy and maintain scalable web & mobile apps. RESTful APIs, auth flows and DB integrations. Extensive Firebase work (Firestore, Auth, Cloud Functions, Storage, Security Rules) and AWS deployments. Contributed to multi-tenant architecture decisions.',
      tags: ['Angular', 'Flutter', 'Node.js', 'Firebase', 'PostgreSQL', 'AWS']
    },
    {
      date: 'Sep 2022 – May 2023',
      title: 'Full Stack Developer',
      company: 'Endrock Growth and Analytics',
      location: 'Remote',
      description: 'Built and maintained e-commerce storefronts on Shopify. Customized themes and templates, implemented performance optimizations that improved load speed and conversion, and integrated third-party apps (payments, shipping, analytics).',
      tags: ['Shopify', 'Liquid', 'JavaScript', 'SASS']
    },
    {
      date: 'Oct 2021 – Sep 2022',
      title: 'Frontend Developer',
      company: 'Facture S.A.S',
      location: 'Colombia',
      description: 'Developed features for electronic invoicing systems with Angular and .NET. Built scalable enterprise components, provided technical support and resolved escalated production issues alongside QA.',
      tags: ['Angular', '.NET', 'TypeScript']
    },
    {
      date: 'Jun 2020 – Dec 2020',
      title: 'Computer Engineer Intern',
      company: 'Technological University of Bolívar',
      location: 'Cartagena, Colombia',
      description: 'Developed and maintained frontend features for a university web platform with Angular. Provided technical support and delivered training sessions to end-users and stakeholders.',
      tags: ['Angular', 'HTML', 'CSS']
    }
  ];
}
