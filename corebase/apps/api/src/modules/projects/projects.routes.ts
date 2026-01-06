import { FastifyInstance } from 'fastify';
import { projectsController } from './projects.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

export async function projectsRoutes(app: FastifyInstance) {
    // All project routes require authentication
    app.addHook('preHandler', authMiddleware);

    // Create project
    app.post('/', async (request, reply) => {
        return projectsController.createProject(request, reply);
    });

    // Get all user projects
    app.get('/', async (request, reply) => {
        return projectsController.getUserProjects(request, reply);
    });

    // Get specific project
    app.get('/:id', async (request, reply) => {
        return projectsController.getProjectById(request, reply);
    });

    // Update project
    app.patch('/:id', async (request, reply) => {
        return projectsController.updateProject(request, reply);
    });

    // Delete project
    app.delete('/:id', async (request, reply) => {
        return projectsController.deleteProject(request, reply);
    });
}
