import { Migration } from '@mikro-orm/migrations';

export class Migration20250110094439 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "point" ("id" text not null, "coins" text not null, "relatedto" text not null, "owner_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "point_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_point_deleted_at" ON "point" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "point" cascade;');
  }

}
