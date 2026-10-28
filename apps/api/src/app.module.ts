import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

const isObserveConfigured =
  Boolean(process.env.OBSERVE_APP_KEY) &&
  Boolean(process.env.OBSERVE_APP_SECRET) &&
  process.env.OBSERVE_APP_KEY !== 'your_observe_app_key' &&
  process.env.OBSERVE_APP_KEY !== 'YOUR_APP_KEY' &&
  process.env.OBSERVE_APP_SECRET !== 'your_observe_app_secret' &&
  process.env.OBSERVE_APP_SECRET !== 'YOUR_APP_SECRET';

const isObserveEnabled =
  process.env.OBSERVE_ENABLED !== undefined
    ? process.env.OBSERVE_ENABLED === 'true'
    : isObserveConfigured;

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      enabled: isObserveEnabled,
      ...(isObserveConfigured
        ? {
            appKey: process.env.OBSERVE_APP_KEY,
            appSecret: process.env.OBSERVE_APP_SECRET,
          }
        : {}),
      serviceId: 'api',
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'postgres'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [], // entities 
        synchronize: true, // Development only
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
