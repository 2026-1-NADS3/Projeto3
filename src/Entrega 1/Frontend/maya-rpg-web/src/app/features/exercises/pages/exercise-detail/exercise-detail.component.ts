import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import type { Exercise } from '../../../../core/entities/exercise.entity';
import type { IExerciseRepository } from '../../../../core/interfaces';
import { ExerciseCategory } from '../../../../core/enums/exercise-category.enum';
import { EXERCISE_REPOSITORY } from '../../../../core/tokens/injection-tokens';

@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page" *ngIf="!isLoading && exercise">
      <a routerLink="/exercises" class="back-link">← Voltar para exercícios</a>

      <div class="detail-header">
        <div>
          <h1>{{ exercise.title }}</h1>
          <span class="category-badge" [ngClass]="getCategoryClass(exercise.category)">
            {{ getCategoryLabel(exercise.category) }}
          </span>
        </div>
        <button class="btn btn--primary" (click)="goToEdit()">✏️ Editar</button>
      </div>

      <div class="detail-grid">
        <div class="detail-card">
          <h3 class="card-title">Descrição</h3>
          <p class="card-text">{{ exercise.description }}</p>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Instruções</h3>
          <p class="card-text">{{ exercise.instructions }}</p>
        </div>

        <div class="detail-card" *ngIf="exercise.tags.length">
          <h3 class="card-title">Tags</h3>
          <div class="tags">
            <span class="tag" *ngFor="let tag of exercise.tags">{{ tag }}</span>
          </div>
        </div>

        <div class="detail-card" *ngIf="exercise.videoUrl">
          <h3 class="card-title">Vídeo</h3>
          <a [href]="exercise.videoUrl" target="_blank" class="video-link">{{
            exercise.videoUrl
          }}</a>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="isLoading">Carregando...</div>
    <div class="error" *ngIf="errorMessage">
      <p>{{ errorMessage }}</p>
      <a routerLink="/exercises" class="back-link">← Voltar para exercícios</a>
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
      .detail-header > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .detail-header h1 {
        margin-bottom: 0;
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
      .category-badge {
        display: inline-flex;
        padding: 2px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .cat--stretching {
        background: rgba(43, 122, 140, 0.1);
        color: #2b7a8c;
      }
      .cat--strengthening {
        background: rgba(232, 132, 92, 0.1);
        color: #c46840;
      }
      .cat--posture {
        background: rgba(139, 111, 71, 0.1);
        color: #8b6f47;
      }
      .cat--breathing {
        background: rgba(107, 197, 210, 0.1);
        color: #3a9eaa;
      }
      .cat--mobility {
        background: rgba(58, 158, 111, 0.1);
        color: #2d7a56;
      }
      .cat--balance {
        background: rgba(230, 162, 60, 0.1);
        color: #b07d2a;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 1fr;
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
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .tag {
        padding: 3px 10px;
        background: #f1efe8;
        border-radius: 4px;
        font-size: 0.75rem;
        color: #6e6b62;
      }
      .video-link {
        font-size: 0.875rem;
        color: #2b7a8c;
        word-break: break-all;
      }
      .video-link:hover {
        text-decoration: underline;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        color: #9a9689;
      }
      .error {
        text-align: center;
        padding: 3rem;
        color: #e25c5c;
      }
    `,
  ],
})
export class ExerciseDetailComponent implements OnInit {
  exercise: Exercise | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    @Inject(EXERCISE_REPOSITORY) private readonly exerciseRepo: IExerciseRepository,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExercise(id);
    }
  }

  private loadExercise(id: string): void {
    this.isLoading = true;
    this.exerciseRepo.getById(id).subscribe({
      next: (exercise) => {
        this.exercise = exercise;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Exercício não encontrado.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToEdit(): void {
    if (this.exercise) {
      this.router.navigate(['/exercises', this.exercise.id, 'edit']);
    }
  }

  getCategoryLabel(category: ExerciseCategory): string {
    const labels: Record<ExerciseCategory, string> = {
      [ExerciseCategory.STRETCHING]: 'Alongamento',
      [ExerciseCategory.STRENGTHENING]: 'Fortalecimento',
      [ExerciseCategory.POSTURE]: 'Postura',
      [ExerciseCategory.BREATHING]: 'Respiração',
      [ExerciseCategory.MOBILITY]: 'Mobilidade',
      [ExerciseCategory.BALANCE]: 'Equilíbrio',
    };
    return labels[category] || category;
  }

  getCategoryClass(category: ExerciseCategory): string {
    const classes: Record<ExerciseCategory, string> = {
      [ExerciseCategory.STRETCHING]: 'cat--stretching',
      [ExerciseCategory.STRENGTHENING]: 'cat--strengthening',
      [ExerciseCategory.POSTURE]: 'cat--posture',
      [ExerciseCategory.BREATHING]: 'cat--breathing',
      [ExerciseCategory.MOBILITY]: 'cat--mobility',
      [ExerciseCategory.BALANCE]: 'cat--balance',
    };
    return classes[category] || '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
