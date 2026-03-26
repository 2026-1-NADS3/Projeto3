import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import type { MedicalRecord } from '../../../../core/entities/medical-record.entity';
import type { IMedicalRecordRepository, IPatientRepository } from '../../../../core/interfaces';
import {
  MEDICAL_RECORD_REPOSITORY,
  PATIENT_REPOSITORY,
} from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-record-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page" *ngIf="!isLoading && record">
      <a routerLink="/medical-records" class="back-link">← Voltar para prontuários</a>

      <div class="detail-header">
        <h1>Registro Clínico</h1>
        <span class="date">📅 {{ formatDate(record.date) }}</span>
      </div>

      <p class="patient-name">
        Paciente: <strong>{{ patientName }}</strong>
      </p>

      <div class="detail-grid">
        <div class="detail-card" *ngIf="record.chiefComplaint">
          <h3 class="card-title">Queixa principal</h3>
          <p class="card-text">{{ record.chiefComplaint }}</p>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Notas clínicas</h3>
          <p class="card-text">{{ record.clinicalNotes }}</p>
        </div>

        <div class="detail-card" *ngIf="record.painLevel != null">
          <h3 class="card-title">Nível de dor</h3>
          <div class="pain-display">
            <span class="pain-number" [style.color]="getPainColor(record.painLevel)">{{
              record.painLevel
            }}</span>
            <span class="pain-scale">/10</span>
          </div>
        </div>

        <div class="detail-card" *ngIf="record.mobilityNotes">
          <h3 class="card-title">Mobilidade</h3>
          <p class="card-text">{{ record.mobilityNotes }}</p>
        </div>

        <div class="detail-card" *ngIf="record.postureAssessment">
          <h3 class="card-title">Avaliação postural</h3>
          <p class="card-text">{{ record.postureAssessment }}</p>
        </div>

        <div class="detail-card" *ngIf="record.treatmentPlan">
          <h3 class="card-title">Plano de tratamento</h3>
          <p class="card-text">{{ record.treatmentPlan }}</p>
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }
      .date {
        font-size: 0.875rem;
        color: #9a9689;
      }
      .patient-name {
        font-size: 0.875rem;
        color: #6e6b62;
        margin-bottom: 1.5rem;
      }
      .patient-name strong {
        color: #2e2d29;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f1efe8;
      }
      .card-text {
        font-size: 0.875rem;
        color: #4a4842;
        line-height: 1.6;
      }
      .pain-display {
        display: flex;
        align-items: baseline;
        gap: 2px;
      }
      .pain-number {
        font-size: 2.5rem;
        font-weight: 700;
      }
      .pain-scale {
        font-size: 1rem;
        color: #9a9689;
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
export class RecordDetailComponent implements OnInit {
  record: MedicalRecord | null = null;
  patientName = '';
  isLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    @Inject(MEDICAL_RECORD_REPOSITORY) private readonly recordRepo: IMedicalRecordRepository,
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
    this.recordRepo.getById(id).subscribe({
      next: (record) => {
        this.record = record;
        this.patientRepo.getById(record.patientId).subscribe({
          next: (patient) => {
            this.patientName = patient.fullName;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.patientName = 'Desconhecido';
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getPainColor(level: number): string {
    if (level <= 3) return '#3A9E6F';
    if (level <= 6) return '#E6A23C';
    return '#E25C5C';
  }
}
