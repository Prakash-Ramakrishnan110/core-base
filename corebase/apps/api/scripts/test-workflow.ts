// Built-in fetch in Node 20+

const API_URL = 'http://localhost:3000';
let access_token = '';
let project_id = '';
let api_key_id = '';
let table_name = '';
let record_id = '';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runStep(name: string, fn: () => Promise<void>) {
    process.stdout.write(`Testing ${name}... `);
    try {
        await fn();
        console.log('✅ OK');
    } catch (e: any) {
        console.log('❌ FAILED');
        console.error(e.message);
        process.exit(1);
    }
}

async function main() {
    console.log('🚀 Starting CoreBase API Tests...\n');

    // 1. Health Check
    await runStep('Health Check', async () => {
        const res = await fetch(`${API_URL}/health`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (data.status !== 'healthy') throw new Error('API not healthy');
    });

    const email = `test.${Date.now()}@example.com`;
    const password = 'password123';

    // 2. Register
    await runStep('User Registration', async () => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                fullName: 'Test User'
            })
        });

        if (!res.ok) {
            const err: any = await res.json();
            throw new Error(err.error || `Status ${res.status}`);
        }

        const data: any = await res.json();
        access_token = data.accessToken;
        if (!access_token) throw new Error('No access token returned');
    });

    // 3. Login (verify credentials work)
    await runStep('User Login', async () => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (!data.accessToken) throw new Error('No access token on login');
        // Refresh our token just in case
        access_token = data.accessToken;
    });

    // 4. Create Project
    await runStep('Create Project', async () => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                name: 'Automated Test Project',
                description: 'Created by test script'
            })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        project_id = data.id;
        if (!project_id) throw new Error('No project ID returned');
    });

    // 5. List Projects
    await runStep('List Projects', async () => {
        const res = await fetch(`${API_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (!Array.isArray(data.projects)) throw new Error('Projects not an array');
        const found = data.projects.find((p: any) => p.id === project_id);
        if (!found) throw new Error('Created project not found in list');
    });

    // 6. Update Project
    await runStep('Update Project', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({ name: 'Updated Project Name' })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (data.name !== 'Updated Project Name') throw new Error('Name not updated');
    });

    // 7. API Keys
    await runStep('Create API Key', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({ name: 'Test Key' })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (!data.key.startsWith('pk_live_')) throw new Error('Invalid key prefix');
        if (!data.id) throw new Error('No key ID returned');
        api_key_id = data.id;
    });

    await runStep('List API Keys', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/keys`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        const key = data.keys.find((k: any) => k.id === api_key_id);
        if (!key) throw new Error('Created key not found');
        if (key.key) throw new Error('Full key should not be returned in list');
    });

    await runStep('Revoke API Key', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/keys/${api_key_id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
    });







    // 10. Dynamic Tables
    await runStep('Create Table', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/tables`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                tableName: 'posts',
                displayName: 'Blog Posts',
                columns: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'content', type: 'text' },
                    { name: 'published', type: 'boolean' },
                    { name: 'views', type: 'number' }
                ]
            })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (data.tableName !== 'posts') throw new Error('Table name mismatch');
        table_name = data.tableName;
    });

    // 11. Records
    await runStep('Create Record', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/tables/${table_name}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                title: 'Hello World',
                content: 'This is my first post',
                published: true,
                views: 1
            })
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        if (data.title !== 'Hello World') throw new Error('Attribute mismatch');
        if (!data.id) throw new Error('No record ID returned');
        record_id = data.id;
    });

    await runStep('List Records', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/tables/${table_name}/records`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();
        const record = data.records.find((r: any) => r.id === record_id);
        if (!record) throw new Error('Created record not found');
        if (record.title !== 'Hello World') throw new Error('Data mismatch in list');
    });

    // 12. Cleanup Table (and Records)
    await runStep('Delete Table', async () => {
        // Need to get table ID first since endpoint uses tableId
        const listRes = await fetch(`${API_URL}/projects/${project_id}/tables`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });
        const listData: any = await listRes.json();
        const table = listData.tables.find((t: any) => t.tableName === table_name);

        const res = await fetch(`${API_URL}/projects/${project_id}/tables/${table.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
    });

    // 13. Audit Logs Verification
    await runStep('Verify Audit Logs', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}/audit-logs`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: any = await res.json();

        if (!data.logs || !Array.isArray(data.logs)) throw new Error('Logs not found');

        // Should find 'project.create'
        const createLog = data.logs.find((l: any) => l.action === 'project.create');
        if (!createLog) throw new Error('project.create log not found');
    });

    // 14. Delete Project
    await runStep('Delete Project', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
    });

    // 14. Verify Deletion
    await runStep('Verify Deletion', async () => {
        const res = await fetch(`${API_URL}/projects/${project_id}`, {
            headers: { 'Authorization': `Bearer ${access_token}` }
        });

        if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
    });

    console.log('\n✨ All tests passed successfully!');
}

main().catch(console.error);
