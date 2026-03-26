import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { IPatientRepository, PaginatedRequest, PaginatedResponse } from '../../core/interfaces';
import type { Patient } from '../../core/entities/patient.entity';
import { PatientStatus } from '../../core/enums/patient-status.enum';
import { MOCK_PATIENTS } from '../mocks/mock-patients';

@Injectable({
  providedIn: 'root',
})
export class MockPatientRepository implements IPatientRepository {
  private patients: Patient[] = [...MOCK_PATIENTS];
  private nextId = this.patients.length + 1;

  getAll(params: PaginatedRequest, status?: PatientStatus): Observable<PaginatedResponse<Patient>> {
    let filtered = [...this.patients];

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (params.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(search) ||
          p.email.toLowerCase().includes(search) ||
          p.cpf.includes(search),
      );
    }

    if (params.sortBy) {
      const key = params.sortBy as keyof Patient;
      const order = params.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal == null || bVal == null) return 0;
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    const total = filtered.length;
    const start = (params.page - 1) * params.pageSize;
    const data = filtered.slice(start, start + params.pageSize);

    return of({
      data,
      total,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: Math.ceil(total / params.pageSize),
    }).pipe(delay(300));
  }

  getById(id: string): Observable<Patient> {
    const patient = this.patients.find((p) => p.id === id);
    if (!patient) {
      return throwError(() => new Error('Paciente não encontrado'));
    }
    return of(patient).pipe(delay(200));
  }

  create(data: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Observable<Patient> {
    const patient: Patient = {
      ...data,
      id: String(this.nextId++),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.patients.unshift(patient);
    return of(patient).pipe(delay(400));
  }

  update(id: string, data: Partial<Patient>): Observable<Patient> {
    const index = this.patients.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Paciente não encontrado'));
    }
    this.patients[index] = {
      ...this.patients[index],
      ...data,
      updatedAt: new Date(),
    };
    return of(this.patients[index]).pipe(delay(400));
  }

  delete(id: string): Observable<void> {
    const index = this.patients.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new Error('Paciente não encontrado'));
    }
    this.patients.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
