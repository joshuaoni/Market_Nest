import { MigrationInterface, QueryRunner } from "typeorm";

export class Add3TBLUnderOrders1725056633881 implements MigrationInterface {
    name = 'Add3TBLUnderOrders1725056633881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipping" ("id" SERIAL NOT NULL, "phone" integer NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "postCode" character varying NOT NULL, "state" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_0dc6ac92ee9cbc2c1611d77804c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('processing', 'shipped', 'delivered', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'processing', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "shippedAt" TIMESTAMP, "deliveredAt" TIMESTAMP, "buyerId" integer, "shippingAddressId" integer, CONSTRAINT "REL_cc4e4adab232e8c05026b2f345" UNIQUE ("shippingAddressId"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ordered-item" ("id" SERIAL NOT NULL, "product_unit_price" numeric(10,2) NOT NULL DEFAULT '0', "product_quantity" integer NOT NULL, "orderId" integer, "productId" integer, CONSTRAINT "PK_e736d493208593dda88e9abe75d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "shipping"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordered-item" ADD CONSTRAINT "FK_85179e5de76effdaa02772e216b" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordered-item" ADD CONSTRAINT "FK_140467508ea15b22045715f1b71" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ordered-item" DROP CONSTRAINT "FK_140467508ea15b22045715f1b71"`);
        await queryRunner.query(`ALTER TABLE "ordered-item" DROP CONSTRAINT "FK_85179e5de76effdaa02772e216b"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_9877ffd9a491c3e82f5b32d4f4d"`);
        await queryRunner.query(`DROP TABLE "ordered-item"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "shipping"`);
    }

}
