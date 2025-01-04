import { Migration } from '@mikro-orm/migrations';

export class Migration20250103123258 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "review" add column if not exists "product_id" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "review" drop column if exists "product_id";');
  }

}
