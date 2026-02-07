/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.glose.com",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
  },
};

module.exports = nextConfig;
