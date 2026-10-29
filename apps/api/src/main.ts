import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Todas las rutas quedan bajo /api (ej: /api/tasks)
  app.setGlobalPrefix('api');

  // Valida y transforma los DTOs; rechaza propiedades no declaradas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // El frontend llama a la API desde el navegador, así que su origen debe estar permitido
  app.enableCors({ origin: config.get('CORS_ORIGIN', 'http://localhost:3000').split(',') });
  app.enableShutdownHooks();

  const port = Number(config.get('PORT', 3001));
  await app.listen(port, '0.0.0.0');
  Logger.log(`API escuchando en http://localhost:${port}/api`, 'Bootstrap');
}
await bootstrap();
