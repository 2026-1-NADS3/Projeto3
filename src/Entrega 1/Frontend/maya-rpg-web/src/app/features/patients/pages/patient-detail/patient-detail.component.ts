import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import type { Patient } from '../../../../core/entities/patient.entity';
import type { IPatientRepository } from '../../../../core/interfaces';
import { PATIENT_REPOSITORY } from '../../../../core/tokens/injection-tokens';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="page" *ngIf="!isLoading && patient">
      <a routerLink="/patients" class="back-link">← Voltar para pacientes</a>

      <div class="detail-header">
        <div>
          <h1>{{ patient.fullName }}</h1>
          <app-status-badge [status]="patient.status"></app-status-badge>
        </div>
        <button class="btn btn--primary" (click)="goToEdit()">✏️ Editar</button>
      </div>

      <div class="detail-grid">
        <!-- Dados pessoais -->
        <div class="detail-card">
          <h3 class="card-title">Dados pessoais</h3>
          <div class="info-row">
            <span class="info-label">E-mail</span>
            <span class="info-value">{{ patient.email }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Telefone</span>
            <span class="info-value">{{ patient.phone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">CPF</span>
            <span class="info-value">{{ patient.cpf }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Data de nascimento</span>
            <span class="info-value">{{ formatDate(patient.birthDate) }}</span>
          </div>
        </div>

        <!-- Informações clínicas -->
        <div class="detail-card">
          <h3 class="card-title">Informações clínicas</h3>
          <div class="info-row">
            <span class="info-label">Observações</span>
            <span class="info-value">{{ patient.notes || 'Nenhuma observação' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Consentimento LGPD</span>
            <span class="info-value">{{
              patient.lgpdConsentAt ? formatDate(patient.lgpdConsentAt) : 'Não consentiu'
            }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Cadastrado em</span>
            <span class="info-value">{{ formatDate(patient.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Última atualização</span>
            <span class="info-value">{{ formatDate(patient.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="isLoading">Carregando...</div>

    <div class="error" *ngIf="errorMessage">
      <p>{{ errorMessage }}</p>
      <a routerLink="/patients" class="back-link">← Voltar para pacientes</a>
    </div>
  `,
  styles: [
    `
      .back-link {
        display: inline-block;
        font-size: 0.875rem;
        color: #2b7a8c;
        margin-bottom: 1rem;
        text-decoration: none;
      }
      .back-link:hover {
        color: #1a4f5c;
        text-decoration: underline;
      }

      .detail-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;
      }
      .detail-header h1 {
        margin-bottom: 0.25rem;
      }
      .detail-header > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: none;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
      }
      .btn--primary {
        background-color: #2b7a8c;
        color: #fff;
      }
      .btn--primary:hover {
        background-color: #1a4f5c;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: 1.5rem;
      }

      .detail-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e2dfd5;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
        padding: 1.5rem;
      }

      .card-title {
        font-size: 1rem;
        font-weight: 600;
        color: #4a4842;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f1efe8;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f8f7f4;
      }
      .info-row:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 0.875rem;
        color: #9a9689;
        flex-shrink: 0;
      }

      .info-value {
        font-size: 0.875rem;
        color: #2e2d29;
        text-align: right;
        font-weight: 500;
      }

      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: #9a9689;
        font-size: 0.875rem;
      }

      .error {
        text-align: center;
        padding: 3rem;
        color: #e25c5c;
      }
    `,
  ],
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(id);
    }
  }

  private loadPatient(id: string): void {
    const state = window.history.state as { patient?: Patient };

    if (state?.patient) {
      this.patient = state.patient;
      return;
    }

    this.isLoading = true;
    this.patientRepo.getById(id).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Paciente não encontrado.';
        this.isLoading = false;
      },
    });
  }

  goToEdit(): void {
    if (this.patient) {
      this.router.navigate(['/patients', this.patient.id, 'edit'], {
        state: { patient: this.patient },
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
