import { Migration } from '@mikro-orm/migrations';

export class Migration20241228105315 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "homepage" ("id" text not null, "index" integer not null, "route" text not null, "title" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "homepage_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_homepage_deleted_at" ON "homepage" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "homepage" cascade;');
  }

}
