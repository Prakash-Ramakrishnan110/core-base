import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { tablesService } from './tables.service';
import { projectsService } from '../projects/projects.service';

const createTableSchema = z.object({
    tableName: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric and underscores allowed'),
    displayName: z.string().optional(),
    columns: z.array(z.object({
        name: z.string().min(1),
        type: z.enum(['text', 'number', 'boolean', 'timestamp']),
        required: z.boolean().optional(),
        unique: z.boolean().optional()
    })).min(1)
});

export class TablesController {
    async createTable(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId } = request.params as { projectId: string };

        // Check project access
        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        const body = createTableSchema.parse(request.body);

        // Check if table name already exists
        const existing = await tablesService.getTable(projectId, body.tableName);
        if (existing) {
            return reply.status(409).send({ error: 'Table with this name already exists' });
        }

        const table = await tablesService.createTable({
            projectId,
            ...body
        });

        return reply.status(201).send(table);
    }

    async listTables(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId } = request.params as { projectId: string };

        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        const tables = await tablesService.listTables(projectId);
        return reply.send({ tables });
    }

    async getTable(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, tableId } = request.params as { projectId: string; tableId: string };

        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        const table = await tablesService.getTable(projectId, tableId);
        if (!table) return reply.status(404).send({ error: 'Table not found' });

        return reply.send(table);
    }

    async deleteTable(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, tableId } = request.params as { projectId: string; tableId: string };

        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        const deleted = await tablesService.deleteTable(projectId, tableId);
        if (!deleted) return reply.status(404).send({ error: 'Table not found' });

        return reply.status(204).send();
    }
}

export const tablesController = new TablesController();
