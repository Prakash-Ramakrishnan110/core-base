import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../modules/auth/auth.service';

// Extend FastifyRequest to include userId
declare module 'fastify' {
    interface FastifyRequest {
        userId?: string;
    }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches userId to request
 */
export async function authMiddleware(
    request: FastifyRequest,
    reply: FastifyReply
) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(401).send({
                error: 'Missing or invalid authorization header',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token and get user ID
        const userId = authService.verifyAccessToken(token);

        // Attach user ID to request
        request.userId = userId;
    } catch (error) {
        return reply.status(401).send({
            error: 'Invalid or expired access token',
        });
    }
}
