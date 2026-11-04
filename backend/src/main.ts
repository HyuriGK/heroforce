import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const allowedOrigins = configService
    .get<string>('FRONTEND_URL', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('HeroForce API')
    .setDescription(
      'API para gestão e acompanhamento de projetos heroicos da HeroForce.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('Health', 'Verificação da disponibilidade da API e do banco.')
    .addTag('Auth', 'Cadastro, login e sessão autenticada.')
    .addTag('Users', 'Perfil e heróis elegíveis como responsáveis.')
    .addTag('Projects', 'Consulta e gestão de projetos heroicos.')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'HeroForce API Docs',
    jsonDocumentUrl: 'docs-json',
  });

  const port = configService.get<number>('API_PORT', 3000);
  await app.listen(port);
}

void bootstrap();
