import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';

import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env', '.env'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        url: configService.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        migrations: [join(__dirname, 'database', 'migrations', '*{.js,.ts}')],
        synchronize: false,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
