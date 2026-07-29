/**
 * Hosts the image optimizer may fetch from.
 *
 * Blog covers and in-post images come from the API (local disk in dev) or from
 * Google Cloud Storage in production, so both have to be allowlisted. Derived
 * from env rather than hardcoded so the deployed API host can't drift out of
 * this list.
 */
function buildRemotePatterns() {
  const patterns = [
    // Local development API.
    {
      protocol: "http",
      hostname: "localhost",
      port: "8000",
      pathname: "/media/**",
    },
    // Media served straight from the GCS bucket.
    {
      protocol: "https",
      hostname: "storage.googleapis.com",
      port: "",
      pathname: "/**",
    },
  ];

  const apiOrigin = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (apiOrigin) {
    try {
      const { protocol, hostname, port } = new URL(apiOrigin);
      patterns.push({
        protocol: protocol.replace(":", "") === "http" ? "http" : "https",
        hostname,
        port,
        pathname: "/media/**",
      });
    } catch {
      // A malformed URL must not break the build.
    }
  }

  return patterns;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit a minimal, self-contained server bundle for Docker (.next/standalone).
  output: "standalone",
  images: {
    remotePatterns: buildRemotePatterns(),
    // Next 16 rejects images from local IPs before remotePatterns is even
    // consulted, so a dev API on localhost:8000 fails with "url parameter is
    // not allowed". Development only — in production this would be an SSRF
    // hole, and the deployed API is a public HTTPS host that doesn't need it.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
