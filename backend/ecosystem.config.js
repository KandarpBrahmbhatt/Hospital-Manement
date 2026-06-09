// PM2 Ecosystem Configuration
// This configuration provides three modes for starting the backend application:
// 1. "hospital-backend" (Fork Mode): Runs a single instance of the compiled main server.
// 2. "hospital-backend-cluster" (PM2 Native Cluster Mode): Automatically scales across all CPU cores utilizing PM2's native cluster engine.
// 3. "hospital-backend-custom-cluster" (Node Custom Cluster Mode): Runs the custom Node.js clustering script.

module.exports = {
  apps: [
    {
      name: "hospital-backend",
      script: "./dist/backend.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "hospital-backend-cluster",
      script: "./dist/backend.js",
      instances: "max", // Scale across all available CPU cores
      exec_mode: "cluster", // Let PM2 handle the cluster load balancing natively
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "hospital-backend-custom-cluster",
      script: "./dist/cluster/cluster.js",
      instances: 1, // Only 1 primary process under PM2, which then forks workers using Node's native cluster module
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};
