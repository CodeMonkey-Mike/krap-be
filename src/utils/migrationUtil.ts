import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';
class MigrationUtil {
  public static getIDColumn(): TableColumnOptions[] {
    const columns: TableColumnOptions[] = [];
    columns.push({
      name: 'id',
      type: 'int',
      isPrimary: true,
      isNullable: false,
      isGenerated: true,
      generationStrategy: 'increment',
    });

    return columns;
  }

  public static getVarCharColumn({
    name = '',
    length = '255',
    isPrimary = false,
    isNullable = false,
    isUnique = false,
    defaultValue = null,
  }): TableColumnOptions {
    return {
      name,
      length,
      isPrimary,
      isNullable,
      isUnique,
      default: `'${defaultValue}'`,
      type: 'varchar',
    };
  }
}
export default MigrationUtil;
