import { Routes } from '@angular/router';

export const MEDICAL_RECORDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/record-list/record-list.component').then((m) => m.RecordListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/record-form/record-form.component').then((m) => m.RecordFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/record-detail/record-detail.component').then((m) => m.RecordDetailComponent),
  },
];
