import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEntities1641234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Orders table
    await queryRunner.query(`ALTER TABLE "orders" ADD "userId" uuid`);
    await queryRunner.query(`UPDATE "orders" SET "userId" = "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "user_id"`);

    // Carts table
    await queryRunner.query(`ALTER TABLE "carts" ADD "userId" uuid`);
    await queryRunner.query(`UPDATE "carts" SET "userId" = "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "carts" ALTER COLUMN "userId" SET NOT NULL`,
    );
    // await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "user_id"`);

    // Step 1: Add the column without NOT NULL constraint
    await queryRunner.query(
      `ALTER TABLE "carts" ADD "user_id" character varying`,
    );

    // Step 2: Update existing rows to have a default value
    await queryRunner.query(
      `UPDATE "carts" SET "user_id" = 'default_user_id' WHERE "user_id" IS NULL`,
    );

    // Step 3: Alter the column to set NOT NULL constraint
    await queryRunner.query(
      `ALTER TABLE "carts" ALTER COLUMN "user_id" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Orders table
    await queryRunner.query(`ALTER TABLE "orders" ADD "user_id" uuid`);
    await queryRunner.query(`UPDATE "orders" SET "user_id" = "userId"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "userId"`);

    // Carts table
    await queryRunner.query(`ALTER TABLE "carts" ADD "user_id" uuid`);
    await queryRunner.query(`UPDATE "carts" SET "user_id" = "userId"`);
    await queryRunner.query(
      `ALTER TABLE "carts" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    // await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "userId"`);
  }
}
