import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { db } from '../../db';
import { logger } from '../../utils/logger';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class StorageService {

    async createBucket(projectId: string, id: string, name: string, isPublic: boolean = false) {
        const bucketPath = path.join(UPLOAD_DIR, id);
        if (!fs.existsSync(bucketPath)) {
            fs.mkdirSync(bucketPath, { recursive: true });
        }

        const result = await db.query(
            `INSERT INTO storage.buckets (id, name, public, project_id) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [id, name, isPublic, projectId]
        );
        return result.rows[0];
    }

    async listBuckets(projectId: string) {
        const result = await db.query(
            `SELECT * FROM storage.buckets WHERE project_id = $1 ORDER BY created_at DESC`,
            [projectId]
        );
        return result.rows;
    }

    async getBucket(id: string) {
        const result = await db.query(`SELECT * FROM storage.buckets WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async uploadObject(bucketId: string, filename: string, fileStream: any, mimeType: string) {
        // Ensure bucket exists on disk
        const bucketPath = path.join(UPLOAD_DIR, bucketId);
        if (!fs.existsSync(bucketPath)) {
            fs.mkdirSync(bucketPath, { recursive: true });
        }

        const filePath = path.join(bucketPath, filename);

        // Save file to disk
        await pipeline(fileStream, fs.createWriteStream(filePath));
        const stats = fs.statSync(filePath);

        // Save metadata to DB
        const result = await db.query(
            `INSERT INTO storage.objects (bucket_id, name, size, mime_type)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [bucketId, filename, stats.size, mimeType]
        );
        return result.rows[0];
    }

    async listObjects(bucketId: string) {
        const result = await db.query(
            `SELECT * FROM storage.objects WHERE bucket_id = $1 ORDER BY created_at DESC`,
            [bucketId]
        );
        return result.rows;
    }

    getFilePath(bucketId: string, filename: string) {
        return path.join(UPLOAD_DIR, bucketId, filename);
    }
}

export const storageService = new StorageService();
