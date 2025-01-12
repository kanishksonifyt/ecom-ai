import { Migration } from '@mikro-orm/migrations';

export class Migration20250110124930 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "point" alter column "coins" type integer using ("coins"::integer);');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "point" alter column "coins" type text using ("coins"::text);');
  }

}
