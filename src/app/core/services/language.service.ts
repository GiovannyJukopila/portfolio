import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<string>('en');

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage() {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.setLanguage(savedLang);
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }
}
