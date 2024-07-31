/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional - turn this off if you would like
  // https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering
  experimental: {
    ppr: true,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'sharp$': false,
      'onnxruntime-node$': false,
    }
    return config
  },
}

module.exports = nextConfig
