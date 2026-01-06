import { query } from '../../database/query';
import { UserResponse } from '../auth/auth.service';

export class UsersService {
    // List all users (Admin view)
    async listUsers(): Promise<UserResponse[]> {
        const result = await query(
            'SELECT id, email, full_name, created_at FROM users ORDER BY created_at DESC'
        );

        return result.rows.map(row => ({
            id: row.id,
            email: row.email,
            fullName: row.full_name,
            createdAt: row.created_at
        }));
    }

    // Delete user (Admin action)
    async deleteUser(id: string): Promise<void> {
        await query('DELETE FROM users WHERE id = $1', [id]);
    }
}

export const usersService = new UsersService();
