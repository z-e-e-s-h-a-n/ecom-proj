/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ["loremflickr.com", "picsum.photos"],
  },
};

export default nextConfig;
