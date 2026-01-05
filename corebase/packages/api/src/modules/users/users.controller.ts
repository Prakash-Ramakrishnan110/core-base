import { FastifyRequest, FastifyReply } from 'fastify';
import { usersService } from './users.service';
import { logger } from '../../utils/logger';

export class UsersController {
    async listUsers(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await usersService.listUsers();
            return reply.send({ data: users });
        } catch (error) {
            logger.error('Failed to list users:', error);
            return reply.status(500).send({ error: 'Failed to list users' });
        }
    }

    async deleteUser(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            await usersService.deleteUser(id);
            return reply.send({ message: 'User deleted' });
        } catch (error) {
            logger.error('Failed to delete user:', error);
            return reply.status(500).send({ error: 'Failed to delete user' });
        }
    }
}

export const usersController = new UsersController();
