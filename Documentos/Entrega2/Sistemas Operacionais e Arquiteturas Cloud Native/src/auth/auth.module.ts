import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailChangeRequest } from './entities/email-change-request.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { CheckIn } from '../check-ins/entities/check-in.entity';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { EmailChangeService } from './email-change.service';
import { PasswordResetService } from './password-reset.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SeedService } from '../common/seed.service';
import { MailModule } from '../common/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      RefreshToken,
      PasswordResetToken,
      EmailChangeRequest,
      Patient,
      Exercise,
      Prescription,
      MedicalRecord,
      CheckIn,
    ]),
    MailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenService,
    EmailChangeService,
    PasswordResetService,
    JwtStrategy,
    SeedService,
  ],
  exports: [
    AuthService,
    RefreshTokenService,
    EmailChangeService,
    PasswordResetService,
    JwtStrategy,
  ],
})
export class AuthModule {}
