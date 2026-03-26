import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import type { IExerciseRepository } from '../../../../core/interfaces';
import { ExerciseCategory } from '../../../../core/enums/exercise-category.enum';
import { EXERCISE_REPOSITORY } from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss',
})
export class ExerciseFormComponent implements OnInit {
  form!: FormGroup;
  isEditing = false;
  exerciseId: string | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  tagsInput = '';

  categoryOptions = [
    { label: 'Alongamento', value: ExerciseCategory.STRETCHING },
    { label: 'Fortalecimento', value: ExerciseCategory.STRENGTHENING },
    { label: 'Postura', value: ExerciseCategory.POSTURE },
    { label: 'Respiração', value: ExerciseCategory.BREATHING },
    { label: 'Mobilidade', value: ExerciseCategory.MOBILITY },
    { label: 'Equilíbrio', value: ExerciseCategory.BALANCE },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(EXERCISE_REPOSITORY) private readonly exerciseRepo: IExerciseRepository,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.exerciseId = this.route.snapshot.paramMap.get('id');
    if (this.exerciseId && this.exerciseId !== 'new') {
      this.isEditing = true;
      this.loadExercise(this.exerciseId);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      category: [ExerciseCategory.POSTURE, [Validators.required]],
      videoUrl: [''],
      instructions: ['', [Validators.required]],
    });
  }

  private loadExercise(id: string): void {
    this.isLoading = true;
    this.exerciseRepo.getById(id).subscribe({
      next: (exercise) => {
        this.form.patchValue({
          title: exercise.title,
          description: exercise.description,
          category: exercise.category,
          videoUrl: exercise.videoUrl || '',
          instructions: exercise.instructions,
        });
        this.tagsInput = exercise.tags?.join(', ') || '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erro ao carregar exercício.';
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    console.log('🚨 Clicou em salvar! O formulário é válido?', this.form.valid);

    if (this.form.invalid) {
      console.error('❌ Formulário bloqueado pelo Angular! Campos com erro:');

      // Esse código vai listar no console exatamente quem está com erro
      Object.keys(this.form.controls).forEach((key) => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors) {
          console.error(`👉 Campo [${key}] está com erro:`, controlErrors);
        }
      });

      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const formValue = this.form.value;
    const data = {
      ...formValue,
      tags: this.tagsInput
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0),
      imageUrls: [],
    };

    const request = this.isEditing
      ? this.exerciseRepo.update(this.exerciseId!, data)
      : this.exerciseRepo.create(data);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/exercises']);
      },
      error: () => {
        this.isSaving = false;
        this.errorMessage = 'Erro ao salvar exercício. Tente novamente.';
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}
