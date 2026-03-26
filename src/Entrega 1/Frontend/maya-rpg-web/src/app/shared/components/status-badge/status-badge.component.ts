import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientStatus } from '../../../core/enums/patient-status.enum';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="'badge--' + status.toLowerCase()">
      {{ label }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.02em;
    }
    .badge--active {
      background-color: rgba(58, 158, 111, 0.1);
      color: #2d7a56;
    }
    .badge--inactive {
      background-color: rgba(154, 150, 137, 0.12);
      color: #6E6B62;
    }
    .badge--pending {
      background-color: rgba(230, 162, 60, 0.1);
      color: #b07d2a;
    }
  `],
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: PatientStatus;

  get label(): string {
    const labels: Record<PatientStatus, string> = {
      [PatientStatus.ACTIVE]: 'Ativo',
      [PatientStatus.INACTIVE]: 'Inativo',
      [PatientStatus.PENDING]: 'Pendente',
    };
    return labels[this.status] || this.status;
  }
}
