import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  IExerciseRepository,
  PaginatedRequest,
  PaginatedResponse,
} from '../../core/interfaces';
import type { Exercise } from '../../core/entities/exercise.entity';
import { ExerciseCategory } from '../../core/enums/exercise-category.enum';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ExerciseRepository implements IExerciseRepository {
  private readonly endpoint = 'exercises';

  constructor(private readonly api: ApiService) {}

  getAll(
    params: PaginatedRequest,
    category?: ExerciseCategory,
  ): Observable<PaginatedResponse<Exercise>> {
    const queryParams: Record<string, string | number> = this.api.buildPaginatedParams(params);
    if (category) queryParams['category'] = category;
    return this.api.get<PaginatedResponse<Exercise>>(this.endpoint, queryParams);
  }

  getById(id: string): Observable<Exercise> {
    return this.api.get<Exercise>(`${this.endpoint}/${id}`);
  }

  create(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Observable<Exercise> {
    return this.api.post<Exercise>(this.endpoint, data);
  }

  update(id: string, data: Partial<Exercise>): Observable<Exercise> {
    return this.api.patch<Exercise>(`${this.endpoint}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  searchByTags(tags: string[]): Observable<Exercise[]> {
    const queryParams: Record<string, string> = {};
    tags.forEach((tag, i) => (queryParams[`tags[${i}]`] = tag));
    return this.api.get<Exercise[]>(`${this.endpoint}/search/tags`, queryParams);
  }
}
