import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTBLShipping1725133314113 implements MigrationInterface {
    name = 'AlterTBLShipping1725133314113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD "phone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipping" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "shipping" ADD "phone" integer NOT NULL`);
    }

}
