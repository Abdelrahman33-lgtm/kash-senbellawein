/* كاش السنبلاوين · sw.js v3 */
const CACHE = 'kash-v3';

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(['./index.html','./style.css','./script.js']).catch(()=>{}))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = event.request.url;

    // تجاهل تام لأي حاجة مش GET أو طلب خارجي
    if (event.request.method !== 'GET') return;
    if (!url.startsWith(self.location.origin)) return;

    // فقط الملفات المحلية
    event.respondWith(
        fetch(event.request)
            .then(res => {
                if (res && res.status === 200) {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(event.request, copy));
                }
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});