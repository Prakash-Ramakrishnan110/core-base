import { FastifyReply, FastifyRequest } from 'fastify';
import { storageService } from './storage.service';
import fs from 'fs';

export class StorageController {

    async createBucket(req: FastifyRequest, reply: FastifyReply) {
        const { projectId } = req.params as any;
        const { id, name, public: isPublic } = req.body as any;

        // Basic validation
        if (!/^[a-z0-9-_]+$/.test(id)) {
            return reply.status(400).send({ error: "Bucket ID must be lowercase alphanumeric, hyphens, or underscores" });
        }

        try {
            const bucket = await storageService.createBucket(projectId, id, name, isPublic);
            return reply.send(bucket);
        } catch (err: any) {
            if (err.code === '23505') { // Unique violation
                return reply.status(409).send({ error: "Bucket ID already exists" });
            }
            throw err;
        }
    }

    async listBuckets(req: FastifyRequest, reply: FastifyReply) {
        const { projectId } = req.params as any;
        const buckets = await storageService.listBuckets(projectId);
        return reply.send(buckets);
    }

    async uploadObject(req: FastifyRequest, reply: FastifyReply) {
        const { bucketId } = req.params as any;
        const data = await req.file();

        if (!data) {
            return reply.status(400).send({ error: "No file uploaded" });
        }

        try {
            const object = await storageService.uploadObject(bucketId, data.filename, data.file, data.mimetype);
            return reply.send(object);
        } catch (err) {
            throw err;
        }
    }

    async listObjects(req: FastifyRequest, reply: FastifyReply) {
        const { bucketId } = req.params as any;
        const objects = await storageService.listObjects(bucketId);
        return reply.send(objects);
    }

    async getObject(req: FastifyRequest, reply: FastifyReply) {
        const { bucketId, filename } = req.params as any;
        const filePath = storageService.getFilePath(bucketId, filename);

        if (!fs.existsSync(filePath)) {
            return reply.status(404).send({ error: "File not found" });
        }

        const stream = fs.createReadStream(filePath);
        // Basic mime type guessing could be improved, but for now let browser handle it or DB lookup
        // We could look up DB to get mimetype if we wanted to set Content-Type header properly

        return reply.send(stream);
    }
}

export const storageController = new StorageController();
