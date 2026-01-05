import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { apiKeysService } from './api-keys.service';
import { projectsService } from '../projects/projects.service';

const createKeySchema = z.object({
    name: z.string().min(1).max(50),
});

export class ApiKeysController {
    async createKey(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId } = request.params as { projectId: string };

        // Verify project ownership
        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) {
            return reply.status(404).send({ error: 'Project not found' });
        }

        const body = createKeySchema.parse(request.body);

        const key = await apiKeysService.createKey({
            projectId,
            name: body.name,
        });

        return reply.status(201).send(key);
    }

    async listKeys(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId } = request.params as { projectId: string };

        // Verify project ownership
        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) {
            return reply.status(404).send({ error: 'Project not found' });
        }

        const keys = await apiKeysService.listKeys(projectId);
        return reply.send({ keys });
    }

    async revokeKey(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId, keyId } = request.params as { projectId: string; keyId: string };

        // Verify project ownership
        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) {
            return reply.status(404).send({ error: 'Project not found' });
        }

        const revoked = await apiKeysService.revokeKey(keyId, projectId);
        if (!revoked) {
            return reply.status(404).send({ error: 'Key not found' });
        }

        return reply.status(204).send();
    }
}

export const apiKeysController = new ApiKeysController();
