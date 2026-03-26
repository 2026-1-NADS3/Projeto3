export interface PrescriptionExercise {
  exerciseId: string;
  sets?: number;
  repetitions?: number;
  holdTimeSeconds?: number;
  frequency: string;
  notes?: string;
  order: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  professionalId: string;
  title: string;
  description?: string;
  exercises: PrescriptionExercise[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
