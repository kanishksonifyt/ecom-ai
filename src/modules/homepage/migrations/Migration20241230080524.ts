import { Migration } from '@mikro-orm/migrations';

export class Migration20241230080524 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "homepage" alter column "redirect" type text using ("redirect"::text);');
    this.addSql('alter table if exists "homepage" alter column "redirect" drop not null;');
    this.addSql('alter table if exists "homepage" alter column "text" type text using ("text"::text);');
    this.addSql('alter table if exists "homepage" alter column "text" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "homepage" alter column "redirect" type text using ("redirect"::text);');
    this.addSql('alter table if exists "homepage" alter column "redirect" set not null;');
    this.addSql('alter table if exists "homepage" alter column "text" type text using ("text"::text);');
    this.addSql('alter table if exists "homepage" alter column "text" set not null;');
  }

}
