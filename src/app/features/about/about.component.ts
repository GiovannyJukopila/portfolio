import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TimelineComponent, TimelineEvent } from '../../shared/components/timeline/timeline.component';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Stat { value: string; labelKey: string; }

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, TimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('storyCol') storyCol!: ElementRef;

  softSkills = ['Leadership', 'Teamwork', 'Fast Learning', 'Problem Solving', 'Responsibility', 'Highly Motivated'];

  languages = [
    { name: 'Spanish', level: 'Native' },
    { name: 'English', level: 'C1' }
  ];

  stats: Stat[] = [
    { value: '5+', labelKey: 'ABOUT.STAT_YEARS' },
    { value: '5+', labelKey: 'ABOUT.STAT_PROJECTS' },
    { value: '2', labelKey: 'ABOUT.STAT_APPS' },
    { value: '4', labelKey: 'ABOUT.STAT_COMPANIES' }
  ];

  educationEvents: TimelineEvent[] = [
    {
      date: '2014 – 2021',
      title: 'B.Sc. Computer Engineering',
      company: 'Technological University of Bolívar',
      location: 'Cartagena, Colombia',
      description: 'Computer Engineering degree with a focus on software development and systems.'
    },
    {
      date: 'Aug 2023',
      title: 'Angular Certifications',
      company: 'Platzi',
      description: 'Angular Fundamentals, Components & Services, Router (Lazy Loading & Modular Programming) and Consuming REST APIs.'
    },
    {
      date: '2020',
      title: 'Seminar in Project Management',
      company: 'Technological University of Bolívar',
      description: 'Foundations of project planning, scope and delivery management.'
    }
  ];

  ngAfterViewInit() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from(this.storyCol.nativeElement, {
      scrollTrigger: { trigger: this.storyCol.nativeElement, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: -50, opacity: 0, duration: 0.8, ease: 'power2.out'
    });
  }
}
