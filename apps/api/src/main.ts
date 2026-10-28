import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { NestFactory } from '@nestjs/core';

const envCandidates = [
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const { AppModule } = await import('./app.module.js');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const host = process.env.API_HOST ?? '0.0.0.0';
  const port = Number(process.env.API_PORT ?? 3000);

  await app.listen(port, host);
  console.log(`Listening on: http://${host}:${port}`);
}

await bootstrap();
