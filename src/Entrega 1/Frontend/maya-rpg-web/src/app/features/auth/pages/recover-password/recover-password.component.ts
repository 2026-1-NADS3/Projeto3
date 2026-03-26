import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IAuthService } from '../../../../core/interfaces';
import { AUTH_SERVICE } from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="recover-page">
      <div class="recover-card">
        <h2>Recuperar Senha</h2>
        <p class="subtitle">Informe seu e-mail para receber o link de recuperação.</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input id="email" type="email" formControlName="email" class="form-input" placeholder="seu@email.com" />
          </div>

          <div class="success-msg" *ngIf="sent">
            E-mail de recuperação enviado com sucesso.
          </div>

          <button type="submit" class="btn-submit" [disabled]="isLoading || form.invalid">
            {{ isLoading ? 'Enviando...' : 'Enviar' }}
          </button>

          <a routerLink="/auth/login" class="back-link">Voltar ao login</a>
        </form>
      </div>
    </div>
  `,
  styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent {
  form: FormGroup;
  isLoading = false;
  sent = false;

  constructor(
    private readonly fb: FormBuilder,
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.authService.recoverPassword(this.form.value.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.sent = true;
      },
      error: () => {
        this.isLoading = false;
        this.sent = true; // Não revelar se email existe ou não (segurança)
      },
    });
  }
}
