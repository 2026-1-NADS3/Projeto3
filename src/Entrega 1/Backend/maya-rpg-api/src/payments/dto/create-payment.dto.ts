import {
    IsUUID,
    IsNumber,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    Min,
  } from 'class-validator';
  import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';
  
  export class CreatePaymentDto {
    @IsUUID()
    patientId: string;
  
    @IsNumber()
    @Min(0)
    amount: number;
  
    @IsDateString()
    date: string;
  
    @IsEnum(PaymentMethod)
    method: PaymentMethod;
  
    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;
  
    @IsString()
    @IsOptional()
    notes?: string;
  }