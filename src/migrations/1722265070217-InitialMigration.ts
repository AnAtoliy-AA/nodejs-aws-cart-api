import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1722265070217 implements MigrationInterface {
    name = 'InitialMigration1722265070217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "carts_status_check"`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cartItems" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" character varying NOT NULL, "count" integer NOT NULL, "cartId" uuid NOT NULL, "productId" uuid NOT NULL, CONSTRAINT "REL_f2c97dd179feb55be1b354fb54" UNIQUE ("productId"), CONSTRAINT "PK_bb4f983020f59696f40ea04d6a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('PENDING', 'FINISHED')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payment" json NOT NULL, "delivery" json NOT NULL, "comments" character varying, "status" "public"."orders_status_enum", "total" integer NOT NULL, "userId" uuid NOT NULL, "cartId" uuid, CONSTRAINT "REL_d7b6b269e131a5287bd05da4a5" UNIQUE ("cartId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "updated_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."carts_status_enum" AS ENUM('OPEN', 'ORDERED')`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "status" "public"."carts_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cartItems" ADD CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartItems" ADD CONSTRAINT "FK_f2c97dd179feb55be1b354fb548" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_d7b6b269e131a5287bd05da4a51" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_d7b6b269e131a5287bd05da4a51"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`);
        await queryRunner.query(`ALTER TABLE "cartItems" DROP CONSTRAINT "FK_f2c97dd179feb55be1b354fb548"`);
        await queryRunner.query(`ALTER TABLE "cartItems" DROP CONSTRAINT "FK_7fac278e61eddd24a215e8bdf7c"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."carts_status_enum"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "status" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "updated_at" date NOT NULL DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "created_at" date NOT NULL DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "cartItems"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "carts_status_check" CHECK (((status)::text = ANY ((ARRAY['OPEN'::character varying, 'ORDERED'::character varying])::text[])))`);
    }

}
