import { Migration } from '@mikro-orm/migrations';

export class Migration20250113072221 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "highlight" alter column "link" type text using ("link"::text);');
    this.addSql('alter table if exists "highlight" alter column "link" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "highlight" alter column "link" type text using ("link"::text);');
    this.addSql('alter table if exists "highlight" alter column "link" set not null;');
  }

}
