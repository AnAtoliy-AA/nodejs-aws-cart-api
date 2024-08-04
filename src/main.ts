import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8080;

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

  await app.listen(port);
}

bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
