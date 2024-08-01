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

//   webpack: (config) => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       'sharp$': false,
//       'onnxruntime-node$': false,
//     }
//     return config
//   },
// }
webpack: (config, { dev }) => {
  if (dev) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
  }
  return config
},
}

module.exports = nextConfig
