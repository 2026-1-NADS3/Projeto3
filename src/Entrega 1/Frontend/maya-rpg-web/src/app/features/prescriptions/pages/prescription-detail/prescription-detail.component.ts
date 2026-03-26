import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import type { Prescription } from '../../../../core/entities/prescription.entity';
import type {
  IPrescriptionRepository,
  IExerciseRepository,
  IPatientRepository,
  PaginatedRequest,
} from '../../../../core/interfaces';
import type { Exercise } from '../../../../core/entities/exercise.entity';
import type { Patient } from '../../../../core/entities/patient.entity';
import {
  PRESCRIPTION_REPOSITORY,
  EXERCISE_REPOSITORY,
  PATIENT_REPOSITORY,
} from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-prescription-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page" *ngIf="!isLoading && prescription">
      <a routerLink="/prescriptions" class="back-link">← Voltar para prescrições</a>

      <div class="detail-header">
        <div>
          <h1>{{ prescription.title }}</h1>
          <p class="patient-name">
            Paciente: <strong>{{ patientName }}</strong>
          </p>
          <span
            class="status-pill"
            [class.active]="prescription.isActive"
            [class.inactive]="!prescription.isActive"
          >
            {{ prescription.isActive ? 'Ativa' : 'Inativa' }}
          </span>
        </div>
      </div>

      <p class="description" *ngIf="prescription.description">{{ prescription.description }}</p>

      <div class="meta">
        <span>📅 Início: {{ formatDate(prescription.startDate) }}</span>
        <span *ngIf="prescription.endDate">📅 Término: {{ formatDate(prescription.endDate) }}</span>
      </div>

      <h3 class="section-title">Exercícios do plano ({{ prescription.exercises.length }})</h3>

      <div class="exercises-list">
        <div class="exercise-item" *ngFor="let ex of prescription.exercises">
          <div class="exercise-header">
            <span class="order">{{ ex.order }}</span>
            <span class="title">{{ getExerciseTitle(ex.exerciseId) }}</span>
          </div>
          <div class="exercise-meta">
            <span *ngIf="ex.sets">{{ ex.sets }} séries</span>
            <span *ngIf="ex.repetitions">{{ ex.repetitions }} rep</span>
            <span *ngIf="ex.holdTimeSeconds">{{ ex.holdTimeSeconds }}s sustentação</span>
            <span>{{ ex.frequency }}</span>
          </div>
          <p class="exercise-notes" *ngIf="ex.notes">{{ ex.notes }}</p>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="isLoading">Carregando...</div>
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
        margin-bottom: 1rem;
      }
      .detail-header h1 {
        margin-bottom: 0.25rem;
      }
      .patient-name {
        font-size: 0.875rem;
        color: #6e6b62;
        margin-bottom: 0.5rem;
      }
      .patient-name strong {
        color: #2e2d29;
      }
      .status-pill {
        display: inline-flex;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .status-pill.active {
        background: rgba(58, 158, 111, 0.1);
        color: #2d7a56;
      }
      .status-pill.inactive {
        background: rgba(154, 150, 137, 0.12);
        color: #6e6b62;
      }
      .description {
        font-size: 0.875rem;
        color: #4a4842;
        margin-bottom: 1rem;
      }
      .meta {
        display: flex;
        gap: 1.5rem;
        font-size: 0.75rem;
        color: #9a9689;
        margin-bottom: 1.5rem;
      }
      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: #4a4842;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f1efe8;
      }
      .exercises-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .exercise-item {
        background: #fff;
        border: 1px solid #e2dfd5;
        border-radius: 8px;
        padding: 1rem;
      }
      .exercise-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }
      .order {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #2b7a8c;
        color: #fff;
        font-size: 0.75rem;
        font-weight: 600;
      }
      .title {
        font-size: 0.875rem;
        font-weight: 500;
        color: #2e2d29;
      }
      .exercise-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.75rem;
        color: #9a9689;
      }
      .exercise-notes {
        font-size: 0.75rem;
        color: #6e6b62;
        margin-top: 0.5rem;
        font-style: italic;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: #9a9689;
      }
    `,
  ],
})
export class PrescriptionDetailComponent implements OnInit {
  prescription: Prescription | null = null;
  patientName = '';
  exerciseMap: Map<string, string> = new Map();
  isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PRESCRIPTION_REPOSITORY) private readonly prescriptionRepo: IPrescriptionRepository,
    @Inject(EXERCISE_REPOSITORY) private readonly exerciseRepo: IExerciseRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    }
  }

  private load(id: string): void {
    this.isLoading = true;

    // Carrega exercícios pra mapear nomes
    const params: PaginatedRequest = { page: 1, pageSize: 100 };
    this.exerciseRepo.getAll(params).subscribe({
      next: (res) => {
        res.data.forEach((e) => this.exerciseMap.set(e.id, e.title));
        this.loadPrescription(id);
      },
      error: () => this.loadPrescription(id),
    });
  }

  private loadPrescription(id: string): void {
    this.prescriptionRepo.getById(id).subscribe({
      next: (prescription) => {
        this.prescription = prescription;
        this.loadPatient(prescription.patientId);
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadPatient(patientId: string): void {
    this.patientRepo.getById(patientId).subscribe({
      next: (patient) => {
        this.patientName = patient.fullName;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.patientName = 'Paciente desconhecido';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getExerciseTitle(exerciseId: string): string {
    return this.exerciseMap.get(exerciseId) || 'Exercício desconhecido';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
