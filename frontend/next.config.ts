import type { NextConfig } from "next";

const wpHostname = process.env.WORDPRESS_HOSTNAME;
const wpProtocol = (process.env.WORDPRESS_PROTOCOL as "http" | "https") || "https";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wpHostname
      ? [{ protocol: wpProtocol, hostname: wpHostname }]
      : [
          { protocol: "https", hostname: "**.wordpress.com" },
          { protocol: "http", hostname: "localhost" },
          { protocol: "http", hostname: "127.0.0.1" },
        ],
  },
};

export default nextConfig;
