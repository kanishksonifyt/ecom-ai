import { Migration } from '@mikro-orm/migrations';

export class Migration20241230090349 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "highlight" add column if not exists "product_id" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "highlight" drop column if exists "product_id";');
  }

}
