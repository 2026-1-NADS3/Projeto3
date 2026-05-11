import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { EmailChangeService } from './email-change.service';
import { PasswordResetService } from './password-reset.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ConfirmNewEmailCodeDto,
  RequestNewEmailCodeDto,
  VerifyCurrentEmailCodeDto,
} from './dto/email-change.dto';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

import { RefreshTokenService } from './refresh-token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailChangeService: EmailChangeService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  // POST /api/auth/login — rate limit mais agressivo (5 tentativas por minuto)
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  login(@Request() req: any, @Body() dto: LoginDto) {
    return this.authService.login(dto, {
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
  }

  // POST /api/auth/refresh
  @Public()
  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Body('refreshToken') refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não fornecido');
    }
    const { user, newRefreshToken } = await this.refreshTokenService.rotate(
      refreshToken,
      { ip: req.ip, ua: req.headers['user-agent'] },
    );

    return {
      accessToken: await this.authService.generateAccessToken(user),
      refreshToken: newRefreshToken,
    };
  }

  // POST /api/auth/register — público, sempre cria PATIENT
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /api/auth/staff — admin cria PROFESSIONAL ou ADMIN
  @Post('staff')
  @Roles(UserRole.ADMIN)
  createStaff(@Body() dto: CreateStaffDto) {
    return this.authService.createStaff(dto);
  }

  @Get('me')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('change-password')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  changePassword(
    @Request() req: any,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(req.user.id, newPassword);
  }

  // POST /api/auth/accept-lgpd — registra aceite do termo LGPD do usuário logado
  @Post('accept-lgpd')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  acceptLgpd(@Request() req: any) {
    return this.authService.acceptLgpd(req.user.id);
  }

  @Patch('fcm-token')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  updateFcmToken(@Request() req: any, @Body('fcmToken') fcmToken: string) {
    return this.authService.updateFcmToken(req.user.id, fcmToken);
  }

  @Post('email-change/request-current')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  requestCurrentEmailChangeCode(@Request() req: any) {
    return this.emailChangeService.requestCurrentEmailChangeCode(req.user.id);
  }

  @Post('email-change/verify-current')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  verifyCurrentEmailChangeCode(
    @Request() req: any,
    @Body() dto: VerifyCurrentEmailCodeDto,
  ) {
    return this.emailChangeService.verifyCurrentEmailChangeCode(
      req.user.id,
      dto.requestId,
      dto.code,
    );
  }

  @Post('email-change/request-new')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  requestNewEmailChangeCode(
    @Request() req: any,
    @Body() dto: RequestNewEmailCodeDto,
  ) {
    return this.emailChangeService.requestNewEmailChangeCode(
      req.user.id,
      dto.requestId,
      dto.newEmail,
      dto.confirmEmail,
    );
  }

  @Post('email-change/confirm-new')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  confirmNewEmailChangeCode(
    @Request() req: any,
    @Body() dto: ConfirmNewEmailCodeDto,
  ) {
    return this.emailChangeService.confirmNewEmailChangeCode(
      req.user.id,
      dto.requestId,
      dto.code,
    );
  }

  // POST /api/auth/recover-password — solicita link/token de reset (público + rate-limited)
  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('recover-password')
  recoverPassword(@Body('email') email: string) {
    return this.passwordResetService.recoverPassword(email);
  }

  // GET /api/auth/lgpd-policy — descreve a política vigente para os clientes
  @Public()
  @Get('lgpd-policy')
  getLgpdPolicy() {
    return this.authService.getLgpdPolicy();
  }

  // POST /api/auth/reset-password — troca senha usando token recebido
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto.token, dto.newPassword);
  }

  @Public()
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    if (refreshToken) {
      await this.refreshTokenService.revoke(refreshToken);
    }
    return { message: 'Logout realizado' };
  }

  @Post('logout-all')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async logoutAll(@Request() req: any) {
    await this.refreshTokenService.revokeAll(req.user.id);
    return { message: 'Todas as sessões encerradas' };
  }
}
