import { Migration } from '@mikro-orm/migrations';

export class Migration20241230071131 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "homepage" add column if not exists "ridirect" text not null, add column if not exists "text" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "homepage" drop column if exists "ridirect";');
    this.addSql('alter table if exists "homepage" drop column if exists "text";');
  }

}
