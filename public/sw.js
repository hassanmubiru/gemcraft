// Service Worker for GemCraft PWA
const CACHE_NAME = 'gemcraft-v1.0.0';
const STATIC_CACHE_NAME = 'gemcraft-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'gemcraft-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-1024.png',
  // Add other static assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.gemcraft\.com\//,
  /^https:\/\/alfajores-forno\.celo-testnet\.org\//,
  /^https:\/\/explorer\.celo\.org\//,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticFile(request)) {
    // Static files - cache first strategy
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    // API requests - network first strategy
    event.respondWith(networkFirst(request));
  } else if (isHTMLRequest(request)) {
    // HTML requests - network first with fallback
    event.respondWith(networkFirstWithFallback(request));
  } else {
    // Other requests - network first
    event.respondWith(networkFirst(request));
  }
});

// Cache first strategy for static files
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Offline - Resource not available', { status: 503 });
  }
}

// Network first strategy for API requests
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline - API not available', { status: 503 });
  }
}

// Network first with fallback for HTML requests
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to index.html for SPA routing
    if (request.destination === 'document') {
      const indexResponse = await caches.match('/');
      if (indexResponse) {
        return indexResponse;
      }
    }
    
    return new Response('Offline - Page not available', { status: 503 });
  }
}

// Helper functions
function isStaticFile(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.href));
}

function isHTMLRequest(request) {
  return request.destination === 'document' || 
         request.headers.get('accept')?.includes('text/html');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'claim-rewards') {
    event.waitUntil(handleClaimRewards());
  } else if (event.tag === 'submit-score') {
    event.waitUntil(handleSubmitScore());
  }
});

// Handle claim rewards in background
async function handleClaimRewards() {
  try {
    // Get pending rewards from IndexedDB
    const pendingRewards = await getPendingRewards();
    
    for (const reward of pendingRewards) {
      try {
        const response = await fetch('/api/claim-reward', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reward),
        });
        
        if (response.ok) {
          await removePendingReward(reward.id);
          console.log('Reward claimed successfully:', reward.id);
        }
      } catch (error) {
        console.error('Failed to claim reward:', reward.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync for rewards failed:', error);
  }
}

// Handle submit score in background
async function handleSubmitScore() {
  try {
    // Get pending scores from IndexedDB
    const pendingScores = await getPendingScores();
    
    for (const score of pendingScores) {
      try {
        const response = await fetch('/api/submit-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(score),
        });
        
        if (response.ok) {
          await removePendingScore(score.id);
          console.log('Score submitted successfully:', score.id);
        }
      } catch (error) {
        console.error('Failed to submit score:', score.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync for scores failed:', error);
  }
}

// IndexedDB helpers (simplified)
async function getPendingRewards() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function removePendingReward(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending reward:', id);
}

async function getPendingScores() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function removePendingScore(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending score:', id);
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from GemCraft',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Play Now',
        icon: '/icon-192.png',
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('GemCraft', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
