import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { User } from '../auth/entities/user.entity';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}