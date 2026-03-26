import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  IMedicalRecordRepository,
  PaginatedRequest,
  PaginatedResponse,
} from '../../core/interfaces';
import type { MedicalRecord } from '../../core/entities/medical-record.entity';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordRepository implements IMedicalRecordRepository {
  private readonly endpoint = 'medical-records';

  constructor(private readonly api: ApiService) {}

  getByPatientId(
    patientId: string,
    params: PaginatedRequest,
  ): Observable<PaginatedResponse<MedicalRecord>> {
    const queryParams = this.api.buildPaginatedParams(params);
    return this.api.get<PaginatedResponse<MedicalRecord>>(
      `${this.endpoint}/patient/${patientId}`,
      queryParams,
    );
  }

  getById(id: string): Observable<MedicalRecord> {
    return this.api.get<MedicalRecord>(`${this.endpoint}/${id}`);
  }

  create(record: Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'>): Observable<MedicalRecord> {
    return this.api.post<MedicalRecord>(this.endpoint, record);
  }

  update(id: string, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.api.patch<MedicalRecord>(`${this.endpoint}/${id}`, record);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
