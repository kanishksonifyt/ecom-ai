import { Migration } from '@mikro-orm/migrations';

export class Migration20241230071335 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "homepage" rename column "ridirect" to "redirect";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "homepage" rename column "redirect" to "ridirect";');
  }

}
