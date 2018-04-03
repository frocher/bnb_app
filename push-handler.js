
function handlePushEvent(event) {
  return Promise.resolve()
  .then(() => {
    return event.data.json();
  })
  .then((data) => {
    const title = data.title;
    const options = data.options;
    return registration.showNotification(title, options);
  })
  .catch((err) => {
    const title = 'Message Received from Botnbot';
    const options = {
      body: event.data.text(),
      icon: '/images/icon-128x128.png'
    };
    return registration.showNotification(title, options);
  });
}

self.addEventListener('push', function(event) {
  event.waitUntil(handlePushEvent(event));
});
