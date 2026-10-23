import dotenv from 'dotenv';
import path from 'node:path';
import { NestFactory } from '@nestjs/core';

dotenv.config({
  path: path.resolve(process.cwd(), '../../.env'),
});

const { AppModule, ObserveInstrument } = await import('./app.module.js');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const host = process.env.API_HOST ?? '0.0.0.0';
  const port = Number(process.env.API_PORT ?? 3000);

  await app.listen(port, host);
  console.log(
    `Listening on: http://${process.env.API_HOST}:${process.env.API_PORT}`,
  );
}

await bootstrap();
