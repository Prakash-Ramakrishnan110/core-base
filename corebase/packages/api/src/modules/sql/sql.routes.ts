import { FastifyInstance } from 'fastify';
import { sqlController } from './sql.controller';
import { authMiddleware } from '../../middleware/auth';

export async function sqlRoutes(server: FastifyInstance) {
    server.post('/projects/:projectId/sql', { preHandler: [authMiddleware] }, sqlController.execute);
}
