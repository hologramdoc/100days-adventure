const CACHE = "100days-v2"; // 버전 올리면 갱신 쉬움
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/photo.jpg",
  "./assets/bgm.mp3",
  "./assets/nb_more_v5.jpg",
  "./assets/capsule_gacha.gif"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res =>
      res ||
      fetch(e.request).then(r => {
        // 동일 출처 정적 파일만 캐시 추적 (에러 무시)
        try {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        } catch {}
        return r;
      })
    )
  );
});
