import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { MedicalRecord } from '../../../../core/entities/medical-record.entity';
import type {
  IMedicalRecordRepository,
  IPatientRepository,
  PaginatedRequest,
} from '../../../../core/interfaces';
import type { Patient } from '../../../../core/entities/patient.entity';
import {
  MEDICAL_RECORD_REPOSITORY,
  PATIENT_REPOSITORY,
} from '../../../../core/tokens/injection-tokens';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, ConfirmDialogComponent],
  templateUrl: './record-list.component.html',
  styleUrl: './record-list.component.scss',
})
export class RecordListComponent implements OnInit {
  records: MedicalRecord[] = [];
  patients: Patient[] = [];
  patientMap: Map<string, Patient> = new Map();
  isLoading = false;
  selectedPatientId = '';

  showDeleteDialog = false;
  deletingRecord: MedicalRecord | null = null;
  isDeleting = false;

  constructor(
    @Inject(MEDICAL_RECORD_REPOSITORY) private readonly recordRepo: IMedicalRecordRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  private loadPatients(): void {
    const params: PaginatedRequest = { page: 1, pageSize: 100 };
    this.patientRepo.getAll(params).subscribe({
      next: (res) => {
        this.patients = res.data;
        res.data.forEach((p) => this.patientMap.set(p.id, p));
        this.cdr.detectChanges();
      },
    });
  }

  onPatientSelect(patientId: string): void {
    this.selectedPatientId = patientId;
    if (patientId) {
      this.loadRecords(patientId);
    } else {
      this.records = [];
      this.cdr.detectChanges();
    }
  }

  private loadRecords(patientId: string): void {
    this.isLoading = true;
    const params: PaginatedRequest = { page: 1, pageSize: 50 };
    this.recordRepo.getByPatientId(patientId, params).subscribe({
      next: (res) => {
        this.records = res.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  getPatientName(patientId: string): string {
    return this.patientMap.get(patientId)?.fullName || 'Paciente desconhecido';
  }

  navigateToNew(): void {
    this.router.navigate(['/medical-records/new'], {
      queryParams: this.selectedPatientId ? { patientId: this.selectedPatientId } : {},
    });
  }

  navigateToDetail(record: MedicalRecord): void {
    this.router.navigate(['/medical-records', record.id]);
  }

  openDeleteDialog(record: MedicalRecord): void {
    this.deletingRecord = record;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (!this.deletingRecord) return;
    this.isDeleting = true;
    this.recordRepo.delete(this.deletingRecord.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteDialog = false;
        this.deletingRecord = null;
        if (this.selectedPatientId) this.loadRecords(this.selectedPatientId);
      },
      error: () => {
        this.isDeleting = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.deletingRecord = null;
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
