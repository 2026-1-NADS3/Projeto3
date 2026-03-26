import { Observable } from 'rxjs';
import { Exercise } from '../entities';
import { PaginatedRequest, PaginatedResponse } from './api-response.interface';
import { ExerciseCategory } from '../enums';

export interface IExerciseRepository {
  getAll(params: PaginatedRequest, category?: ExerciseCategory): Observable<PaginatedResponse<Exercise>>;
  getById(id: string): Observable<Exercise>;
  create(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Observable<Exercise>;
  update(id: string, exercise: Partial<Exercise>): Observable<Exercise>;
  delete(id: string): Observable<void>;
  searchByTags(tags: string[]): Observable<Exercise[]>;
}
