import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

import * as dotenv from 'dotenv';

dotenv.config();

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment = {
      DB_HOST: process.env.DB_HOST!,
      DB_PORT: process.env.DB_PORT!,
      DB_USERNAME: process.env.DB_USERNAME!,
      DB_PASSWORD: process.env.DB_PASSWORD!,
      DB_SECRET_ARN: process.env.DB_SECRET_ARN!,
      DB_NAME: process.env.DB_NAME ?? 'rsAws',
    };

    // const secret = secretsmanager.Secret.fromSecretNameV2(this, 'MySecret', process.env.SECRET_NAME ?? 'my-database-secret');

    const nestLambda = new lambda.Function(this, 'MyNestLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../dist')),
      handler: 'bundle.handler',
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      functionName: 'MyNestAwsCartFunction',
      environment,
    });

    const api = new apigateway.LambdaRestApi(this, 'NestApi', {
      handler: nestLambda,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    api.root.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(nestLambda),
    });
  }
}
