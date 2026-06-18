import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Skill { name: string; icon: string; level: number; }
interface SkillCategory { name: string; icon: string; skills: Skill[]; }

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements AfterViewInit {
  @ViewChildren('bar') bars!: QueryList<ElementRef<HTMLElement>>;

  skillCategories: SkillCategory[] = [
    {
      name: 'Frontend',
      icon: 'ph-browser',
      skills: [
        { name: 'Angular', icon: 'ph-angular-logo', level: 95 },
        { name: 'TypeScript', icon: 'ph-file-ts', level: 90 },
        { name: 'React.js', icon: 'ph-atom', level: 80 },
        { name: 'HTML5 / CSS / SCSS', icon: 'ph-paint-brush', level: 95 }
      ]
    },
    {
      name: 'Backend',
      icon: 'ph-stack',
      skills: [
        { name: 'Node.js / Express', icon: 'ph-nodejs-logo', level: 85 },
        { name: '.NET', icon: 'ph-windows-logo', level: 80 },
        { name: 'Python', icon: 'ph-file-py', level: 70 },
        { name: 'REST APIs', icon: 'ph-plugs-connected', level: 90 }
      ]
    },
    {
      name: 'Mobile',
      icon: 'ph-device-mobile',
      skills: [
        { name: 'Flutter', icon: 'ph-device-mobile-camera', level: 85 },
        { name: 'FlutterFlow', icon: 'ph-lightning', level: 80 }
      ]
    },
    {
      name: 'Databases & Cloud',
      icon: 'ph-cloud',
      skills: [
        { name: 'Firebase', icon: 'ph-fire', level: 90 },
        { name: 'PostgreSQL / SQL', icon: 'ph-database', level: 85 },
        { name: 'AWS', icon: 'ph-cloud-arrow-up', level: 80 },
        { name: 'Git & CI/CD', icon: 'ph-git-branch', level: 90 }
      ]
    }
  ];

  ngAfterViewInit() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.bars.forEach(bar => {
      const target = bar.nativeElement.dataset['level'] + '%';
      if (reduced) { bar.nativeElement.style.width = target; return; }
      gsap.fromTo(bar.nativeElement, { width: '0%' }, {
        width: target,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: bar.nativeElement, start: 'top 92%' }
      });
    });
  }
}
