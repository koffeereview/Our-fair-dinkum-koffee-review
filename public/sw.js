const CACHE_NAME = 'koffee-review-v2';
const STATIC_ASSETS = [
  '/',
  '/logo.webp',
  '/logo.jpg',
  '/manifest.json',
  '/maplatte.webp',
  '/sticker.png'
];

// Install — cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch — network first for API/HTML, cache first for static assets
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests (Google Sheets, analytics, etc)
  if (url.origin !== self.location.origin) return;
  
  // STATIC ASSETS — cache first, fallback to network
  if (url.pathname.match(/\.(webp|jpg|jpeg|png|svg|gif|css|js|woff|woff2|ttf)$/) || 
      url.pathname === '/manifest.json') {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }
  
  // HTML PAGES (review, suburb, city, leaderboard, etc) — network first, cache fallback
  if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          if (cached) return cached;
          // Offline fallback — return cached homepage
          return caches.match('/');
        });
      })
    );
    return;
  }
  
  // Everything else — network first
  event.respondWith(
    fetch(event.request).then(function(response) {
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
