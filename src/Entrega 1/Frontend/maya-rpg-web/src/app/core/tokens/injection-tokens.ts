import { InjectionToken } from '@angular/core';
import {
  IPatientRepository,
  IExerciseRepository,
  IMedicalRecordRepository,
  IPrescriptionRepository,
  IAuthService,
} from '../interfaces';

export const PATIENT_REPOSITORY = new InjectionToken<IPatientRepository>('PatientRepository');
export const EXERCISE_REPOSITORY = new InjectionToken<IExerciseRepository>('ExerciseRepository');
export const MEDICAL_RECORD_REPOSITORY = new InjectionToken<IMedicalRecordRepository>('MedicalRecordRepository');
export const PRESCRIPTION_REPOSITORY = new InjectionToken<IPrescriptionRepository>('PrescriptionRepository');
export const AUTH_SERVICE = new InjectionToken<IAuthService>('AuthService');
