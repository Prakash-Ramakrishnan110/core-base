import { FastifyReply, FastifyRequest } from 'fastify';
import { sqlService } from './sql.service';

export class SqlController {
    async execute(req: FastifyRequest, reply: FastifyReply) {
        const { projectId } = req.params as any;
        const { query } = req.body as any;

        if (!query || !query.trim()) {
            return reply.status(400).send({ error: "Query cannot be empty" });
        }

        try {
            const result = await sqlService.executeQuery(projectId, query);
            return reply.send(result);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }
}

export const sqlController = new SqlController();
