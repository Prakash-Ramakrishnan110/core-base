
const main = async () => {
    try {
        // 1. Register (ignore error if exists)
        const email = `test_${Date.now()}@example.com`;
        await fetch('http://localhost:4000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123', fullName: 'Test User' })
        }).catch(() => { });

        // 2. Login
        const loginRes = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: 'password123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.accessToken;

        if (!token) {
            console.log("LOGIN_FAILED", loginData);
            return;
        }

        console.log("LOGIN_SUCCESS");

        // 3. Create Project
        const projRes = await fetch('http://localhost:4000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: 'Test Project', description: 'Test' })
        });

        console.log("CREATE_STATUS", projRes.status);
        const projData = await projRes.json();
        console.log("CREATE_RESULT", projData);

    } catch (e) {
        console.error("SCRIPT_ERROR", e);
    }
};
main();
