import { randomBytes, createHash } from 'crypto';
import { query } from '../../database/query';
import { logger } from '../../utils/logger';

export interface CreateKeyInput {
    projectId: string;
    name: string;
}

export interface ApiKeyResponse {
    id: string;
    name: string;
    prefix: string;
    createdAt: Date;
    lastUsedAt: Date | null;
    key?: string; // Only returned on creation
}

export class ApiKeysService {
    /**
     * Create a new API key for a project
     */
    async createKey(input: CreateKeyInput): Promise<ApiKeyResponse> {
        const { projectId, name } = input;

        // Generate key: pk_live_<random_32_bytes_hex>
        const prefix = 'pk_live';
        const randomPart = randomBytes(24).toString('hex');
        const key = `${prefix}_${randomPart}`;

        // Hash key for storage
        const keyHash = createHash('sha256').update(key).digest('hex');

        const result = await query(
            `INSERT INTO api_keys (project_id, name, key_prefix, key_hash)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, key_prefix, created_at, last_used_at`,
            [projectId, name, prefix, keyHash]
        );

        const row = result.rows[0];

        return {
            id: row.id,
            name: row.name,
            prefix: row.key_prefix,
            createdAt: row.created_at,
            lastUsedAt: row.last_used_at,
            key: key, // Return full key only once
        };
    }

    /**
     * List active keys for a project
     */
    async listKeys(projectId: string): Promise<ApiKeyResponse[]> {
        const result = await query(
            `SELECT id, name, key_prefix, created_at, last_used_at
             FROM api_keys
             WHERE project_id = $1 AND revoked_at IS NULL
             ORDER BY created_at DESC`,
            [projectId]
        );

        return result.rows.map(row => ({
            id: row.id,
            name: row.name,
            prefix: row.key_prefix,
            createdAt: row.created_at,
            lastUsedAt: row.last_used_at,
        }));
    }

    /**
     * Revoke an API key
     */
    async revokeKey(keyId: string, projectId: string): Promise<boolean> {
        const result = await query(
            `UPDATE api_keys 
             SET revoked_at = NOW() 
             WHERE id = $1 AND project_id = $2 AND revoked_at IS NULL
             RETURNING id`,
            [keyId, projectId]
        );

        return result.rows.length > 0;
    }

    /**
     * Validate an API key and update usage stats
     * Used by middleware/authentication of request
     */
    async validateKey(key: string): Promise<{ projectId: string; keyId: string } | null> {
        const keyHash = createHash('sha256').update(key).digest('hex');

        const result = await query(
            `SELECT id, project_id 
             FROM api_keys 
             WHERE key_hash = $1 AND revoked_at IS NULL`,
            [keyHash]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const { id, project_id } = result.rows[0];

        // Update last_used_at asynchronously (fail-safe)
        query(
            'UPDATE api_keys SET last_used_at = NOW() WHERE id = $1',
            [id]
        ).catch(err => logger.error('Failed to update api key usage', err));

        return { projectId: project_id, keyId: id };
    }
}

export const apiKeysService = new ApiKeysService();
