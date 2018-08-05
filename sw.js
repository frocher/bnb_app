importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute(
  /\/@webcomponents\/webcomponentsjs\//,
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /\/images\/.*/,
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  /\/api\//,
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  /\/omniauth\//,
  workbox.strategies.networkOnly()
);

function handlePushEvent(event) {
  return Promise.resolve()
  .then(() => {
    return event.data.json();
  })
  .then((data) => {
    const title = data.title;
    const options = data.options;
    if (!options.icon) {
      options.icon = '/images/icon-512x512.png';
    }
    return registration.showNotification(title, options);
  })
  .catch((err) => {
    const title = 'Message Received from Botnbot';
    const options = {
      body: event.data.text(),
      icon: '/images/icon-512x512.png'
    };
    return registration.showNotification(title, options);
  });
}

self.addEventListener('push', function(event) {
  event.waitUntil(handlePushEvent(event));
});


workbox.precaching.precacheAndRoute([]);
