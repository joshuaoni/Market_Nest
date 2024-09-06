import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTBLReviews1725043720704 implements MigrationInterface {
    name = 'AddTBLReviews1725043720704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "rating" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "addedById" integer, "productId" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_b36fa3a3e23e179324e47b7cb60" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_a6b3c434392f5d10ec171043666"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_b36fa3a3e23e179324e47b7cb60"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
    }

}
