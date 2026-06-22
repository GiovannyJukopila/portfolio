import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StoreBadgesComponent } from '../../shared/components/store-badges/store-badges.component';

interface StoreLink { type: 'ios' | 'android'; url: string; }

type Category = 'SaaS' | 'Web' | 'Mobile';

interface Project {
  title: string;
  category: Category;          // primary tag shown on the card
  filters?: Category[];        // extra categories this project should match
  image: string;
  description: string;
  result?: string;            // outcome-focused highlight (the client value)
  tech: string[];
  link?: string;
  github?: string;
  stores?: StoreLink[];
  featured?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule, StoreBadgesComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  filter = signal<string>('All');

  categories = ['All', 'SaaS', 'Web', 'Mobile'];

  projects: Project[] = [
    {
      title: 'NEO ONE · Loyalty Platform',
      category: 'SaaS',
      filters: ['Mobile'],
      image: 'assets/projects/neoone.jpg',
      description: 'All-in-one loyalty SaaS for retail & hospitality. Multi-tenant web platform plus native mobile apps with points, rewards and analytics.',
      result: 'Shipped to App Store & Google Play, serving multiple businesses from a single multi-tenant platform.',
      tech: ['Angular', 'Flutter', 'Firebase', 'Node.js', 'AWS'],
      link: 'https://neo-one.eu/',
      stores: [
        { type: 'ios', url: 'https://apps.apple.com/app/neo-one/id6762820197' },
        { type: 'android', url: 'https://play.google.com/store/apps/details?id=com.neoone.app' },
      ],
      featured: true,
    },
    {
      title: 'NeoApp · Sports Manager',
      category: 'SaaS',
      filters: ['Mobile'],
      image: 'assets/projects/neoappgym.jpg',
      description: 'Gym & sports management platform: member management, scheduling, plans and real-time access control across web and mobile.',
      result: 'Replaced manual check-ins with real-time access control, streamlining daily operations for gyms.',
      tech: ['Angular', 'Flutter', 'Firebase', 'Firestore'],
      link: 'https://neoappgym.com/',
    },
    {
      title: 'NEO APP International',
      category: 'Web',
      image: 'assets/projects/neoapp.jpg',
      description: 'Corporate landing for an enterprise software company. Scalable applications, premium UI and a lead-generation focused design.',
      result: 'Lead-generation focused design that gives the company a premium, trust-building first impression.',
      tech: ['Angular', 'SCSS', 'AWS'],
      link: 'https://neo-app.eu/',
    },
    {
      title: 'Osteosur Colombia',
      category: 'Web',
      image: 'assets/projects/osteosur.jpg',
      description: 'Corporate site & product catalog for a medical-device distributor (osteosynthesis & surgical materials) with a clean, trust-driven design.',
      result: 'Gave a medical-device distributor a credible online presence and an easy-to-browse product catalog.',
      tech: ['Angular', 'SCSS', 'Netlify'],
      link: 'https://osteosur.netlify.app/',
    },
    {
      title: 'Comecat · Metalmechanics',
      category: 'Web',
      image: 'assets/projects/comecat.jpg',
      description: 'Industrial website for a metalworking & precision-engineering company, showcasing capabilities, projects and certifications.',
      result: 'Turned a B2B manufacturer\'s capabilities and certifications into a clear, sales-ready showcase.',
      tech: ['Angular', 'SCSS', 'Netlify'],
      link: 'https://comecatesting.netlify.app/',
    },
  ];

  filteredProjects = computed(() => {
    const f = this.filter();
    if (f === 'All') return this.projects;
    return this.projects.filter(p => p.category === f || p.filters?.includes(f as Category));
  });

  setFilter(category: string) {
    this.filter.set(category);
  }

  storeUrl(project: Project, type: 'ios' | 'android'): string | undefined {
    return project.stores?.find(s => s.type === type)?.url;
  }
}
