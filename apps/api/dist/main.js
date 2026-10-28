import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' });
    app.enableShutdownHooks();
    const port = Number(process.env.PORT ?? 3001);
    await app.listen(port, '0.0.0.0');
    Logger.log(`API escuchando en http://localhost:${port}/api`, 'Bootstrap');
}
await bootstrap();
//# sourceMappingURL=main.js.map