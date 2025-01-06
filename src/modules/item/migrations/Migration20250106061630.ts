import { Migration } from '@mikro-orm/migrations';

export class Migration20250106061630 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "item" add column if not exists "product_id" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "item" drop column if exists "product_id";');
  }

}
