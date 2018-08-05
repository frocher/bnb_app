module.exports = {
  staticFileGlobs: [
    'manifest.json',
    'images/*',
    'src/**/*',
  ],
  importScripts: [
    'push-handler.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest'
    },
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
