module.exports = {
    apps: [
        {
            name: "corebase-api",
            cwd: "./apps/api",
            script: "dist/server.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
            }
        },
        {
            name: "corebase-web",
            cwd: "./apps/web",
            script: "npm",
            args: "start",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};
