/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a minimal, self-contained server bundle for Docker (.next/standalone).
  output: "standalone",
};

export default nextConfig;
