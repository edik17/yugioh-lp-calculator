const CACHE_NAME = 'dueldisk-cache-v19';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon.svg',
  './images/card_back.svg',
  './sounds/damage.mp3',
  './sounds/lp_count_loop.mp3',
  './sounds/lp_stop.mp3',
  './sounds/lp_drop.mp3',
  './sounds/gainlp.mp3',
  './sounds/directattack.mp3',
  './sounds/destroyed.mp3',
  './sounds/activate.mp3',
  './sounds/summon.mp3',
  './sounds/coinflip.mp3',
  './sounds/diceroll.mp3',
  './sounds/nextturn.mp3',
  './images/fields/monarch.jpg',
  './images/fields/monarch_card.jpg',
  './images/fields/crystal.jpg',
  './images/fields/crystal_card.jpg',
  './images/fields/blueeyes.jpg',
  './images/fields/blueeyes_card.jpg',
  './images/fields/darkmagician.jpg',
  './images/fields/darkmagician_card.jpg',
  './images/fields/hero.jpg',
  './images/fields/hero_card.jpg',
  './images/fields/branded.jpg',
  './images/fields/branded_card.jpg',
  './images/fields/cyber.jpg',
  './images/fields/zombie.jpg',
  './images/fields/umi.jpg',
  './images/fields/sanctuary.jpg',
  './images/monsters/monarch_erebus.jpg',
  './images/monsters/monarch_ehther.jpg',
  './images/monsters/monarch_caius.jpg',
  './images/monsters/cb_rainbowdragon.jpg',
  './images/monsters/cb_overdrive.jpg',
  './images/monsters/cb_pegasus.jpg',
  './images/monsters/cb_ruby.jpg',
  './images/monsters/be_blueeyes.jpg',
  './images/monsters/be_ultimate.jpg',
  './images/monsters/be_chaosmax.jpg',
  './images/monsters/be_spirit.jpg',
  './images/monsters/cd_cyberdragon.jpg',
  './images/monsters/cd_cyberend.jpg',
  './images/monsters/cd_infinity.jpg',
  './images/monsters/cd_nova.jpg',
  './images/monsters/blueeyes.jpg',
  './images/monsters/darkmagician.jpg',
  './images/monsters/rainbowdragon.jpg',
  './images/monsters/cyberend.jpg',
  './images/monsters/monarch.jpg',
  './images/monsters/neos.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
