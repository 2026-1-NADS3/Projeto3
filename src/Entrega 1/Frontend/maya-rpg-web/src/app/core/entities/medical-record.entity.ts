export interface MedicalRecord {
  id: string;
  patientId: string;
  professionalId: string;
  date: Date;
  chiefComplaint?: string;
  clinicalNotes: string;
  painLevel?: number; // 0-10
  mobilityNotes?: string;
  postureAssessment?: string;
  treatmentPlan?: string;
  createdAt: Date;
  updatedAt: Date;
}
