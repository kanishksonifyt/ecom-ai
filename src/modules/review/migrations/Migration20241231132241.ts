import { Migration } from '@mikro-orm/migrations';

export class Migration20241231132241 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "review" add column if not exists "user_pic" text not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "review" drop column if exists "user_pic";');
  }

}
