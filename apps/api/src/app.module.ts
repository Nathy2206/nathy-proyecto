import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module.js';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    // Busca primero en apps/api/.env y, si no lo encuentra, en el .env de la raíz del monorepo
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST') || 'localhost',
    port: Number(config.get('DB_PORT') || 5432),
    username: config.get<string>('POSTGRES_USER') || 'zigo',
    password: config.get<string>('POSTGRES_PASSWORD') || 'zigo2026',
    database: config.get<string>('POSTGRES_DB') || 'tasks',
    autoLoadEntities: true,
    synchronize: true, // <-- Fuerza la creación automática de las tablas
  }),
}),
    HealthModule,
    TasksModule,
  ],
})
export class AppModule {}