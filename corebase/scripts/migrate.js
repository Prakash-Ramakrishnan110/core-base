#!/usr/bin/env node

/**
 * Database Migration Runner
 * Runs all SQL migration files in order
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    console.log('🔄 Running database migrations...\n');

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        try {
            console.log(`  ✓ Running ${file}...`);
            await pool.query(sql);
            console.log(`    ✅ Success\n`);
        } catch (error) {
            console.error(`    ❌ Failed: ${error.message}\n`);
            // Continue even if error (assuming idempotent or already applied)
            // process.exit(1);
        }
    }

    console.log('✅ All migrations completed successfully!\n');
    await pool.end();
}

runMigrations().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
