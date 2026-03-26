import { Routes } from '@angular/router';

export const BIRTHDAYS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/birthday-calendar/birthday-calendar.component').then(
        (m) => m.BirthdayCalendarComponent,
      ),
  },
];
