import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import type {
  IPatientRepository,
  IExerciseRepository,
  IPrescriptionRepository,
  PaginatedRequest,
} from '../../../../core/interfaces';
import type { Patient } from '../../../../core/entities/patient.entity';
import type { Exercise } from '../../../../core/entities/exercise.entity';
import type { PrescriptionExercise } from '../../../../core/entities/prescription.entity';
import {
  PATIENT_REPOSITORY,
  EXERCISE_REPOSITORY,
  PRESCRIPTION_REPOSITORY,
} from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './prescription-form.component.html',
  styleUrl: './prescription-form.component.scss',
})
export class PrescriptionFormComponent implements OnInit {
  form!: FormGroup;
  patients: Patient[] = [];
  exercises: Exercise[] = [];
  selectedExercises: (PrescriptionExercise & { title: string })[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    @Inject(PATIENT_REPOSITORY) private readonly patientRepo: IPatientRepository,
    @Inject(EXERCISE_REPOSITORY) private readonly exerciseRepo: IExerciseRepository,
    @Inject(PRESCRIPTION_REPOSITORY) private readonly prescriptionRepo: IPrescriptionRepository,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadPatients();
    this.loadExercises();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: ['', Validators.required],
      endDate: [''],
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

  private loadExercises(): void {
    const params: PaginatedRequest = { page: 1, pageSize: 100 };
    this.exerciseRepo.getAll(params).subscribe({
      next: (res) => {
        this.exercises = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  addExercise(exerciseId: string): void {
    if (!exerciseId || this.selectedExercises.find((e) => e.exerciseId === exerciseId)) return;
    const exercise = this.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    this.selectedExercises.push({
      exerciseId: exercise.id,
      title: exercise.title,
      sets: 3,
      repetitions: 1,
      holdTimeSeconds: 30,
      frequency: '3x por semana',
      notes: '',
      order: this.selectedExercises.length + 1,
    });
    this.cdr.detectChanges();
  }

  removeExercise(index: number): void {
    this.selectedExercises.splice(index, 1);
    this.selectedExercises.forEach((e, i) => (e.order = i + 1));
    this.cdr.detectChanges();
  }

  moveUp(index: number): void {
    if (index === 0) return;
    [this.selectedExercises[index - 1], this.selectedExercises[index]] = [
      this.selectedExercises[index],
      this.selectedExercises[index - 1],
    ];
    this.selectedExercises.forEach((e, i) => (e.order = i + 1));
  }

  moveDown(index: number): void {
    if (index === this.selectedExercises.length - 1) return;
    [this.selectedExercises[index], this.selectedExercises[index + 1]] = [
      this.selectedExercises[index + 1],
      this.selectedExercises[index],
    ];
    this.selectedExercises.forEach((e, i) => (e.order = i + 1));
  }

  get availableExercises(): Exercise[] {
    const selectedIds = this.selectedExercises.map((e) => e.exerciseId);
    return this.exercises.filter((e) => !selectedIds.includes(e.id));
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedExercises.length === 0) {
      this.form.markAllAsTouched();
      if (this.selectedExercises.length === 0) {
        this.errorMessage = 'Adicione pelo menos um exercício à prescrição.';
      }
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    const data = {
      ...formValue,
      professionalId: 'prof-1',
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
      isActive: true,
      exercises: this.selectedExercises.map(({ title, ...rest }) => rest),
    };

    this.prescriptionRepo.create(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/prescriptions']);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Erro ao salvar prescrição.';
        this.cdr.detectChanges();
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}
