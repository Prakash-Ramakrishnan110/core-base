import { db } from '../../db';

export class SqlService {
    async executeQuery(projectId: string, query: string) {
        // In a real multi-tenant system with separate DBs/Schemas per project, 
        // we would switch the search_path or connection here.
        // For now, we assume a single DB. 
        // We really should restrict this to the project's ownership, 
        // but since this is an "Admin" SQL editor for the project owner, 
        // we execute the raw query.

        // LIMITATION: This allows cross-project access if we don't implement RLS or Schema separation properly.
        // For this MVP, we trust the Admin user of the project.

        const start = Date.now();
        try {
            const result = await db.query(query);
            const duration = Date.now() - start;
            return {
                rows: result.rows,
                fields: result.fields.map(f => ({ name: f.name, dataTypeID: f.dataTypeID })),
                rowCount: result.rowCount,
                command: result.command,
                duration
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export const sqlService = new SqlService();
