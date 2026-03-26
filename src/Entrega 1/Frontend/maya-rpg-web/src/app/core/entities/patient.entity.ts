import { PatientStatus } from '../enums/patient-status.enum';

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: Date;
  cpf: string;
  status: PatientStatus;
  notes?: string;
  lgpdConsentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
