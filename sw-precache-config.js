module.exports = {
  staticFileGlobs: [
    '/manifest.json',
    '/bower_components/webcomponentsjs/*.js',
    '/images/*'
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
    }
  ]
};
