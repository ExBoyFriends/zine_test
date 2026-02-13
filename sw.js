// Service Worker

const CACHE_NAME = 'story-v1';
// キャッシュしたいファイルリスト（あなたの構成に合わせて調整してください）
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/utils/base.css'
];

// インストール時にファイルを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ネットがなくてもキャッシュから出す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
