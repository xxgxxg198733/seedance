module.exports = {
  apps: [
    {
      name: "seedance",
      script: "node_modules/.bin/next",
      args: "start --port 3001",
      cwd: "/var/www/seedance",
      env: {
        NODE_ENV: "production",
        PORT: "3001",
      },
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "500M",
      autorestart: true,
      watch: false,
    },
  ],
};
