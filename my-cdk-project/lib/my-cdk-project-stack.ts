import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import * as path from 'path';
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class MyCdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2
    });

    const dbInstance = new rds.DatabaseInstance(this, "MyRDSInstance", {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12_4 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
      vpc,
      credentials: rds.Credentials.fromGeneratedSecret("postgres"),
      databaseName: "mydatabase",
    });

    const dbSecret = secretsmanager.Secret.fromSecretAttributes(this, 'DBSecret', {
      secretCompleteArn: 'arn:aws:secretsmanager:region:account-id:secret:my-database-secret'
    });

    const nestLambda = new lambda.Function(this, 'NestLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../src')),
      handler: 'main.handler',
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      functionName: 'NestAwsCartFunction',
      environment: {
        DB_HOST: dbInstance.dbInstanceEndpointAddress,
        DB_PORT: dbInstance.dbInstanceEndpointPort,
        DB_USERNAME: dbSecret!.secretValueFromJson("username").toString(),
        DB_PASSWORD: dbSecret!.secretValueFromJson("password").toString(),
        DB_NAME: "mydatabase",
      },
      vpc,
      securityGroups: [dbInstance.connections.securityGroups[0]]
    });

    const api = new apigateway.LambdaRestApi(this, 'NestApi', {
      handler: nestLambda,
      proxy: true,
    });

    dbInstance.connections.allowFrom(nestLambda, ec2.Port.tcp(5432));
  }
}