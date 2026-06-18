import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SOCIAL_LINKS } from '../../core/profile';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  social = SOCIAL_LINKS;
  sent = false;

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  onSubmit() {
    if (this.contactForm.valid) {
      // Open the user's mail client pre-filled (no backend required).
      const { name, email, message } = this.contactForm.value;
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name} (${email})`);
      window.location.href = `mailto:${this.social.email}?subject=${subject}&body=${body}`;
      this.sent = true;
      this.contactForm.reset();
      setTimeout(() => (this.sent = false), 5000);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
