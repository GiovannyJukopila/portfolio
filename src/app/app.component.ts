import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { WhatsappFabComponent } from './shared/components/whatsapp-fab/whatsapp-fab.component';
import { NgParticlesService } from "@tsparticles/angular";
import { loadSlim } from "@tsparticles/slim";
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, WhatsappFabComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'portfolio';
  private readonly particlesService = inject(NgParticlesService);
  private readonly languageService = inject(LanguageService);

  ngOnInit(): void {
    this.particlesService.init(async engine => {
      await loadSlim(engine);
    });
  }
}
