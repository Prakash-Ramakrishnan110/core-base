import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    API_VERSION: z.string().default('v1'),

    DATABASE_URL: z.string().min(1),

    JWT_SECRET: z.string().min(32),
    JWT_ACCESS_EXPIRY: z.string().default('1h'),
    JWT_REFRESH_EXPIRY: z.string().default('7d'),

    BCRYPT_ROUNDS: z.string().default('12'),
    RATE_LIMIT_MAX: z.string().default('100'),
    RATE_LIMIT_WINDOW: z.string().default('60000'),

    CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(): Env {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        console.error('❌ Invalid environment variables:', error);
        process.exit(1);
    }
}
