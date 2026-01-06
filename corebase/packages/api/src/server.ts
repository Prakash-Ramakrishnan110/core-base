import './bootstrap'; // Must be first (Restart Triggered)
import path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { validateEnv } from './utils/env';
import { logger } from './utils/logger';
import { pool } from './database/pool';

// Validate environment variables
console.log('DEBUG: Checking environment variables...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? `SET (${process.env.JWT_SECRET.length} chars)` : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);

const env = validateEnv();

// Create Fastify instance
const app = Fastify({
    logger: logger as any,
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
});

// Register plugins
async function registerPlugins() {
    // CORS
    await app.register(cors, {
        origin: env.CORS_ORIGIN,
        credentials: true,
    });

    // Rate limiting
    await app.register(rateLimit, {
        max: parseInt(env.RATE_LIMIT_MAX),
        timeWindow: parseInt(env.RATE_LIMIT_WINDOW),
    });
}

// Register routes
async function registerRoutes() {
    const { authRoutes } = await import('./modules/auth/auth.routes');
    const { projectsRoutes } = await import('./modules/projects/projects.routes');
    const { apiKeysRoutes } = await import('./modules/api-keys/api-keys.routes');
    const { tablesRoutes } = await import('./modules/tables/tables.routes');
    const { auditRoutes } = await import('./modules/audit/audit.routes');
    const { aiRoutes } = await import('./modules/ai/ai.routes');

    // Auth routes
    await app.register(authRoutes, { prefix: '/auth' });

    // Projects routes (protected)
    await app.register(projectsRoutes, { prefix: '/projects' });

    // API Keys routes (protected)
    await app.register(apiKeysRoutes);

    // Tables routes (protected)
    await app.register(tablesRoutes);

    // Audit routes (protected)
    await app.register(auditRoutes);

    // AI routes (protected)
    await app.register(aiRoutes, { prefix: '/ai' });

    // Users routes (Admin/Protected)
    const { usersRoutes } = await import('./modules/users/users.routes');
    await app.register(usersRoutes, { prefix: '/users' });
}

// Health check endpoint
app.get('/health', async (_request, reply) => {
    try {
        await pool.query('SELECT 1');
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
        };
    } catch (error) {
        logger.error('Health check failed:', error);
        reply.status(503);
        return {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        };
    }
});

// Root endpoint
app.get('/', async () => {
    return {
        name: 'CoreBase API',
        version: env.API_VERSION,
        status: 'running',
    };
});

// Start server
async function start() {
    try {
        await registerPlugins();
        await registerRoutes();

        const port = parseInt(env.PORT);
        await app.listen({ port, host: '0.0.0.0' });

        logger.info(`🚀 CoreBase API running on http://localhost:${port}`);
        logger.info(`📚 API version: ${env.API_VERSION}`);
        logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

start();
