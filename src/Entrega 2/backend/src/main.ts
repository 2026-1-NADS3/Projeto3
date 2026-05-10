import * as crypto from 'crypto';
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = crypto;
}

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  // Security headers
  app.use(helmet());

  // Proxy trust para Rate Limiting funcionar com IP real
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);
  expressApp.set('etag', false);

  expressApp.use(
    '/api',
    (
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      next();
    },
  );

  // Servir arquivos estáticos da pasta uploads na rota /uploads
  expressApp.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  // CORS — lê CORS_ORIGINS do .env (separado por vírgula). "*" libera tudo.
  const corsOriginsEnv = configService.get<string>('CORS_ORIGINS');
  const defaultOrigins = [
    'https://maya-rpg-web.vercel.app',
    'http://localhost:4200',
    'http://localhost:3000',
  ];
  const parsedOrigins = corsOriginsEnv
    ? corsOriginsEnv
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean)
    : defaultOrigins;
  const allowAll = parsedOrigins.includes('*');

  app.enableCors({
    origin: allowAll ? true : parsedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Ativa @Exclude() e @Expose() nas entities (class-transformer)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Sanitização de logs
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuração do Swagger (Documentação da API)
  const config = new DocumentBuilder()
    .setTitle('Maya RPG API')
    .setDescription(
      'API para acompanhamento de pacientes de RPG - Clínica Maya Yoshiko Yamamoto',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`🚀 Maya RPG API rodando em http://localhost:${port}/api`);
  console.log(
    `📚 Documentação da API disponível em http://localhost:${port}/api/docs`,
  );
}
bootstrap();
