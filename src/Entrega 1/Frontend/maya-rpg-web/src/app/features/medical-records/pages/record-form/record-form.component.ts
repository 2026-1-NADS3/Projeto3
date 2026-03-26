import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './record-form.component.html',
  styleUrl: './record-form.component.scss',
})
export class RecordFormComponent implements OnInit {
  form!: FormGroup;
  patients: Patient[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    @Inject(MEDICAL_RECORD_REPOSITORY) private readonly recordRepo: IMedicalRecordRepository,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadPatients();

    const patientId = this.route.snapshot.queryParamMap.get('patientId');
    if (patientId) {
      this.form.patchValue({ patientId });
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      chiefComplaint: [''],
      clinicalNotes: ['', Validators.required],
      painLevel: [null],
      mobilityNotes: [''],
      postureAssessment: [''],
      treatmentPlan: [''],
    });
  }

  private loadPatients(): void {
    const params: PaginatedRequest = { page: 1, pageSize: 100 };
    this.patientRepo.getAll(params).subscribe({
      next: (res) => {
        this.patients = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const data = {
      ...this.form.value,
      professionalId: 'prof-temp',
    };

    this.recordRepo.create(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/medical-records']);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Erro ao salvar registro.';
        this.cdr.detectChanges();
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}
