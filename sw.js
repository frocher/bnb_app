/* global importScripts */
/* global registration */
/* global workbox */
/* eslint no-restricted-globals: ["off", "self"] */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute(
  /.*\.js/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'js-cache',
  }),
);

workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'image-cache',
  }),
);

workbox.routing.registerRoute(
  /\/api\//,
  workbox.strategies.networkFirst({
    cacheName: 'api-cache',
  }),
);

workbox.routing.registerRoute(
  /\/omniauth\//,
  workbox.strategies.networkOnly(),
);

function handlePushEvent(event) {
  return Promise.resolve()
    .then(() => event.data.json())
    .then((data) => {
      const { options } = data;
      if (!options.icon) {
        options.icon = '/images/icon-512x512.png';
      }
      return registration.showNotification(data.title, options);
    })
    .catch(() => {
      const title = 'Message Received from Botnbot';
      const options = {
        body: event.data.text(),
        icon: '/images/icon-512x512.png',
      };
      return registration.showNotification(title, options);
    });
}

self.addEventListener('push', (event) => {
  event.waitUntil(handlePushEvent(event));
});


workbox.precaching.precacheAndRoute([]);
