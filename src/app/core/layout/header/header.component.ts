import { Component, HostListener, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule, LanguageSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  scrollProgress = signal(0);
  activeSection = signal('home');

  private observer?: IntersectionObserver;

  navItems = [
    { label: 'NAV.HOME', link: 'home' },
    { label: 'NAV.ABOUT', link: 'about' },
    { label: 'NAV.SKILLS', link: 'skills' },
    { label: 'NAV.PROJECTS', link: 'projects' },
    { label: 'NAV.EXPERIENCE', link: 'experience' },
    { label: 'NAV.CONTACT', link: 'contact' }
  ];

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) this.activeSection.set(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    this.navItems.forEach(item => {
      const el = document.getElementById(item.link);
      if (el) this.observer!.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollTop = window.scrollY;
    this.isScrolled.set(scrollTop > 50);
    const height = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(height > 0 ? (scrollTop / height) * 100 : 0);
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.closeMobileMenu();
  }

  toggleMobileMenu() { this.isMobileMenuOpen.update(v => !v); }
  closeMobileMenu() { this.isMobileMenuOpen.set(false); }
}
