import { Module } from '@nestjs/common';
import { CheckInsModule } from '../check-ins/check-ins.module';
import { ExerciseExecutionsController } from './exercise-executions.controller';

@Module({
  imports: [CheckInsModule],
  controllers: [ExerciseExecutionsController],
})
export class ExerciseExecutionsModule {}
