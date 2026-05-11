import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      // Deny by default: if an endpoint isn't public and has no @Roles, it is blocked
      throw new ForbiddenException(
        'Acesso negado: Endpoint sem configuração de Roles definida',
      );
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('Acesso negado');
    }

    // Task 7: Forçar troca de senha (libera change-password, accept-lgpd e me)
    const allowedDuringFirstAccess = [
      '/api/auth/change-password',
      '/auth/change-password',
      '/api/auth/accept-lgpd',
      '/auth/accept-lgpd',
      '/api/auth/me',
      '/auth/me',
      '/api/auth/logout',
      '/auth/logout',
      '/api/patients/me',
      '/patients/me',
    ];
    if (
      user.mustChangePassword &&
      !allowedDuringFirstAccess.some((path) => request.url.startsWith(path))
    ) {
      throw new ForbiddenException('Troca de senha obrigatória');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso',
      );
    }

    return true;
  }
}
