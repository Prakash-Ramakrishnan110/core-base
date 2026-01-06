import { pool } from './pool';
import { logger } from '../utils/logger';

export async function query(text: string, params?: any[]) {
    const start = Date.now();

    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;

        logger.debug({
            query: text,
            duration,
            rows: res.rowCount,
        }, 'Query executed');

        return res;
    } catch (error) {
        logger.error({
            query: text,
            params,
            error,
        }, 'Query failed');
        throw error;
    }
}

export async function getClient() {
    return pool.connect();
}

export async function transaction<T>(
    callback: (client: any) => Promise<T>
): Promise<T> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}
