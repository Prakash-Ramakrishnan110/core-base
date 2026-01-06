import { FastifyInstance } from 'fastify';
import { authController } from './auth.controller';

export async function authRoutes(app: FastifyInstance) {
    // Register
    app.post('/register', async (request, reply) => {
        return authController.register(request, reply);
    });

    // Login
    app.post('/login', async (request, reply) => {
        return authController.login(request, reply);
    });

    // Refresh token
    app.post('/refresh', async (request, reply) => {
        return authController.refresh(request, reply);
    });

    // Logout
    app.post('/logout', async (request, reply) => {
        return authController.logout(request, reply);
    });
}
