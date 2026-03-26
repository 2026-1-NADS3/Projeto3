import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { Patient } from '../../../../core/entities/patient.entity';
import type { IPatientRepository, PaginatedRequest } from '../../../../core/interfaces';
import { PatientStatus } from '../../../../core/enums/patient-status.enum';
import { PATIENT_REPOSITORY } from '../../../../core/tokens/injection-tokens';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, StatusBadgeComponent, ConfirmDialogComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  totalPatients = 0;
  totalPages = 0;
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  statusFilter?: PatientStatus;

  showDeleteDialog = false;
  deletingPatient: Patient | null = null;
  isDeleting = false;

  statusOptions: { label: string; value?: PatientStatus }[] = [
    { label: 'Todos', value: undefined },
    { label: 'Ativos', value: PatientStatus.ACTIVE },
    { label: 'Inativos', value: PatientStatus.INACTIVE },
    { label: 'Pendentes', value: PatientStatus.PENDING },
  ];

  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.isLoading = true;

    const params: PaginatedRequest = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
      sortBy: 'fullName',
      sortOrder: 'asc',
    };

    this.patientRepo.getAll(params, this.statusFilter).subscribe({
      next: (response) => {
        this.patients = response.data;
        this.totalPatients = response.total;
        this.totalPages = response.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadPatients();
  }

  onStatusFilter(status?: PatientStatus): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.loadPatients();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPatients();
  }

  navigateToNew(): void {
    this.router.navigate(['/patients/new']);
  }

  navigateToEdit(patient: Patient): void {
    this.router.navigate(['/patients', patient.id, 'edit'], {
      state: { patient }
    });
  }

  navigateToDetail(patient: Patient): void {
    this.router.navigate(['/patients', patient.id]);
  }

  openDeleteDialog(patient: Patient): void {
    this.deletingPatient = patient;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (!this.deletingPatient) return;
    this.isDeleting = true;
    this.patientRepo.delete(this.deletingPatient.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteDialog = false;
        this.deletingPatient = null;
        this.loadPatients();
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.deletingPatient = null;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  get pages(): number[] {
    const p: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    for (let i = start; i <= end; i++) {
      p.push(i);
    }
    return p;
  }
}
