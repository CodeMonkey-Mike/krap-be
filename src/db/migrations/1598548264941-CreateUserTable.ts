import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import MigrationUtil from '../../utils/migrationUtil';

export class CreateUserTable1598548264941 implements MigrationInterface {
  private static readonly table = new Table({
    name: 'user',
    columns: [
      ...MigrationUtil.getIDColumn(),
      MigrationUtil.getVarCharColumn({ name: 'username' }),
      MigrationUtil.getVarCharColumn({ name: 'email' }),
      MigrationUtil.getVarCharColumn({ name: 'password' }),
      { name: 'created_at', type: "timestamp with time zone", default: "timezone('utc'::text, now())"},
      { name: 'updated_at',type: "timestamp with time zone", default: "timezone('utc'::text, now())"},
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(CreateUserTable1598548264941.table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(CreateUserTable1598548264941.table);
  }
}
