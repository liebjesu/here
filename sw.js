/* HERE. 홈 화면 앱용 서비스 워커
   - 항상 인터넷에서 새 화면을 먼저 받음 (업데이트가 바로 반영)
   - 인터넷이 끊겼을 때만 마지막으로 받은 화면을 보여줌
   - 구글(데이터) 요청은 건드리지 않음 */
var CACHE = 'here-v1';
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || /version\.json$/.test(url.pathname)) return;
  // 화면 이동(navigate) 요청은 옵션을 붙여 다시 만들 수 없어서 주소로 새로 요청
  e.respondWith(fetch(req.mode === 'navigate' ? req.url : req, { cache: 'no-store' }).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('./', { ignoreSearch: true }); });
  }));
});
