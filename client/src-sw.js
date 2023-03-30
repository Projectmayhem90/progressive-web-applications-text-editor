const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Register route, with method to expire after so many secs.
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);

// Save the user input text to the cache
self.addEventListener('submit', (event) => {
  event.respondWith(
    caches.open('user-input-cache')
      .then((cache) => {
        const formData = new FormData(event.target);
        cache.put('/user-input', new Response(formData.get('user-input')));
        return new Response('Text saved to cache');
      })
  );
});

// Retrieve the user input text from the cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('/user-input')) {
    event.respondWith(
      caches.open('user-input-cache')
        .then((cache) => {
          return cache.match('/user-input')
            .then((response) => {
              return response || new Response('');
            });
        })
    );
  }
});