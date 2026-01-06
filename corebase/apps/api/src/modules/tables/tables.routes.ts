import { FastifyInstance } from 'fastify';
import { tablesController } from './tables.controller';
import { recordsController } from './records.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export async function tablesRoutes(server: FastifyInstance) {
    // Tables Management
    server.post(
        '/projects/:projectId/tables',
        { preHandler: [authMiddleware] },
        tablesController.createTable
    );

    server.get(
        '/projects/:projectId/tables',
        { preHandler: [authMiddleware] },
        tablesController.listTables
    );

    server.get(
        '/projects/:projectId/tables/:tableId',
        { preHandler: [authMiddleware] },
        tablesController.getTable
    );

    server.delete(
        '/projects/:projectId/tables/:tableId',
        { preHandler: [authMiddleware] },
        tablesController.deleteTable
    );

    // Records Management
    server.post(
        '/projects/:projectId/tables/:tableName/records',
        { preHandler: [authMiddleware] },
        recordsController.createRecord
    );

    server.get(
        '/projects/:projectId/tables/:tableName/records',
        { preHandler: [authMiddleware] },
        recordsController.listRecords
    );

    server.get(
        '/projects/:projectId/tables/:tableName/records/:recordId',
        { preHandler: [authMiddleware] },
        recordsController.getRecord
    );

    server.delete(
        '/projects/:projectId/tables/:tableName/records/:recordId',
        { preHandler: [authMiddleware] },
        recordsController.deleteRecord
    );
}
