import { MigrationInterface, QueryRunner } from "typeorm";

export class AddONDELETECASCADEToProductsReviews1725323053059 implements MigrationInterface {
    name = 'AddONDELETECASCADEToProductsReviews1725323053059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_b3757bea8f0f087ee8eea96d9e3"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "productRefId" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" RENAME COLUMN "productId" TO "productRefId"`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_b3757bea8f0f087ee8eea96d9e3" FOREIGN KEY ("productRefId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
