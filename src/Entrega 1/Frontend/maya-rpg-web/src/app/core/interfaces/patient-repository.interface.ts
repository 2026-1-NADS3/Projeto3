import { Observable } from 'rxjs';
import { Patient } from '../entities';
import { PaginatedRequest, PaginatedResponse } from './api-response.interface';
import { PatientStatus } from '../enums';

export interface IPatientRepository {
  getAll(params: PaginatedRequest, status?: PatientStatus): Observable<PaginatedResponse<Patient>>;
  getById(id: string): Observable<Patient>;
  create(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Observable<Patient>;
  update(id: string, patient: Partial<Patient>): Observable<Patient>;
  delete(id: string): Observable<void>;
}
