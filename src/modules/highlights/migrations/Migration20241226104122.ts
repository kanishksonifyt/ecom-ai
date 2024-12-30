import { Migration } from '@mikro-orm/migrations';

export class Migration20241226104122 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "highlight" ("id" text not null, "image" text not null, "link" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "highlight_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_highlight_deleted_at" ON "highlight" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "highlight" cascade;');
  }

}
