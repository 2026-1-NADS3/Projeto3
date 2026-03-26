import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPatientRepository, PaginatedRequest, PaginatedResponse } from '../../core/interfaces';
import { Patient } from '../../core/entities';
import { PatientStatus } from '../../core/enums';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class PatientRepository implements IPatientRepository {
  private readonly endpoint = 'patients';

  constructor(private readonly api: ApiService) {}

  getAll(params: PaginatedRequest, status?: PatientStatus): Observable<PaginatedResponse<Patient>> {
    const queryParams: Record<string, string | number> = this.api.buildPaginatedParams(params);

    if (status) {
      queryParams['status'] = status;
    }

    return this.api.get<PaginatedResponse<Patient>>(this.endpoint, queryParams);
  }

  getById(id: string): Observable<Patient> {
    return this.api.get<Patient>(`${this.endpoint}/${id}`);
  }

  create(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Observable<Patient> {
    const { userId, professionalId, ...cleanData } = patient as any;
    return this.api.post<Patient>(this.endpoint, cleanData);
  }

  update(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.api.patch<Patient>(`${this.endpoint}/${id}`, patient);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
