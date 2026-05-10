import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, originalUrl, params, ip, user } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.log(context, request, response, startTime, 'SUCCESS');
        },
        error: (error) => {
          this.log(context, request, response, startTime, 'ERROR', error);
        },
      }),
    );
  }

  private log(
    context: ExecutionContext,
    request: any,
    response: any,
    startTime: number,
    status: 'SUCCESS' | 'ERROR',
    error?: any,
  ) {
    const durationMs = Date.now() - startTime;
    const { method, originalUrl, params, ip, user } = request;

    // Tentar inferir resourceId (geralmente param 'id')
    const resourceId = params?.id || null;

    // Gerar uma action legível, ex: GET /patients -> PATIENTS_VIEWED
    const action = this.generateAction(method, originalUrl, status);

    const statusCode = error ? error.status || 500 : response.statusCode;

    this.auditService.createLog({
      userId: user?.id,
      userEmail: user?.email,
      action,
      method,
      path: originalUrl,
      statusCode,
      resourceId,
      ipAddress: ip,
      durationMs,
      metadata: error ? { errorMessage: error.message } : undefined,
    });
  }

  private generateAction(method: string, path: string, status: string): string {
    // Basic heuristics to create action name
    const pathParts = path.split('/').filter(Boolean);
    const resource = pathParts.length > 0 ? pathParts[0].toUpperCase() : 'APP';

    let verb = 'ACCESSED';
    switch (method) {
      case 'GET':
        verb = 'VIEWED';
        break;
      case 'POST':
        verb = 'CREATED';
        break;
      case 'PATCH':
      case 'PUT':
        verb = 'UPDATED';
        break;
      case 'DELETE':
        verb = 'DELETED';
        break;
    }

    return `${resource}_${verb}${status === 'ERROR' ? '_FAILED' : ''}`;
  }
}
