import { Migration } from '@mikro-orm/migrations';

export class Migration20241227072540 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "featured" add column if not exists "text" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "featured" drop column if exists "text";');
  }

}
