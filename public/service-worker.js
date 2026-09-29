/* Service worker cho Web Push của ERP.
 *
 * Lưu ý tương thích: các luồng push cũ chỉ gửi { title, body } (không có url) nên
 * handler phải chịu được payload thiếu trường và vẫn hiển thị được thông báo.
 */

const DEFAULT_URL = "/";

// Bắt buộc SW mới tiếp quản ngay khi cài: nếu không, handler click của bản cũ
// (vốn luôn mở '/') vẫn chạy cho tới khi người dùng đóng hết tab.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function readPayload(event) {
  if (!event.data) return {};
  try {
    return event.data.json();
  } catch (error) {
    // Payload là text thuần (một số luồng cũ) → chỉ có phần nội dung.
    try {
      return { body: event.data.text() };
    } catch (textError) {
      return {};
    }
  }
}

self.addEventListener("push", (event) => {
  const payload = readPayload(event);
  const targetUrl = payload.url || (payload.data && payload.data.url) || DEFAULT_URL;

  const options = {
    body: payload.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    // Gắn URL đích vào chính notification để handler click đọc lại được.
    data: { url: targetUrl },
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "Thông báo ERP", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || DEFAULT_URL;
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });
      const sameOriginClients = clientList.filter((client) =>
        client.url.startsWith(self.location.origin)
      );

      for (const client of sameOriginClients) {
        try {
          if (typeof client.navigate === "function") {
            const navigated = await client.navigate(absoluteUrl);
            if (navigated) {
              await navigated.focus();
              return;
            }
          }
          // Không điều hướng được (client chưa bị SW kiểm soát) → thử client kế tiếp.
        } catch (error) {
          // Client chưa bị SW điều khiển hoặc URL ngoài scope ⇒ bỏ qua, mở cửa sổ mới.
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(absoluteUrl);
      }
    })()
  );
});