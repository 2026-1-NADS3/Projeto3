import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Sanitiza request body para logs (nunca logar senhas, cpfs ou tokens puros)
    const sanitizedBody = this.sanitize(request.body);

    this.logger.error(
      `HTTP ${status} [${request.method} ${request.url}]`,
      JSON.stringify({
        body: sanitizedBody,
        error: message,
      }),
    );

    // Na resposta pro cliente, garantir que os mesmos campos não vazem (caso o throw tenha sido descuidado)
    const sanitizedResponse =
      typeof message === 'object' ? this.sanitize(message as any) : message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: sanitizedResponse,
    });
  }

  private sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sensitiveFields = [
      'password',
      'newPassword',
      'cpf',
      'token',
      'accessToken',
      'refreshToken',
    ];
    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      if (sensitiveFields.includes(key)) {
        sanitized[key] = '[FILTERED]';
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = this.sanitize(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }

    return sanitized;
  }
}
