import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascade1725346275796 implements MigrationInterface {
    name = 'AddCascade1725346275796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updatedAttttt" TO "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updatedAttttt"`);
    }

}
