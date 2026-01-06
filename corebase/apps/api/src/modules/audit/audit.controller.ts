import { FastifyRequest, FastifyReply } from 'fastify';
import { auditService } from './audit.service';
import { projectsService } from '../projects/projects.service';

export class AuditController {

    async listLogs(request: FastifyRequest, reply: FastifyReply) {
        const userId = request.userId!;
        const { projectId } = request.params as { projectId: string };
        const { limit, offset } = request.query as { limit?: string; offset?: string };

        // Check access
        const project = await projectsService.getProjectById(projectId, userId);
        if (!project) {
            return reply.status(404).send({ error: 'Project not found' });
        }

        const logs = await auditService.listLogs(
            projectId,
            limit ? parseInt(limit) : 50,
            offset ? parseInt(offset) : 0
        );

        return reply.send({ logs });
    }
}

export const auditController = new AuditController();
