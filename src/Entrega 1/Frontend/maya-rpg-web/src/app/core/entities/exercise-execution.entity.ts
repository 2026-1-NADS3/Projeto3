export interface ExerciseExecution {
  id: string;
  prescriptionId: string;
  exerciseId: string;
  patientId: string;
  executedAt: Date;
  painLevel?: number; // 0-10
  notes?: string;
  completed: boolean;
  createdAt: Date;
}
