import { Pool, PoolConfig } from 'pg';
import { logger } from '../utils/logger';

const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
    logger.error('Unexpected database error', err);
    process.exit(-1);
});

pool.on('connect', () => {
    logger.info('New database connection established');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, closing database pool');
    await pool.end();
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, closing database pool');
    await pool.end();
});
