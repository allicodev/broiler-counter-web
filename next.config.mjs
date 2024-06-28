/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    DB_URL: process.env.DB_URL,
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
  },
};

export default nextConfig;
