import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './data/interceptors/auth.interceptor';


// 1. IMPORTANTE: Importe o ApiService aqui!
import { ApiService } from './data/services/api.service';

import {
  PATIENT_REPOSITORY,
  EXERCISE_REPOSITORY,
  PRESCRIPTION_REPOSITORY,
  AUTH_SERVICE,
} from './core/tokens/injection-tokens';
import { AuthService } from './data/services/auth.service';

import { PatientRepository } from './data/repositories/patient.repository';
import { ExerciseRepository } from './data/repositories/exercise.repository';
import { PrescriptionRepository } from './data/repositories/prescription.repository';
import { MEDICAL_RECORD_REPOSITORY } from './core/tokens/injection-tokens';
import { MedicalRecordRepository } from './data/repositories/medical-record.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    ApiService,

    { provide: PATIENT_REPOSITORY, useClass: PatientRepository },
    { provide: EXERCISE_REPOSITORY, useClass: ExerciseRepository },
    { provide: PRESCRIPTION_REPOSITORY, useClass: PrescriptionRepository },
    { provide: AUTH_SERVICE, useClass: AuthService },
    { provide: MEDICAL_RECORD_REPOSITORY, useClass: MedicalRecordRepository },
  ],
};
