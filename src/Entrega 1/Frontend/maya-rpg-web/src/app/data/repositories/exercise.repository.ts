import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type {
  IExerciseRepository,
  PaginatedRequest,
  PaginatedResponse,
} from '../../core/interfaces';
import type { Exercise } from '../../core/entities/exercise.entity';
import { ExerciseCategory } from '../../core/enums/exercise-category.enum';

@Injectable({
  providedIn: 'root',
})
export class ExerciseRepository implements IExerciseRepository {
  // Ajuste a URL se estiver usando um arquivo environment
  private readonly apiUrl = 'http://localhost:3000/api/exercises';

  constructor(private readonly http: HttpClient) {}

  getAll(
    params: PaginatedRequest,
    category?: ExerciseCategory,
  ): Observable<PaginatedResponse<Exercise>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
    if (category) httpParams = httpParams.set('category', category);

    return this.http.get<PaginatedResponse<Exercise>>(this.apiUrl, { params: httpParams });
  }

  getById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  create(data: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, data);
  }

  update(id: string, data: Partial<Exercise>): Observable<Exercise> {
    return this.http.patch<Exercise>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByTags(tags: string[]): Observable<Exercise[]> {
    let httpParams = new HttpParams();
    tags.forEach((tag) => {
      httpParams = httpParams.append('tags', tag);
    });
    return this.http.get<Exercise[]>(`${this.apiUrl}/search/tags`, { params: httpParams });
  }
}
