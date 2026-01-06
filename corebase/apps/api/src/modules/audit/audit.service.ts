import { query } from '../../database/query';
import { logger } from '../../utils/logger';

export interface LogActionInput {
    userId?: string;
    projectId?: string;
    action: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: any;
    ipAddress?: string;
}

export interface AuditLogResponse {
    id: string;
    userId: string | null;
    projectId: string | null;
    action: string;
    resourceType: string | null;
    resourceId: string | null;
    metadata: any;
    ipAddress: string | null;
    createdAt: Date;
    userEmail?: string; // Enhanced with join
}

export class AuditService {

    async logAction(input: LogActionInput): Promise<void> {
        try {
            await query(
                `INSERT INTO audit_logs (
                    user_id, project_id, action, resource_type, resource_id, metadata, ip_address
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    input.userId || null,
                    input.projectId || null,
                    input.action,
                    input.resourceType || null,
                    input.resourceId || null,
                    JSON.stringify(input.metadata || {}),
                    input.ipAddress || null
                ]
            );
        } catch (error) {
            // Audit logging should verify fail-safe? 
            // We usually don't want to block the main action if logging fails, 
            // but for high security, maybe we do.
            // For now, let's log the error and not throw to avoid disrupting user flow.
            logger.error('Failed to write audit log', error);
        }
    }

    async listLogs(projectId: string, limit = 50, offset = 0): Promise<AuditLogResponse[]> {
        const result = await query(
            `SELECT a.*, u.email as user_email
             FROM audit_logs a
             LEFT JOIN users u ON a.user_id = u.id
             WHERE a.project_id = $1
             ORDER BY a.created_at DESC
             LIMIT $2 OFFSET $3`,
            [projectId, limit, offset]
        );

        return result.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            projectId: row.project_id,
            action: row.action,
            resourceType: row.resource_type,
            resourceId: row.resource_id,
            metadata: row.metadata,
            ipAddress: row.ip_address,
            createdAt: row.created_at,
            userEmail: row.user_email
        }));
    }
}

export const auditService = new AuditService();
