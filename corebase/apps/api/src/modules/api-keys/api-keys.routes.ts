import { FastifyInstance } from 'fastify';
import { apiKeysController } from './api-keys.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export async function apiKeysRoutes(server: FastifyInstance) {
    server.post(
        '/projects/:projectId/keys',
        { preHandler: [authMiddleware] },
        apiKeysController.createKey
    );

    server.get(
        '/projects/:projectId/keys',
        { preHandler: [authMiddleware] },
        apiKeysController.listKeys
    );

    server.delete(
        '/projects/:projectId/keys/:keyId',
        { preHandler: [authMiddleware] },
        apiKeysController.revokeKey
    );
}
