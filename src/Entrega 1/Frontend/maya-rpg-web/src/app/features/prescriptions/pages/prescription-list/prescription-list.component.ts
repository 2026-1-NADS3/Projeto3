import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { Prescription } from '../../../../core/entities/prescription.entity';
import type {
  IPrescriptionRepository,
  IPatientRepository,
  PaginatedRequest,
} from '../../../../core/interfaces';
import {
  PRESCRIPTION_REPOSITORY,
  PATIENT_REPOSITORY,
} from '../../../../core/tokens/injection-tokens';
import type { Patient } from '../../../../core/entities/patient.entity';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, ConfirmDialogComponent],
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.scss',
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  patients: Map<string, Patient> = new Map();
  isLoading = false;

  showDeactivateDialog = false;
  deactivatingPrescription: Prescription | null = null;
  isDeactivating = false;

  constructor(
    @Inject(PRESCRIPTION_REPOSITORY) private readonly prescriptionRepo: IPrescriptionRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    // Carrega pacientes primeiro pra mostrar os nomes
    const params: PaginatedRequest = { page: 1, pageSize: 100 };
    this.patientRepo.getAll(params).subscribe({
      next: (res) => {
        res.data.forEach((p) => this.patients.set(p.id, p));
        this.loadPrescriptions();
      },
      error: () => {
        this.loadPrescriptions();
      },
    });
  }

  private loadPrescriptions(): void {
    // Hack: como o mock não tem getAll genérico, vamos buscar por cada paciente
    // Em produção a API tem GET /prescriptions que retorna todas
    const allPrescriptions: Prescription[] = [];
    const patientIds = Array.from(this.patients.keys());
    let completed = 0;

    if (patientIds.length === 0) {
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    patientIds.forEach((patientId) => {
      const params: PaginatedRequest = { page: 1, pageSize: 50 };
      this.prescriptionRepo.getByPatientId(patientId, params).subscribe({
        next: (res) => {
          allPrescriptions.push(...res.data);
          completed++;
          if (completed === patientIds.length) {
            this.prescriptions = allPrescriptions.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
        error: () => {
          completed++;
          if (completed === patientIds.length) {
            this.prescriptions = allPrescriptions;
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        },
      });
    });
  }

  getPatientName(patientId: string): string {
    return this.patients.get(patientId)?.fullName || 'Paciente desconhecido';
  }

  navigateToNew(): void {
    this.router.navigate(['/prescriptions/new']);
  }

  navigateToDetail(prescription: Prescription): void {
    this.router.navigate(['/prescriptions', prescription.id]);
  }

  openDeactivateDialog(prescription: Prescription): void {
    this.deactivatingPrescription = prescription;
    this.showDeactivateDialog = true;
  }

  confirmDeactivate(): void {
    if (!this.deactivatingPrescription) return;
    this.isDeactivating = true;
    this.prescriptionRepo.deactivate(this.deactivatingPrescription.id).subscribe({
      next: () => {
        this.isDeactivating = false;
        this.showDeactivateDialog = false;
        this.deactivatingPrescription = null;
        this.loadAll();
      },
      error: () => {
        this.isDeactivating = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelDeactivate(): void {
    this.showDeactivateDialog = false;
    this.deactivatingPrescription = null;
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
