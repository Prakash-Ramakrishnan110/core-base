import { query } from '../../database/query';
import { auditService } from '../audit/audit.service';

export interface CreateProjectInput {
    name: string;
    description?: string;
}

export interface UpdateProjectInput {
    name?: string;
    description?: string;
}

export interface ProjectResponse {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export class ProjectsService {
    /**
     * Create a new project
     */
    async createProject(userId: string, input: CreateProjectInput): Promise<ProjectResponse> {
        const { name, description } = input;

        const result = await query(
            `INSERT INTO projects (owner_id, name, description)
             VALUES ($1, $2, $3)
             RETURNING id, owner_id, name, description, created_at, updated_at`,
            [userId, name, description || null]
        );

        const project = result.rows[0];

        // Audit Log
        await auditService.logAction({
            userId,
            projectId: project.id,
            action: 'project.create',
            resourceType: 'project',
            resourceId: project.id,
            metadata: { name: project.name }
        });

        return {
            id: project.id,
            userId: project.owner_id,
            name: project.name,
            description: project.description,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        };
    }

    /**
     * Get all projects for a user
     */
    async getUserProjects(userId: string): Promise<ProjectResponse[]> {
        const result = await query(
            `SELECT id, owner_id, name, description, created_at, updated_at
             FROM projects
             WHERE owner_id = $1 AND deleted_at IS NULL
             ORDER BY created_at DESC`,
            [userId]
        );

        return result.rows.map(project => ({
            id: project.id,
            userId: project.owner_id,
            name: project.name,
            description: project.description,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        }));
    }

    /**
     * Get a specific project by ID
     */
    async getProjectById(projectId: string, userId: string): Promise<ProjectResponse | null> {
        const result = await query(
            `SELECT id, owner_id, name, description, created_at, updated_at
             FROM projects
             WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL`,
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const project = result.rows[0];

        return {
            id: project.id,
            userId: project.owner_id,
            name: project.name,
            description: project.description,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        };
    }

    /**
     * Update a project
     */
    async updateProject(
        projectId: string,
        userId: string,
        input: UpdateProjectInput
    ): Promise<ProjectResponse | null> {
        const { name, description } = input;

        // Build dynamic update query
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }

        if (description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(description);
        }

        if (updates.length === 0) {
            // No updates provided, just return current project
            return this.getProjectById(projectId, userId);
        }

        updates.push(`updated_at = NOW()`);
        values.push(projectId, userId);

        const result = await query(
            `UPDATE projects
             SET ${updates.join(', ')}
             WHERE id = $${paramCount++} AND owner_id = $${paramCount++} AND deleted_at IS NULL
             RETURNING id, owner_id, name, description, created_at, updated_at`,
            values
        );

        if (result.rows.length === 0) {
            return null;
        }

        const project = result.rows[0];

        return {
            id: project.id,
            userId: project.owner_id,
            name: project.name,
            description: project.description,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
        };
    }

    /**
     * Delete a project (soft delete)
     */
    async deleteProject(projectId: string, userId: string): Promise<boolean> {
        const result = await query(
            'UPDATE projects SET deleted_at = NOW() WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL RETURNING id',
            [projectId, userId]
        );

        return result.rows.length > 0;
    }

    /**
     * Check if user owns a project
     */
    async userOwnsProject(projectId: string, userId: string): Promise<boolean> {
        const result = await query(
            'SELECT id FROM projects WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL',
            [projectId, userId]
        );

        return result.rows.length > 0;
    }
}

export const projectsService = new ProjectsService();
