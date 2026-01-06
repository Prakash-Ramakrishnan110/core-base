import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { query } from '../../database/query';
import { validateEnv } from '../../utils/env';
import { auditService } from '../audit/audit.service';

const env = validateEnv();

export interface RegisterInput {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    createdAt: Date;
}

export class AuthService {
    /**
     * Register a new user
     */
    async register(input: RegisterInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
        const { email, password, fullName } = input;

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, parseInt(env.BCRYPT_ROUNDS));

        // Create user
        const result = await query(
            `INSERT INTO users (email, password_hash, full_name)
             VALUES ($1, $2, $3)
             RETURNING id, email, full_name, created_at`,
            [email, passwordHash, fullName]
        );

        const user = result.rows[0];

        // Generate tokens
        const tokens = await this.generateTokens(user.id);

        // Audit Log
        await auditService.logAction({
            userId: user.id,
            action: 'auth.register',
            resourceType: 'user',
            resourceId: user.id,
            metadata: { email: user.email }
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                createdAt: user.created_at,
            },
            tokens,
        };
    }

    /**
     * Login user
     */
    async login(input: LoginInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
        const { email, password } = input;

        // Find user
        const result = await query(
            'SELECT id, email, password_hash, full_name, created_at FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            throw new Error('Invalid email or password');
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const tokens = await this.generateTokens(user.id);

        // Audit Log
        await auditService.logAction({
            userId: user.id,
            action: 'auth.login',
            resourceType: 'user',
            resourceId: user.id,
            metadata: { email: user.email }
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                createdAt: user.created_at,
            },
            tokens,
        };
    }

    // Helper to hash token
    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex');
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as { userId: string };
            const tokenHash = this.hashToken(refreshToken);

            // Check if refresh token exists in database and is not revoked
            const result = await query(
                `SELECT user_id FROM refresh_tokens 
                 WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
                [tokenHash]
            );

            if (result.rows.length === 0) {
                throw new Error('Invalid or expired refresh token');
            }

            // Revoke old refresh token (ROTATION)
            await query(
                'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1',
                [tokenHash]
            );

            // Generate new tokens
            return await this.generateTokens(decoded.userId);
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    /**
     * Logout user (revoke refresh token)
     */
    async logout(refreshToken: string): Promise<void> {
        const tokenHash = this.hashToken(refreshToken);
        await query(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1',
            [tokenHash]
        );
    }

    /**
     * Generate access and refresh tokens
     */
    private async generateTokens(userId: string): Promise<AuthTokens> {
        // Generate access token
        const accessToken = jwt.sign(
            { userId },
            env.JWT_SECRET as string,
            { expiresIn: env.JWT_ACCESS_EXPIRY }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            {
                userId,
                jti: createHash('md5').update(Math.random().toString()).digest('hex')
            },
            env.JWT_SECRET as string,
            { expiresIn: env.JWT_REFRESH_EXPIRY }
        );

        const tokenHash = this.hashToken(refreshToken);

        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
             VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    /**
     * Verify access token and return user ID
     */
    verifyAccessToken(token: string): string {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
            return decoded.userId;
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }
}

export const authService = new AuthService();
