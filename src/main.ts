import { NestFactory } from '@nestjs/core';
import { Handler, Context, Callback } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import * as express from 'express';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { CartEntity } from './entities/Cart';
import { CartItemEntity } from './entities/CartItem';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import helmet from 'helmet';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

const expressApp = express();

async function getDatabaseCredentials(secretArn: string) {
  const client = new SecretsManagerClient({ region: 'eu-central-1' });
  const command = new GetSecretValueCommand({ SecretId: secretArn });
  const response = await client.send(command);
  const secret = JSON.parse(response.SecretString || '{}');
  return {
    username: secret.username,
    password: secret.password,
  };
}

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
    console.log('LAMBDA ENV: ', process.env.DB_HOST)

    if (!cachedConnection) {
      const { username, password } = await getDatabaseCredentials(process.env.DB_SECRET_ARN as string);

      console.log('Database Credentials: ', username, password)

      cachedConnection = await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username,
        password,
        database: process.env.DB_NAME,
        entities: [CartEntity, CartItemEntity],
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
