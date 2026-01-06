import { FastifyRequest, FastifyReply } from 'fastify';
import { aiService } from './ai.service';
import { logger } from '../../utils/logger';

export class AiController {
    /**
     * Chat endpoint
     * POST /ai/chat
     */
    async chat(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.userId!;
            const { message, projectId } = request.body as { message: string, projectId?: string };

            if (!message) {
                return reply.status(400).send({ error: 'Message is required' });
            }

            const response = await aiService.chat(message, { userId, projectId });

            return reply.send({ response });
        } catch (error: any) {
            logger.error('AI Chat error:', error);
            return reply.status(500).send({
                error: 'Failed to process AI request'
            });
        }
    }
}

export const aiController = new AiController();
