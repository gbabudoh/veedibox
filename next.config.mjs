/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: process.env.IMGPROXY_HOST || 'localhost' }
    ]
  }
};
export default nextConfig;
