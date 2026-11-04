import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjects1793836800000 implements MigrationInterface {
  name = 'CreateProjects1793836800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."projects_status_enum" AS ENUM('pendente', 'em_andamento', 'concluido')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(160) NOT NULL,
        "description" text NOT NULL,
        "status" "public"."projects_status_enum" NOT NULL DEFAULT 'pendente',
        "agility" smallint NOT NULL,
        "enchantment" smallint NOT NULL,
        "efficiency" smallint NOT NULL,
        "excellence" smallint NOT NULL,
        "transparency" smallint NOT NULL,
        "ambition" smallint NOT NULL,
        "responsible_id" uuid NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_projects_agility" CHECK ("agility" BETWEEN 0 AND 100),
        CONSTRAINT "CHK_projects_enchantment" CHECK ("enchantment" BETWEEN 0 AND 100),
        CONSTRAINT "CHK_projects_efficiency" CHECK ("efficiency" BETWEEN 0 AND 100),
        CONSTRAINT "CHK_projects_excellence" CHECK ("excellence" BETWEEN 0 AND 100),
        CONSTRAINT "CHK_projects_transparency" CHECK ("transparency" BETWEEN 0 AND 100),
        CONSTRAINT "CHK_projects_ambition" CHECK ("ambition" BETWEEN 0 AND 100),
        CONSTRAINT "FK_projects_responsible" FOREIGN KEY ("responsible_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_responsible_id" ON "projects" ("responsible_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_status" ON "projects" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_projects_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_projects_responsible_id"`,
    );
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
  }
}
