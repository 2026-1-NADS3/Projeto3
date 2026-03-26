import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST /api/auth/register
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // GET /api/auth/me — precisa estar logado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  // POST /api/auth/recover-password
  @Post('recover-password')
  recoverPassword(@Body('email') email: string) {
    return this.authService.recoverPassword(email);
  }

  // POST /api/auth/logout — no JWT, logout é feito no frontend (limpa o token)
  @Post('logout')
  logout() {
    return { message: 'Logout realizado' };
  }
}