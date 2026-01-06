import { FastifyInstance } from 'fastify';
import { usersController } from './users.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export async function usersRoutes(app: FastifyInstance) {
    app.addHook('preHandler', authMiddleware);

    app.get('/', usersController.listUsers);
    app.delete('/:id', usersController.deleteUser);
}
