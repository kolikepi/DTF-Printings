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
  images: { unoptimized: true },
  webpack: (config) => {
    // Konva kërkon paketën native `canvas` vetëm në Node; designer-i ekzekutohet
    // gjithsesi vetëm në browser (ssr: false), ndaj e heqim nga bundle-i.
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
};

module.exports = nextConfig;
