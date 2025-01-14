import { Migration } from '@mikro-orm/migrations';

export class Migration20250113110137 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "featured" alter column "type" type text using ("type"::text);');
    this.addSql('alter table if exists "featured" alter column "type" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "featured" alter column "type" type text using ("type"::text);');
    this.addSql('alter table if exists "featured" alter column "type" set not null;');
  }

}
