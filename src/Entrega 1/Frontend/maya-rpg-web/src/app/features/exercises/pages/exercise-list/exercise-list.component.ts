import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { Exercise } from '../../../../core/entities/exercise.entity';
import type { IExerciseRepository, PaginatedRequest } from '../../../../core/interfaces';
import { ExerciseCategory } from '../../../../core/enums/exercise-category.enum';
import { EXERCISE_REPOSITORY } from '../../../../core/tokens/injection-tokens';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule, SearchInputComponent, ConfirmDialogComponent],
  templateUrl: './exercise-list.component.html',
  styleUrl: './exercise-list.component.scss',
})
export class ExerciseListComponent implements OnInit {
  exercises: Exercise[] = [];
  totalExercises = 0;
  totalPages = 0;
  isLoading = false;

  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  categoryFilter?: ExerciseCategory;

  showDeleteDialog = false;
  deletingExercise: Exercise | null = null;
  isDeleting = false;

  categoryOptions: { label: string; value?: ExerciseCategory }[] = [
    { label: 'Todos', value: undefined },
    { label: 'Alongamento', value: ExerciseCategory.STRETCHING },
    { label: 'Fortalecimento', value: ExerciseCategory.STRENGTHENING },
    { label: 'Postura', value: ExerciseCategory.POSTURE },
    { label: 'Respiração', value: ExerciseCategory.BREATHING },
    { label: 'Mobilidade', value: ExerciseCategory.MOBILITY },
    { label: 'Equilíbrio', value: ExerciseCategory.BALANCE },
  ];

  constructor(
    @Inject(EXERCISE_REPOSITORY) private readonly exerciseRepo: IExerciseRepository,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.isLoading = true;

    const params: PaginatedRequest = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchTerm || undefined,
    };

    this.exerciseRepo.getAll(params, this.categoryFilter).subscribe({
      next: (response) => {
        this.exercises = response.data;
        this.totalExercises = response.total;
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
    this.loadExercises();
  }

  onCategoryFilter(category?: ExerciseCategory): void {
    this.categoryFilter = category;
    this.currentPage = 1;
    this.loadExercises();
  }

  navigateToNew(): void {
    this.router.navigate(['/exercises/new']);
  }

  navigateToDetail(exercise: Exercise): void {
    this.router.navigate(['/exercises', exercise.id]);
  }

  navigateToEdit(exercise: Exercise): void {
    this.router.navigate(['/exercises', exercise.id, 'edit']);
  }

  openDeleteDialog(exercise: Exercise): void {
    this.deletingExercise = exercise;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    if (!this.deletingExercise) return;
    this.isDeleting = true;
    this.exerciseRepo.delete(this.deletingExercise.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.showDeleteDialog = false;
        this.deletingExercise = null;
        this.loadExercises();
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.deletingExercise = null;
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

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadExercises();
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
