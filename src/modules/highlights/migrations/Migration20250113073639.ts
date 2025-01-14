import { Migration } from '@mikro-orm/migrations';

export class Migration20250113073639 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "highlight" add column if not exists "type" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "highlight" drop column if exists "type";');
  }

}
