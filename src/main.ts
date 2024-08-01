import { NestFactory } from '@nestjs/core';
import { configure } from '@codegenie/serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();
}

bootstrap();
