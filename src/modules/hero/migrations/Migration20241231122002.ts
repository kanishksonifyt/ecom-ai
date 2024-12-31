import { Migration } from '@mikro-orm/migrations';

export class Migration20241231122002 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "hero" rename column "secoundbuttontext" to "secoundbuttonroute";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "hero" rename column "secoundbuttonroute" to "secoundbuttontext";');
  }

}
