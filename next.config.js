//const withPlugins = require('next-compose-plugins');
const withPWA = require('next-pwa')
// const withFonts = require('next-fonts');
const runtimeCaching = require("next-pwa/cache");

module.exports = withPWA({
    // swcMinify: true,
    pwa: {
        runtimeCaching,
        buildExcludes: [/middleware-manifest\.json$/, /middleware-manifest/],
        dest: "public",
        register: true,
        skipWaiting: true,

    },
    modifyURLPrefix: {
        '../public': ''
    },
    cacheWillUpdate: true,
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
});
