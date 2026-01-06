import { query } from '../../database/query';
import { logger } from '../../utils/logger';

export interface ColumnDefinition {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'timestamp';
    required?: boolean;
    unique?: boolean;
}

export interface CreateTableInput {
    projectId: string;
    tableName: string;
    displayName?: string;
    columns: ColumnDefinition[];
}

export interface TableResponse {
    id: string;
    projectId: string;
    tableName: string;
    displayName: string | null;
    schema: ColumnDefinition[];
    createdAt: Date;
    updatedAt: Date;
}

export class TablesService {



    // Better approach: Use the UUID of the metadata record as the physical table name suffix.
    // simpler: "dynamic_tables"."t_<uuid>"
    // But let's stick to the plan: projectId + tableName mostly for debuggability, but safely.
    // Actually, allowing user defined table names in physical DB is risky for SQL injection if not carefully quoted.
    // Safest: t_<metadata_id>

    // Changing strategy: 
    // 1. Insert metadata first to get ID.
    // 2. Use ID to create physical table `dt_<id_without_dashes>`.

    async createTable(input: CreateTableInput): Promise<TableResponse> {
        const { projectId, tableName, displayName, columns } = input;

        // 1. Create metadata
        const result = await query(
            `INSERT INTO tables_metadata (project_id, table_name, display_name, schema)
             VALUES ($1, $2, $3, $4)
             RETURNING id, project_id, table_name, display_name, schema, created_at, updated_at`,
            [projectId, tableName, displayName, JSON.stringify(columns)]
        );

        const tableMetadata = result.rows[0];
        const physicalTableName = `dt_${tableMetadata.id.replace(/-/g, '')}`;

        // 2. Create physical table
        // Map abstract types to Postgres types
        const columnDefs = columns.map(col => {
            let pgType = 'TEXT';
            if (col.type === 'number') pgType = 'NUMERIC';
            if (col.type === 'boolean') pgType = 'BOOLEAN';
            if (col.type === 'timestamp') pgType = 'TIMESTAMP WITH TIME ZONE';

            let constraints = '';
            if (col.required) constraints += ' NOT NULL';
            if (col.unique) constraints += ' UNIQUE';

            return `"${col.name}" ${pgType}${constraints}`;
        });

        // Always add standard system columns
        const systemColumns = [
            `id UUID PRIMARY KEY DEFAULT uuid_generate_v4()`,
            `created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`,
            `updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`,
            `created_by UUID NULL REFERENCES users(id)`
        ];

        const createSql = `
            CREATE TABLE "${physicalTableName}" (
                ${[...systemColumns, ...columnDefs].join(',\n')}
            );
        `;

        try {
            await query(createSql);

            // Add trigger for updated_at
            await query(`
                CREATE TRIGGER update_${physicalTableName}_modtime
                BEFORE UPDATE ON "${physicalTableName}"
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            `);

        } catch (error) {
            // Rollback metadata if table creation fails
            await query('DELETE FROM tables_metadata WHERE id = $1', [tableMetadata.id]);
            throw error;
        }

        return {
            id: tableMetadata.id,
            projectId: tableMetadata.project_id,
            tableName: tableMetadata.table_name,
            displayName: tableMetadata.display_name,
            schema: tableMetadata.schema,
            createdAt: tableMetadata.created_at,
            updatedAt: tableMetadata.updated_at
        };
    }

    async listTables(projectId: string): Promise<TableResponse[]> {
        const result = await query(
            `SELECT id, project_id, table_name, display_name, schema, created_at, updated_at
             FROM tables_metadata
             WHERE project_id = $1 AND deleted_at IS NULL
             ORDER BY created_at DESC`,
            [projectId]
        );

        return result.rows.map(row => ({
            id: row.id,
            projectId: row.project_id,
            tableName: row.table_name,
            displayName: row.display_name,
            schema: row.schema,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }));
    }

    async getTable(projectId: string, tableIdOrName: string): Promise<TableResponse | null> {
        // Support getting by ID or Name
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tableIdOrName);

        logger.info(`getTable: ${tableIdOrName} (isUuid: ${isUuid})`);

        const queryStr = isUuid
            ? `SELECT * FROM tables_metadata WHERE id = $1 AND project_id = $2 AND deleted_at IS NULL`
            : `SELECT * FROM tables_metadata WHERE table_name = $1 AND project_id = $2 AND deleted_at IS NULL`;

        const result = await query(queryStr, [tableIdOrName, projectId]);

        if (result.rows.length === 0) {
            logger.warn(`getTable: Table not found.Input: ${tableIdOrName}, Project: ${projectId} `);
            return null;
        }
        const row = result.rows[0];

        return {
            id: row.id,
            projectId: row.project_id,
            tableName: row.table_name,
            displayName: row.display_name,
            schema: row.schema,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async deleteTable(projectId: string, tableId: string): Promise<boolean> {
        logger.info(`deleteTable: Deleting table ${tableId} for project ${projectId}`);

        // 1. Get metadata to find physical table name
        const table = await this.getTable(projectId, tableId);
        if (!table) {
            logger.warn(`deleteTable: Metadata not found for table ${tableId}`);
            return false;
        }

        const physicalTableName = `dt_${table.id.replace(/-/g, '')} `;

        // 2. Drop physical table
        try {
            await query(`DROP TABLE IF EXISTS "${physicalTableName}" CASCADE`);
        } catch (error) {
            logger.error(`Failed to drop physical table ${physicalTableName} `, error);
            // Continue to delete metadata even if drop fails (might already be gone)
        }

        // 3. Soft delete metadata
        const result = await query(
            `UPDATE tables_metadata 
             SET deleted_at = NOW() 
             WHERE id = $1 AND project_id = $2 AND deleted_at IS NULL
             RETURNING id`,
            [tableId, projectId]
        );

        return result.rows.length > 0;
    }
}

export const tablesService = new TablesService();
