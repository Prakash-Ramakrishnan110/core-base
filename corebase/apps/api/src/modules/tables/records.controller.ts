import { FastifyRequest, FastifyReply } from 'fastify';
import { recordsService } from './records.service';
import { projectsService } from '../projects/projects.service';

export class RecordsController {

    async createRecord(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, tableName } = request.params as { projectId: string; tableName: string };
        const data = request.body as any;

        // Check project access
        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        try {
            const record = await recordsService.createRecord(projectId, tableName, data, userId);
            return reply.status(201).send(record);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            throw error;
        }
    }

    async listRecords(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, tableName } = request.params as { projectId: string; tableName: string };
        const { limit, offset } = request.query as { limit?: string; offset?: string };

        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        try {
            const records = await recordsService.listRecords(
                projectId,
                tableName,
                limit ? parseInt(limit) : 100,
                offset ? parseInt(offset) : 0
            );
            return reply.send({ records });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            throw error;
        }
    }

    async getRecord(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, tableName, recordId } = request.params as { projectId: string; tableName: string; recordId: string };

        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        try {
            const record = await recordsService.getRecord(projectId, tableName, recordId);
            if (!record) return reply.status(404).send({ error: 'Record not found' });
            return reply.send(record);
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            throw error;
        }
    }

    async deleteRecord(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, tableName, recordId } = request.params as { projectId: string; tableName: string; recordId: string };

        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) return reply.status(404).send({ error: 'Project not found' });

        try {
            const deleted = await recordsService.deleteRecord(projectId, tableName, recordId);
            if (!deleted) return reply.status(404).send({ error: 'Record not found' });
            return reply.status(204).send();
        } catch (error: any) {
            if (error.message.includes('not found')) {
                return reply.status(404).send({ error: error.message });
            }
            throw error;
        }
    }
}

export const recordsController = new RecordsController();
