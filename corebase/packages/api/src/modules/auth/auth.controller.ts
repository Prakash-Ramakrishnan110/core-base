import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from './auth.service';
import { logger } from '../../utils/logger';

export class AuthController {
    /**
     * Register a new user
     * POST /auth/register
     */
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password, fullName } = request.body as {
                email: string;
                password: string;
                fullName: string;
            };

            // Basic validation
            if (!email || !password || !fullName) {
                return reply.status(400).send({
                    error: 'Missing required fields: email, password, fullName',
                });
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return reply.status(400).send({
                    error: 'Invalid email format',
                });
            }

            // Password strength validation (min 8 chars)
            if (password.length < 8) {
                return reply.status(400).send({
                    error: 'Password must be at least 8 characters long',
                });
            }

            const result = await authService.register({ email, password, fullName });

            logger.info(`User registered: ${email}`);

            return reply.status(201).send({
                user: result.user,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
            });
        } catch (error: any) {
            logger.error('Registration error:', error);

            if (error.message === 'User with this email already exists') {
                return reply.status(409).send({ error: error.message });
            }

            return reply.status(500).send({
                error: 'Failed to register user',
            });
        }
    }

    /**
     * Login user
     * POST /auth/login
     */
    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password } = request.body as {
                email: string;
                password: string;
            };

            // Basic validation
            if (!email || !password) {
                return reply.status(400).send({
                    error: 'Missing required fields: email, password',
                });
            }

            const result = await authService.login({ email, password });

            logger.info(`User logged in: ${email}`);

            return reply.status(200).send({
                user: result.user,
                accessToken: result.tokens.accessToken,
                refreshToken: result.tokens.refreshToken,
            });
        } catch (error: any) {
            logger.error('Login error:', error);

            if (error.message === 'Invalid email or password') {
                return reply.status(401).send({ error: error.message });
            }

            return reply.status(500).send({
                error: 'Failed to login',
            });
        }
    }

    /**
     * Refresh access token
     * POST /auth/refresh
     */
    async refresh(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { refreshToken } = request.body as {
                refreshToken: string;
            };

            if (!refreshToken) {
                return reply.status(400).send({
                    error: 'Missing refresh token',
                });
            }

            const tokens = await authService.refreshToken(refreshToken);

            return reply.status(200).send({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
        } catch (error: any) {
            logger.error('Token refresh error:', error);

            return reply.status(401).send({
                error: 'Invalid or expired refresh token',
            });
        }
    }

    /**
     * Logout user
     * POST /auth/logout
     */
    async logout(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { refreshToken } = request.body as {
                refreshToken: string;
            };

            if (!refreshToken) {
                return reply.status(400).send({
                    error: 'Missing refresh token',
                });
            }

            await authService.logout(refreshToken);

            logger.info('User logged out');

            return reply.status(200).send({
                message: 'Logged out successfully',
            });
        } catch (error: any) {
            logger.error('Logout error:', error);

            return reply.status(500).send({
                error: 'Failed to logout',
            });
        }
    }
}

export const authController = new AuthController();
