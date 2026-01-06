import { FastifyRequest, FastifyReply } from 'fastify';
import { projectsService } from './projects.service';
import { logger } from '../../utils/logger';

export class ProjectsController {
    /**
     * Create a new project
     * POST /projects
     */
    async createProject(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.userId!;
            const { name, description } = request.body as {
                name: string;
                description?: string;
            };

            // Validation
            if (!name || name.trim().length === 0) {
                return reply.status(400).send({
                    error: 'Project name is required',
                });
            }

            if (name.length > 100) {
                return reply.status(400).send({
                    error: 'Project name must be 100 characters or less',
                });
            }

            const project = await projectsService.createProject(userId, {
                name: name.trim(),
                description: description?.trim(),
            });

            logger.info(`Project created: ${project.id} by user ${userId}`);

            return reply.status(201).send(project);
        } catch (error: any) {
            logger.error('Create project error:', error);
            return reply.status(500).send({
                error: 'Failed to create project',
            });
        }
    }

    /**
     * Get all projects for the authenticated user
     * GET /projects
     */
    async getUserProjects(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.userId!;

            const projects = await projectsService.getUserProjects(userId);

            return reply.status(200).send({
                projects,
                count: projects.length,
            });
        } catch (error: any) {
            logger.error('Get projects error:', error);
            return reply.status(500).send({
                error: 'Failed to retrieve projects',
            });
        }
    }

    /**
     * Get a specific project by ID
     * GET /projects/:id
     */
    async getProjectById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.userId!;
            const { id } = request.params as { id: string };

            const project = await projectsService.getProjectById(id, userId);

            if (!project) {
                return reply.status(404).send({
                    error: 'Project not found',
                });
            }

            return reply.status(200).send(project);
        } catch (error: any) {
            logger.error('Get project error:', error);
            return reply.status(500).send({
                error: 'Failed to retrieve project',
            });
        }
    }

    /**
     * Update a project
     * PATCH /projects/:id
     */
    async updateProject(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.userId!;
            const { id } = request.params as { id: string };
            const { name, description } = request.body as {
                name?: string;
                description?: string;
            };

            // Validation
            if (name !== undefined) {
                if (name.trim().length === 0) {
                    return reply.status(400).send({
                        error: 'Project name cannot be empty',
                    });
                }

                if (name.length > 100) {
                    return reply.status(400).send({
                        error: 'Project name must be 100 characters or less',
                    });
                }
            }

            const project = await projectsService.updateProject(id, userId, {
                name: name?.trim(),
                description: description?.trim(),
            });

            if (!project) {
                return reply.status(404).send({
                    error: 'Project not found',
                });
            }

            logger.info(`Project updated: ${id} by user ${userId}`);

            return reply.status(200).send(project);
        } catch (error: any) {
            logger.error('Update project error:', error);
            return reply.status(500).send({
                error: 'Failed to update project',
            });
        }
    }

    /**
     * Delete a project
     * DELETE /projects/:id
     */
    async deleteProject(request: FastifyRequest, reply: FastifyReply) {
        try {
            const userId = request.userId!;
            const { id } = request.params as { id: string };

            const deleted = await projectsService.deleteProject(id, userId);

            if (!deleted) {
                return reply.status(404).send({
                    error: 'Project not found',
                });
            }

            logger.info(`Project deleted: ${id} by user ${userId}`);

            return reply.status(200).send({
                message: 'Project deleted successfully',
            });
        } catch (error: any) {
            logger.error('Delete project error:', error);
            return reply.status(500).send({
                error: 'Failed to delete project',
            });
        }
    }
}

export const projectsController = new ProjectsController();
