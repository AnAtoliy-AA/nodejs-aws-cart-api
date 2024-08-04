import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { createServer, proxy } from 'aws-serverless-express';
import express from 'express';
import { Server } from 'http';

let memoizedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await app.init();

  return createServer(expressApp);
};

export const handler = async (event: any, context: any) => {
  if (!memoizedServer) {
    memoizedServer = await bootstrapServer();
  }

  return proxy(memoizedServer, event, context, 'PROMISE').promise;
};
