import { Handler, Context, Callback } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { AppModule } from './src/app.module';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const expressApp = express();

let cachedServer: any;

const bootstrapServer = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();
  return createServer(expressApp);
};

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};