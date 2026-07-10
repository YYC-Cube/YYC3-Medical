/// <reference lib="webworker" />
// Service Worker for offline functionality
// 使用 SW 类型断言绕过 DOM lib 的 self 类型冲突
const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'yanyu-cloud-v1';
const STATIC_CACHE = 'yanyu-static-v1';
const DYNAMIC_CACHE = 'yanyu-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/offline',
  '/images/yanyu-cloud-logo.png',
  '/manifest.json',
  // Add critical CSS and JS files
];

// API endpoints to cache
const API_CACHE_PATTERNS = [/^\/api\/auth\//, /^\/api\/patients\//, /^\/api\/diagnoses\//];

sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(STATIC_FILES);
      }),
      sw.skipWaiting(),
    ])
  );
});

sw.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      sw.clients.claim(),
    ])
  );
});

sw.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful navigation responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache or offline page
          return caches.match(request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return offline page for navigation requests
            return caches.match('/offline') as Promise<Response>;
          });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache for GET requests
          if (request.method === 'GET') {
            return caches.match(request) as Promise<Response>;
          }
          // Return error response for non-GET requests
          return new Response(
            JSON.stringify({
              error: 'Network unavailable',
              offline: true,
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(response => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Handle background sync for offline actions
sw.addEventListener('sync', ((event: ExtendableEvent & { tag: string }) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Process queued offline actions
      processOfflineActions()
    );
  }
}) as EventListener);

async function processOfflineActions() {
  // Implementation for processing offline actions
  // This would sync with IndexedDB and send queued requests

  console.debug('[sw] Processing offline actions...');
}

// Handle push notifications
sw.addEventListener('push', (event: PushEvent) => {
  if (event.data) {
    const data = event.data.json() as {
      title: string;
      body: string;
      data?: unknown;
      actions?: unknown[];
    };

    event.waitUntil(
      sw.registration.showNotification(data.title, {
        body: data.body,
        icon: '/images/yanyu-cloud-logo.png',
        badge: '/images/yanyu-cloud-logo.png',
        data: data.data,
      } as NotificationOptions) as Promise<unknown> as Promise<void>
    );
  }
});

// Handle notification clicks
sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  if (event.action) {
    // Handle action button clicks
    handleNotificationAction(event.action, event.notification.data);
  } else {
    // Handle notification click
    event.waitUntil(
      sw.clients.openWindow(
        (event.notification.data as { url?: string })?.url || '/'
      ) as Promise<unknown> as Promise<void>
    );
  }
});

function handleNotificationAction(action: string, data: { url?: string } | undefined) {
  switch (action) {
    case 'view':
      sw.clients.openWindow(data?.url || '/');
      break;
    case 'dismiss':
      // Just close the notification
      break;
    default:
      sw.clients.openWindow('/');
  }
}
