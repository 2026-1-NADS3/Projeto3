import { Routes } from '@angular/router';

export const PRESCRIPTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/prescription-list/prescription-list.component').then(
        (m) => m.PrescriptionListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/prescription-form/prescription-form.component').then(
        (m) => m.PrescriptionFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/prescription-detail/prescription-detail.component').then(
        (m) => m.PrescriptionDetailComponent,
      ),
  },
];
