import { query } from '../../database/query';
import { tablesService } from './tables.service';

export class RecordsService {

    private getPhysicalTableName(tableId: string): string {
        return `dt_${tableId.replace(/-/g, '')}`;
    }

    async createRecord(projectId: string, tableName: string, data: any, userId?: string) {
        // 1. Get table definition
        const table = await tablesService.getTable(projectId, tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        const physicalTableName = this.getPhysicalTableName(table.id);
        const validColumns = table.schema.map(c => c.name);

        // Filter data to only include defined columns
        const columnsToInsert: string[] = [];
        const values: any[] = [];
        const placeholders: string[] = [];
        let paramIndex = 1;

        // Add user tracking if available
        if (userId) {
            columnsToInsert.push('created_by');
            values.push(userId);
            placeholders.push(`$${paramIndex++}`);
        }

        for (const [key, value] of Object.entries(data)) {
            if (validColumns.includes(key)) {
                columnsToInsert.push(`"${key}"`);
                values.push(value);
                placeholders.push(`$${paramIndex++}`);
            }
        }

        if (columnsToInsert.length === 0 && !userId) {
            // Allow inserting just ID/timestamps if no data provided? 
            // Better to at least have empty default insert
        }

        const sql = `
            INSERT INTO "${physicalTableName}" (${columnsToInsert.join(', ')})
            VALUES (${placeholders.join(', ')})
            RETURNING *
        `;

        const result = await query(sql, values);
        return result.rows[0];
    }

    async listRecords(projectId: string, tableName: string, limit = 100, offset = 0) {
        const table = await tablesService.getTable(projectId, tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        const physicalTableName = this.getPhysicalTableName(table.id);

        const sql = `
            SELECT * FROM "${physicalTableName}"
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;

        const result = await query(sql, [limit, offset]);
        return result.rows;
    }

    async getRecord(projectId: string, tableName: string, recordId: string) {
        const table = await tablesService.getTable(projectId, tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        const physicalTableName = this.getPhysicalTableName(table.id);

        const sql = `
            SELECT * FROM "${physicalTableName}"
            WHERE id = $1
        `;

        const result = await query(sql, [recordId]);
        return result.rows[0] || null;
    }

    async deleteRecord(projectId: string, tableName: string, recordId: string): Promise<boolean> {
        const table = await tablesService.getTable(projectId, tableName);
        if (!table) throw new Error(`Table ${tableName} not found`);

        const physicalTableName = this.getPhysicalTableName(table.id);

        const sql = `
            DELETE FROM "${physicalTableName}"
            WHERE id = $1
            RETURNING id
        `;

        const result = await query(sql, [recordId]);
        return result.rows.length > 0;
    }
}

export const recordsService = new RecordsService();
