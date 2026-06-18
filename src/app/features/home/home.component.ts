import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxParticlesModule } from "@tsparticles/angular";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ContactComponent } from '../contact/contact.component';
import { SOCIAL_LINKS } from '../../core/profile';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxParticlesModule,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroContent') heroContent!: ElementRef<HTMLElement>;
  @ViewChild('heroVisual') heroVisual!: ElementRef<HTMLElement>;
  @ViewChild('roleText') roleText!: ElementRef<HTMLElement>;

  social = SOCIAL_LINKS;

  roles = ['Full-Stack Engineer', 'AI-Augmented Developer', 'Mobile & Cloud Builder', 'Adaptable Problem-Solver'];
  private roleTimer?: ReturnType<typeof setInterval>;
  private magneticCleanup: Array<() => void> = [];

  particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        resize: { enable: true },
      },
      modes: {
        grab: { distance: 160, links: { opacity: 0.35 } },
      },
    },
    particles: {
      color: { value: "#06fba9" },
      links: { color: "#06fba9", distance: 150, enable: true, opacity: 0.12, width: 1 },
      move: {
        direction: MoveDirection.none, enable: true,
        outModes: { default: OutMode.bounce }, random: false, speed: 0.6, straight: false,
      },
      number: { density: { enable: true, area: 900 }, value: 55 },
      opacity: { value: 0.22 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  };

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.zone.runOutsideAngular(() => {
      if (!prefersReduced) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from(this.heroContent.nativeElement.children, {
          y: 40, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'all'
        });
        if (this.heroVisual) {
          tl.from(this.heroVisual.nativeElement, {
            scale: 0.85, opacity: 0, duration: 1, clearProps: 'all'
          }, '-=0.7');
        }
      }

      this.initScrollAnimations(prefersReduced);
      this.initMagnetic();
    });

    this.startRoleRotator();
  }

  ngOnDestroy() {
    if (this.roleTimer) clearInterval(this.roleTimer);
    this.magneticCleanup.forEach(fn => fn());
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  private startRoleRotator() {
    let i = 0;
    const el = this.roleText?.nativeElement;
    if (!el) return;
    this.roleTimer = setInterval(() => {
      i = (i + 1) % this.roles.length;
      this.zone.runOutsideAngular(() => {
        gsap.to(el, {
          opacity: 0, y: -8, duration: 0.25, ease: 'power1.in',
          onComplete: () => {
            el.textContent = this.roles[i];
            gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power1.out' });
          }
        });
      });
    }, 2600);
  }

  private initMagnetic() {
    const buttons = this.heroContent?.nativeElement.querySelectorAll<HTMLElement>('.magnetic');
    buttons?.forEach(btn => {
      const move = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
      };
      const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      this.magneticCleanup.push(() => {
        btn.removeEventListener('mousemove', move);
        btn.removeEventListener('mouseleave', leave);
      });
    });
  }

  private initScrollAnimations(prefersReduced: boolean) {
    if (prefersReduced) return;
    ['#about', '#skills', '#projects', '#experience', '#contact'].forEach(id => {
      gsap.from(id, {
        scrollTrigger: { trigger: id, start: 'top 82%', toggleActions: 'play none none reverse' },
        y: 48, opacity: 0, duration: 0.9, ease: 'power3.out'
      });
    });
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
