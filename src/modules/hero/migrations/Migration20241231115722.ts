import { Migration } from '@mikro-orm/migrations';

export class Migration20241231115722 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "hero" add column if not exists "firstbuttonroute" text null, add column if not exists "secoundbuttontext" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "hero" drop column if exists "firstbuttonroute";');
    this.addSql('alter table if exists "hero" drop column if exists "secoundbuttontext";');
  }

}
