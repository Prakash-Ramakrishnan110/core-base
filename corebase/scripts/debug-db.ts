import { Pool } from 'pg';
import { config } from 'dotenv';
import path from 'path';

// Load .env same way as server
const envPath = path.resolve(__dirname, '../.env');
console.log('Loading .env from:', envPath);
config({ path: envPath });

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 5000,
});

async function test() {
    try {
        console.log('Connecting...');
        const client = await pool.connect();
        console.log('Connected!');
        const res = await client.query('SELECT 1');
        console.log('Result:', res.rows[0]);
        client.release();
        await pool.end();
    } catch (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }
}

test();
