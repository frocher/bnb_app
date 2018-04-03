module.exports = {
  navigateFallbackWhitelist: [/^\/nothing\//],
  staticFileGlobs: [
    'manifest.json',
    'bower_components/webcomponentsjs/*.js',
    'images/*'
  ],
  importScripts: [
    'push-handler.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/data\/images\/.*/,
      handler: 'cacheFirst',
      options: {
        cache: {
          maxEntries: 200,
          name: 'items-cache'
        }
      }
    },
    {
      urlPattern: /\/api\//,
      handler: 'networkFirst'
    },
    {
      urlPattern: /\/omniauth\//,
      handler: 'networkOnly'
    }
  ]
};
