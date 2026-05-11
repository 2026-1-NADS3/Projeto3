import { IsString, IsOptional, IsObject } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  type: NotificationType;

  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;
}
