/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
    ],
  },
  // Optional - turn this off if you would like
  // https://nextjs.org/docs/app/api-reference/next-config-js/partial-prerendering
  experimental: {
    ppr: true,
  },
  webpack: (config, { dev }) => {
    // Add GLSL file support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader'],
    });

    // Add development-specific options
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300
      };
    }

    return config;
  },
};

module.exports = nextConfig;