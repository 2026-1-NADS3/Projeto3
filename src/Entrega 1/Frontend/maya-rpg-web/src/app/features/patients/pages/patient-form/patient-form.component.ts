import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import type { IPatientRepository } from '../../../../core/interfaces';
import type { Patient } from '../../../../core/entities/patient.entity';
import { PatientStatus } from '../../../../core/enums/patient-status.enum';
import { PATIENT_REPOSITORY } from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './patient-form.component.html',
  styleUrl: './patient-form.component.scss',
})
export class PatientFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  patientId: string | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  statusOptions = [
    { label: 'Ativo', value: PatientStatus.ACTIVE },
    { label: 'Inativo', value: PatientStatus.INACTIVE },
    { label: 'Pendente', value: PatientStatus.PENDING },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
  ) {}

  ngOnInit(): void {
    this.buildForm();

    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId && this.patientId !== 'new') {
      this.isEditing = true;
      this.loadPatient(this.patientId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      cep: [''],
      status: [PatientStatus.PENDING, [Validators.required]],
      notes: [''],
      lgpdConsent: [false],
    });
  }

  private loadPatient(id: string): void {
    const state = window.history.state as { patient?: Patient };

    if (state?.patient) {
      this.patchForm(state.patient);
      return;
    }

    this.isLoading = true;
    this.patientRepo.getById(id).subscribe({
      next: (patient) => {
        this.patchForm(patient);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar paciente.';
        this.isLoading = false;
      },
    });
  }

  private patchForm(patient: Patient): void {
    this.form.patchValue({
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      cpf: patient.cpf,
      birthDate: this.formatDateForInput(patient.birthDate),
      status: patient.status,
      notes: patient.notes || '',
      lgpdConsent: !!patient.lgpdConsentAt,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    const { cep, lgpdConsent, ...patientData } = formValue;
    const data = {
      ...patientData,
      birthDate: new Date(patientData.birthDate),
      lgpdConsentAt: lgpdConsent ? new Date() : null,
    };

    const request = this.isEditing
      ? this.patientRepo.update(this.patientId!, data)
      : this.patientRepo.create(data);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/patients']);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Erro ao salvar paciente. Tente novamente.';
      },
    });
  }
  
  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  get f() {
    return this.form.controls;
  }
}
