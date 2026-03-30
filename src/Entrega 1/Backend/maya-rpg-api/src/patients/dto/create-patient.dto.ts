import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsDateString as IsDate,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PatientStatus } from '../../common/enums/patient-status.enum';

export class CreatePatientDto {
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  fullName: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString() 
  phone: string;

  @IsDateString({}, { message: 'Data de nascimento inválida' })
  birthDate: string;

  @IsString()
  cpf: string;

  @IsEnum(PatientStatus)
  @IsOptional()
  status?: PatientStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  lgpdConsentAt?: Date | null;
}