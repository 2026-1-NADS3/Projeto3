import { Module, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { PasswordResetToken } from './auth/entities/password-reset-token.entity';
import { EmailChangeRequest } from './auth/entities/email-change-request.entity';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PatientsModule } from './patients/patients.module';
import { Patient } from './patients/entities/patient.entity';
import { ExercisesModule } from './exercises/exercises.module';
import { Exercise } from './exercises/entities/exercise.entity';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { MedicalRecord } from './medical-records/entities/medical-record.entity';
import { AppointmentsModule } from './appointments/appointments.module';
import { Appointment } from './appointments/entities/appointment.entity';
import { AuditModule } from './common/audit/audit.module';
import { AuditLog } from './common/audit/audit-log.entity';
import { AuditInterceptor } from './common/audit/audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CheckInsModule } from './check-ins/check-ins.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CheckIn } from './check-ins/entities/check-in.entity';
import { UploadModule } from './upload/upload.module';
import { RoutinesModule } from './routines/routines.module';
import { LgpdModule } from './common/lgpd/lgpd.module';
import { Routine } from './routines/entities/routine.entity';
import { UsersModule } from './users/users.module';
import { ExerciseExecutionsModule } from './exercise-executions/exercise-executions.module';
import { ChatModule } from './chat/chat.module';
import { Conversation } from './chat/entities/conversation.entity';
import { ChatMessage } from './chat/entities/message.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { Notification } from './notifications/entities/notification.entity';

const entities = [
  User,
  RefreshToken,
  PasswordResetToken,
  EmailChangeRequest,
  Patient,
  Exercise,
  Prescription,
  MedicalRecord,
  Appointment,
  AuditLog,
  CheckIn,
  Routine,
  Conversation,
  ChatMessage,
  Payment,
  Notification,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting global: 60 requests por minuto por IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('TypeOrmConfig');
        const host = configService.get<string>('DB_HOST');
        const password = configService.get<string>('DB_PASSWORD');
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
        const sslEnabled =
          configService.get<string>('DB_SSL') === 'true' ||
          nodeEnv === 'production';

        let sslConfig: boolean | { ca: string; rejectUnauthorized: boolean } =
          false;
        if (sslEnabled) {
          const ca = configService.get<string>('DB_SSL_CA');
          sslConfig = ca ? { ca, rejectUnauthorized: true } : true;
        }

        if (!host) {
          logger.warn(
            'DB_HOST não definido. Usando localhost para desenvolvimento.',
          );
        } else {
          logger.log(`🔌 Conectando ao banco de dados em: ${host}`);
        }

        return {
          type: 'postgres',
          host: host || 'localhost',
          port: Number(configService.get('DB_PORT')) || 5432,
          username: configService.get<string>('DB_USER'),
          password: password || '',
          database: configService.get<string>('DB_NAME'),
          entities,
          synchronize: nodeEnv !== 'production',
          ssl: sslConfig,
        };
      },
    }),

    AuthModule,
    PatientsModule,
    ExercisesModule,
    PrescriptionsModule,
    MedicalRecordsModule,
    AppointmentsModule,
    AuditModule,
    CheckInsModule,
    DashboardModule,
    NotificationsModule,
    UploadModule,
    RoutinesModule,
    LgpdModule,
    UsersModule,
    ExerciseExecutionsModule,
    ChatModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [
    // Guard global de rate limiting (vem primeiro para rejeitar tráfego indesejado antes do banco)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Guard global de autenticação: todas as rotas exigem JWT, exceto @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Guard global de roles: verifica @Roles() e restringe acessos genéricos
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Interceptor global de auditoria: loga as requisições após passarem pelos guards
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  private readonly logger = new Logger('DatabaseConnection');

  constructor(private dataSource: DataSource) {}

  onApplicationBootstrap() {
    if (this.dataSource.isInitialized) {
      this.logger.log(
        '🚀 Uhuu! O banco de dados (Maya RPG) conectou com sucesso!',
      );
    } else {
      this.logger.error('❌ Falha ao conectar no banco de dados.');
    }
  }
}
