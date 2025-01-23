import { Migration } from '@mikro-orm/migrations';

export class Migration20250121110936 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "featured" ("id" text not null, "title" text not null, "link" text not null, "image" text not null, "text" text not null, "type" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "featured_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_featured_deleted_at" ON "featured" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "featured" cascade;');
  }

}
