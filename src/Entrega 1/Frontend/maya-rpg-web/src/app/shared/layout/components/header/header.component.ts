import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../../../core/entities';
import { IAuthService } from '../../../../core/interfaces';
import { AUTH_SERVICE } from '../../../../core/tokens/injection-tokens';
import { TokenStorageService } from '../../../../data/services/token-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <h2 class="page-title">{{ pageTitle }}</h2>
      </div>

      <div class="header-right">
        <div class="user-menu" (click)="toggleMenu()">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <span class="user-name">{{ currentUser?.name || 'Profissional' }}</span>

          <div class="dropdown-menu" *ngIf="menuOpen">
            <button class="dropdown-item" (click)="logout()">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  pageTitle = 'Dashboard';
  menuOpen = false;

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
    private readonly tokenStorage: TokenStorageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.tokenStorage.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => (this.currentUser = user),
      });
    }
  }

  get userInitials(): string {
    if (!this.currentUser?.name) return 'P';
    return this.currentUser.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/auth/login']),
      error: () => {
        this.tokenStorage.clear();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
