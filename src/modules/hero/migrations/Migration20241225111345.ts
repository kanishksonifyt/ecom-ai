import { Migration } from '@mikro-orm/migrations';

export class Migration20241225111345 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "hero" ("id" text not null, "title" text not null, "subtitle" text not null, "firsttext" text not null, "secondtext" text not null, "image" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "hero_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_hero_deleted_at" ON "hero" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "brand" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "brand" ("id" text not null, "title" text not null, "subtitle" text not null, "firsttext" text not null, "secondtext" text not null, "image" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_brand_deleted_at" ON "brand" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop table if exists "hero" cascade;');
  }

}
