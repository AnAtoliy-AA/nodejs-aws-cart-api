import { NestFactory } from '@nestjs/core';
import { Handler, Context, Callback } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Cart } from './entities/Cart';
import { CartItem } from './entities/CartItem';
import * as dotenv from 'dotenv';

dotenv.config();

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

let cachedConnection: Connection | null = null;
let cachedServer: any = null; 

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  try {
    if (!cachedConnection) {
      cachedConnection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Cart, CartItem],
        synchronize: true,
      });
      console.log('Connected to PostgreSQL');
    }

    if (!cachedServer) {
      cachedServer = await bootstrap();
      console.log('App is running on port %s', process.env.PORT || '3000'); // Adjust as necessary
    }

    return proxy(cachedServer, event, context, 'PROMISE').promise;
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
};
