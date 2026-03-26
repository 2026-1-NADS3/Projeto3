import { Routes } from '@angular/router';

export const EXERCISES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/exercise-list/exercise-list.component').then((m) => m.ExerciseListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/exercise-form/exercise-form.component').then((m) => m.ExerciseFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/exercise-form/exercise-form.component').then((m) => m.ExerciseFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/exercise-detail/exercise-detail.component').then(
        (m) => m.ExerciseDetailComponent,
      ),
  },
];
