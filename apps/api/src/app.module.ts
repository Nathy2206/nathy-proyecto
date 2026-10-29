import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module.js';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    // Lee apps/api/.env; las variables del entorno (ej. docker-compose) tienen prioridad
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.getOrThrow<string>('POSTGRES_USER'),
        password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: config.getOrThrow<string>('POSTGRES_DB'),
        autoLoadEntities: true,
        // Práctico para desarrollo. En producción reemplazar por migraciones.
        synchronize: config.get('DB_SYNCHRONIZE', 'false') === 'true',
      }),
    }),
    HealthModule,
    TasksModule,
  ],
})
export class AppModule {}
