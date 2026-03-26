import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo" *ngIf="!collapsed">
          <span class="logo-maya">maya</span>
          <span class="logo-yamamoto">yamamoto</span>
          <span class="logo-rpg">rpg</span>
        </div>
        <span class="logo-icon" *ngIf="collapsed">M</span>
      </div>

      <nav class="sidebar-nav">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          class="nav-item"
          [title]="item.label"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" *ngIf="!collapsed">{{ item.label }}</span>
        </a>
      </nav>

      <button class="toggle-btn" (click)="toggleCollapse()">
        {{ collapsed ? '▶' : '◀' }}
      </button>
    </aside>
  `,
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Pacientes', icon: '👥', route: '/patients' },
    { label: 'Exercícios', icon: '🏋️', route: '/exercises' },
    { label: 'Prescrições', icon: '📋', route: '/prescriptions' },
    { label: 'Prontuários', icon: '📁', route: '/medical-records' },
    { label: 'Aniversários', icon: '🎂', route: '/birthdays' },
  ];

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
