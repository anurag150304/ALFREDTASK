const CACHE_NAME = 'flashcard-app-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/static/js/main.js',
    '/static/css/main.css',
    '/manifest.json',
    '/favicon.ico'
];

const API_CACHE_NAME = 'flashcard-api-v1';
const API_ROUTES = [
    '/api/flashcards',
    '/api/decks',
    '/api/achievements'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            }),
            // Cache API responses
            caches.open(API_CACHE_NAME)
        ])
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Remove old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            }),
            // Claim clients
            self.clients.claim()
        ])
    );
});

// Fetch Event Handler
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle API requests
    if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response
                    const clonedResponse = response.clone();

                    // Cache the response
                    caches.open(API_CACHE_NAME).then((cache) => {
                        cache.put(request, clonedResponse);
                    });

                    return response;
                })
                .catch(() => {
                    // Return cached response if available
                    return caches.match(request);
                })
        );
        return;
    }

    // Handle static assets
    event.respondWith(
        caches.match(request).then((response) => {
            return response || fetch(request).then((fetchResponse) => {
                // Clone the response
                const clonedResponse = fetchResponse.clone();

                // Cache the response
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, clonedResponse);
                });

                return fetchResponse;
            });
        })
    );
});

// Handle background sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'syncFlashcards') {
        event.waitUntil(syncFlashcards());
    }
});

// Sync flashcards with server
async function syncFlashcards() {
    const offlineData = await getOfflineData();

    for (const item of offlineData) {
        try {
            await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item)
            });
        } catch (error) {
            console.error('Failed to sync:', error);
        }
    }
}

// Get offline data from IndexedDB
async function getOfflineData() {
    // Implementation depends on your IndexedDB structure
    return [];
} 