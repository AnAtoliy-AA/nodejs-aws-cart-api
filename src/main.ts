import { NestFactory } from '@nestjs/core';
import { Handler, Context, Callback } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import * as express from 'express';

import helmet from 'helmet';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);
  await app.init();

  return createServer(expressApp);
}
// bootstrap().then(() => {
//   console.log('App is running on %s port', port);
// });

let cachedServer: any;

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();

    console.log('App is running on %s port', port);
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
