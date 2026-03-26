import { Observable } from 'rxjs';
import { MedicalRecord } from '../entities';
import { PaginatedRequest, PaginatedResponse } from './api-response.interface';

export interface IMedicalRecordRepository {
  getByPatientId(patientId: string, params: PaginatedRequest): Observable<PaginatedResponse<MedicalRecord>>;
  getById(id: string): Observable<MedicalRecord>;
  create(record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Observable<MedicalRecord>;
  update(id: string, record: Partial<MedicalRecord>): Observable<MedicalRecord>;
  delete(id: string): Observable<void>;
}
