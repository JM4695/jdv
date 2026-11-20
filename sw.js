// 폰 알림(웹 푸시) 받기. 보내는 쪽: GitHub Actions tools/upload_push.py (업로드가 늦은 사람에게 매일)
// 아이폰은 사파리 "홈 화면에 추가"로 설치한 앱에서만 알림을 받을 수 있다(iOS 16.4+)
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(data.title || '우리 가계부', {
    body: data.body || '',
    tag: data.tag || 'jdv',          // 같은 종류 알림은 한 장으로 덮어쓴다(매일 쌓이지 않게)
    data: { url: data.url || self.registration.scope },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
    const open = windows.find((client) => client.url.startsWith(self.registration.scope));
    if (open) { open.navigate(url); return open.focus(); }
    return self.clients.openWindow(url);
  }));
});
