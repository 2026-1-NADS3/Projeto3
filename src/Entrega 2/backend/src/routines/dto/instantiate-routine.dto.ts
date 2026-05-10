import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

/**
 * Payload para "instanciar" uma rotina como prescrição para um paciente.
 *
 * POST /api/routines/:id/instantiate
 */
export class InstantiateRoutineDto {
  @IsUUID()
  patientId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
