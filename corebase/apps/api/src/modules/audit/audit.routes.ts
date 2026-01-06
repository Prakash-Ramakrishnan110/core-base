import { FastifyInstance } from 'fastify';
import { auditController } from './audit.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export async function auditRoutes(server: FastifyInstance) {
    server.get(
        '/projects/:projectId/audit-logs',
        { preHandler: [authMiddleware] },
        auditController.listLogs
    );
}
