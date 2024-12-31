import { Migration } from '@mikro-orm/migrations';

export class Migration20241231132302 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "review" alter column "user_pic" type text using ("user_pic"::text);');
    this.addSql('alter table if exists "review" alter column "user_pic" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "review" alter column "user_pic" type text using ("user_pic"::text);');
    this.addSql('alter table if exists "review" alter column "user_pic" set not null;');
  }

}
