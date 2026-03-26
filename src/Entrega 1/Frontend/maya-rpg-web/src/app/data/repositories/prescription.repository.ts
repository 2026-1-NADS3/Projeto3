import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  IPrescriptionRepository,
  PaginatedRequest,
  PaginatedResponse,
} from '../../core/interfaces';
import type { Prescription } from '../../core/entities/prescription.entity';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionRepository implements IPrescriptionRepository {
  // Agora usamos apenas a rota final, o ApiService sabe o domínio base
  private readonly endpoint = 'prescriptions';

  // Injetamos o ApiService chique do Claude
  constructor(private readonly api: ApiService) {}

  getByPatientId(
    patientId: string,
    params: PaginatedRequest,
  ): Observable<PaginatedResponse<Prescription>> {
    // Usa a mesma inteligência de paginação dos pacientes
    const queryParams: Record<string, string | number> = this.api.buildPaginatedParams(params);
    return this.api.get<PaginatedResponse<Prescription>>(
      `${this.endpoint}/patient/${patientId}`,
      queryParams,
    );
  }

  getById(id: string): Observable<Prescription> {
    return this.api.get<Prescription>(`${this.endpoint}/${id}`);
  }

  create(data: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Observable<Prescription> {
    // Aquela nossa faxina para arrancar os IDs antes de enviar
    const { professionalId, userId, ...cleanData } = data as any;
    return this.api.post<Prescription>(this.endpoint, cleanData);
  }

  update(id: string, data: Partial<Prescription>): Observable<Prescription> {
    return this.api.patch<Prescription>(`${this.endpoint}/${id}`, data);
  }

  deactivate(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
  