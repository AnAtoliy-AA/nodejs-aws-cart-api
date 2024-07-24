import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';


import * as dotenv from 'dotenv';

dotenv.config();

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2,
    });


    const nestLambda = new lambda.Function(this, 'NestLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../dist/src')),
      handler: 'main.handler',
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      functionName: 'NestAwsCartFunction',
      environment: {
        DB_HOST: process.env.DB_HOST!,
        DB_PORT: process.env.DB_PORT!,
        DB_SECRET_ARN: process.env.DB_SECRET_ARN!,
        DB_NAME: process.env.DB_NAME ?? 'rsAws',
      },
      vpc,
    });

    const api = new apigateway.LambdaRestApi(this, 'NestApi', {
      handler: nestLambda,
      proxy: true,
    });

  }
}
