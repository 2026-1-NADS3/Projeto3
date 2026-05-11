import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrescriptionExerciseDto } from '../../prescriptions/dto/create-prescription.dto';

export class CreateRoutineDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionExerciseDto)
  exercises: PrescriptionExerciseDto[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
