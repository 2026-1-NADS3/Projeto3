import { ExerciseCategory } from '../enums/exercise-category.enum';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  tags: string[];
  videoUrl?: string;
  imageUrls?: string[];
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
}
