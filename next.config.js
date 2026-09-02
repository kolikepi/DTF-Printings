/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_OUTPUT_MODE, // 'standalone' për Docker
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Next-i i shërben vetë në WebP/AVIF, në përmasat që kërkon pajisja.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600],
  },
  webpack: (config) => {
    // Konva kërkon paketën native `canvas` vetëm në Node; designer-i ekzekutohet
    // gjithsesi vetëm në browser (ssr: false), ndaj e heqim nga bundle-i.
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
};

module.exports = nextConfig;
