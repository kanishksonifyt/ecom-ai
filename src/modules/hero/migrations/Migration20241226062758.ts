import { Migration } from '@mikro-orm/migrations';

export class Migration20241226062758 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "hero" add column if not exists "index" integer not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "hero" drop column if exists "index";');
  }

}
