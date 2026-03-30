import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p class="subtitle">Visão geral da clínica Maya Yamamoto RPG</p>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">--</span>
          <span class="stat-label">Pacientes ativos</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">--</span>
          <span class="stat-label">Exercícios cadastrados</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">--</span>
          <span class="stat-label">Prescrições ativas</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">--%</span>
          <span class="stat-label">Adesão média</span>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard-home.component.scss',
})
export class DashboardHomeComponent {}
