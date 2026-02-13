// Service Worker (空の状態)
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (event) => {
  // ここは空でもOK。エラーを出すのを防ぐのが目的です
});
