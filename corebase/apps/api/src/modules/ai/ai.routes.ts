import { FastifyInstance } from 'fastify';
import { aiController } from './ai.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export async function aiRoutes(app: FastifyInstance) {
    app.post(
        '/chat',
        { preHandler: [authMiddleware] },
        (req, res) => aiController.chat(req, res)
    );
}
