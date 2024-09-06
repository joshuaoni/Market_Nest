import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascade1725346163872 implements MigrationInterface {
    name = 'AddCascade1725346163872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updatedAttttt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updatedAttttt" TO "updatedAt"`);
    }

}
