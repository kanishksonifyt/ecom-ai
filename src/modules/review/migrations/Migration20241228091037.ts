import { Migration } from '@mikro-orm/migrations';

export class Migration20241228091037 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "review" rename column "review" to "rating";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "review" rename column "rating" to "review";');
  }

}
