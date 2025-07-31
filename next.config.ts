import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Removed output: 'export' for Firebase App Hosting compatibility
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporarily disable ESLint for Firebase deployment
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Remove trailing slash for static export
  trailingSlash: false,
};

export default nextConfig;
