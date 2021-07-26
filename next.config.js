module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  devIndicators: {
    autoPrerender: false,
  },
  images: {
    domains: ['icons.iconarchive.com', 'firebasestorage.googleapis.com'],
  },
  //target: 'serverless'
  // Supported targets are "serverless" and "experimental-serverless-trace"
  //target: "experimental-serverless-trace"
}
