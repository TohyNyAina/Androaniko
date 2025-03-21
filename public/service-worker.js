
const CACHE_NAME = 'wardrobe-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/top.svg',
  '/images/bottom.svg',
  '/images/outerwear.svg',
  '/images/footwear.svg',
  '/images/accessory.svg',
  '/images/cold-weather.svg',
  '/images/mild-weather.svg',
  '/images/hot-weather.svg',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/maskable-icon.png'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
  // Force le nouveau service worker à devenir actif immédiatement
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Permet au service worker de contrôler toutes les pages immédiatement
  self.clients.claim();
});

// Stratégie de cache : network first, puis fallback sur le cache
self.addEventListener('fetch', (event) => {
  // Exclure les appels API
  if (event.request.url.includes('api.weatherapi.com') || 
      event.request.url.includes('api-adresse.data.gouv.fr')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la requête réussit, on met en cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si la requête échoue, on utilise le cache
        return caches.match(event.request);
      })
  );
});

// Gestion des notifications push (pour future utilisation)
self.addEventListener('push', (event) => {
  const title = 'Météo Garde-Robe';
  const options = {
    body: event.data.text(),
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
