import { Migration } from '@mikro-orm/migrations';

export class Migration20241227145051 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "item" ("id" text not null, "show_on_homepage" boolean not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "item_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_item_deleted_at" ON "item" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "item" cascade;');
  }

}
