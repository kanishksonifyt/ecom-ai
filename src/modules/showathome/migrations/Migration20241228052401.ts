import { Migration } from '@mikro-orm/migrations';

export class Migration20241228052401 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "showonhome" ("id" text not null, "product_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "showonhome_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_showonhome_deleted_at" ON "showonhome" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "showonhome" cascade;');
  }

}
