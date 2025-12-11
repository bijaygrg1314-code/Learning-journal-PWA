const CACHE_NAME = 'journal-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/journal.html',
    '/projects.html',
    '/about.html',
    '/static/css/style.css',
    '/static/js/script.js',
    '/static/js/storage.js',
    '/static/js/browser.js',
    '/static/js/thirdparty.js',
    '/static/manifest.json',
    '/static/images/profile.jpg',
    '/static/images/icon1.png',
    '/static/images/icon2.png'
];

// 1. Install Event: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching all assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// 3. Fetch Event: Network first, then Cache fallback
// This strategy ensures users get the latest backend data when online,
// but the app still loads from cache when offline.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
