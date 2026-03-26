import { Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { PatientsModule } from './patients/patients.module';
import { Patient } from './patients/entities/patient.entity';
import { ExercisesModule } from './exercises/exercises.module';
import { Exercise } from './exercises/entities/exercise.entity';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { MedicalRecord } from './medical-records/entities/medical-record.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Patient, Exercise, Prescription, MedicalRecord, Payment],
        synchronize: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),

    AuthModule,
    PatientsModule,
    ExercisesModule,
    PrescriptionsModule,
    MedicalRecordsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger('DatabaseConnection');

  constructor(private dataSource: DataSource) {}

  onApplicationBootstrap() {
    if (this.dataSource.isInitialized) {
      this.logger.log('🚀 Uhuu! O banco de dados (Maya RPG) conectou com sucesso!');
    } else {
      this.logger.error('❌ Falha ao conectar no banco de dados.');
    }
  }
}