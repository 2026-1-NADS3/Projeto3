import { Observable } from 'rxjs';
import { Prescription } from '../entities';
import { PaginatedRequest, PaginatedResponse } from './api-response.interface';

export interface IPrescriptionRepository {
  getByPatientId(patientId: string, params: PaginatedRequest): Observable<PaginatedResponse<Prescription>>;
  getById(id: string): Observable<Prescription>;
  create(prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Observable<Prescription>;
  update(id: string, prescription: Partial<Prescription>): Observable<Prescription>;
  deactivate(id: string): Observable<void>;
}
