import { FastifyInstance } from 'fastify';
import { storageController } from './storage.controller';
import { authMiddleware } from '../../middleware/auth';

export async function storageRoutes(server: FastifyInstance) {
    // Buckets Management
    server.post('/projects/:projectId/storage/buckets', { preHandler: [authMiddleware] }, storageController.createBucket);
    server.get('/projects/:projectId/storage/buckets', { preHandler: [authMiddleware] }, storageController.listBuckets);

    // File Operations
    server.post('/storage/buckets/:bucketId/upload', { preHandler: [authMiddleware] }, storageController.uploadObject);
    server.get('/storage/buckets/:bucketId/objects', { preHandler: [authMiddleware] }, storageController.listObjects);

    // Serve File (Public Access for now)
    server.get('/storage/file/:bucketId/:filename', storageController.getObject);
}
