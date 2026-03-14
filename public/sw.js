// In case this is still cached on any devices. Like it was still cached
// on my tablet.
// https://timomeh.de/posts/astray-service-worker
self.addEventListener('install', function (_e) {
  self.skipWaiting()
})

self.addEventListener('activate', function (_e) {
  self.registration
    .unregister()
    .then(function () {
      return self.clients.matchAll()
    })
    .then(function (clients) {
      clients.forEach((client) => client.navigate(client.url))
    })
})
