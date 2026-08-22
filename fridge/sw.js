// 하야의 냉장고 — 오프라인 동작용 서비스워커
// 앱 껍데기와 레시피를 캐시에 담아 두고, 뒤에서 조용히 새 버전을 받아 둔다.
// 레시피를 새로 푸시하면 다음 실행 때 반영된다.

const VERSION = 'v3';
const SHELL   = `haya-fridge-shell-${VERSION}`;
const FONTS   = 'haya-fridge-fonts';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './recipes.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

const isFont = url =>
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== FONTS).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 웹폰트는 한 번 받으면 계속 쓴다 (비행기 모드에서도 서체가 유지되도록)
  if (isFont(url)) {
    e.respondWith(
      caches.open(FONTS).then(async cache => {
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          cache.put(req, res.clone());
          return res;
        } catch {
          return hit || Response.error();
        }
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // 주소창으로 들어오는 요청은 항상 앱 화면을 돌려준다
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          caches.open(SHELL).then(c => c.put('./index.html', res.clone()));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 나머지는 캐시를 먼저 주고, 뒤에서 새 버전을 받아 둔다
  e.respondWith(
    caches.open(SHELL).then(async cache => {
      const hit = await cache.match(req);
      const fresh = fetch(req)
        .then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
        .catch(() => null);
      return hit || (await fresh) || Response.error();
    })
  );
});
