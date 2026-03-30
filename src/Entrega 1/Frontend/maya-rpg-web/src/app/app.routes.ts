import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { MainLayoutComponent } from './shared/layout/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: MainLayoutComponent,
    //canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'patients',
        loadChildren: () =>
          import('./features/patients/patients.routes').then((m) => m.PATIENTS_ROUTES),
      },
      {
        path: 'exercises',
        loadChildren: () =>
          import('./features/exercises/exercises.routes').then((m) => m.EXERCISES_ROUTES),
      },
      {
        path: 'prescriptions',
        loadChildren: () =>
          import('./features/prescriptions/prescriptions.routes').then((m) => m.PRESCRIPTIONS_ROUTES),
      },
      {
        path: 'medical-records',
        loadChildren: () =>
          import('./features/medical-records/medical-records.routes').then((m) => m.MEDICAL_RECORDS_ROUTES),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
