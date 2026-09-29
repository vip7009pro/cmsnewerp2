/* Service worker cho Web Push của ERP.
 *
 * Lưu ý tương thích: các luồng push cũ chỉ gửi { title, body } (không có url) nên
 * handler phải chịu được payload thiếu trường và vẫn hiển thị được thông báo.
 */

const DEFAULT_URL = "/";
const RESULT_URL = "/nhansu/pheduyetnghi";

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
  const actions = Array.isArray(payload.actions) ? payload.actions : [];

  const options = {
    body: payload.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    // `tag` (do backend gửi kèm, ví dụ "chat-<conversationId>") ⇒ nhiều tin trong cùng
    // một phòng chat sẽ gộp thành 1 thông báo thay vì xếp chồng.
    tag: payload.tag || undefined,
    // Gắn URL đích + dữ liệu thao tác nhanh vào chính notification để handler click đọc lại.
    data: { url: targetUrl, approval: payload.approval || null },
  };

  if (actions.length > 0) {
    options.actions = actions;
    // Giữ thông báo trên màn hình để leader kịp bấm duyệt (Chrome desktop / Android).
    options.requireInteraction = true;
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || "Thông báo ERP", options)
  );
});

/**
 * Xử lý nút Phê duyệt / Từ chối ngay trên thông báo.
 *
 * Gọi thẳng command `pheduyetnhanhnhom` của backend: xác thực bằng cookie phiên đăng nhập
 * (cookie không phân biệt port nên vẫn gửi được tới API cùng domain), kèm `credentials: "include"`.
 * Danh sách OFF_ID do backend sinh ra lúc tạo đơn và nhúng trong payload push.
 */
async function handleQuickApproval(action, approval) {
  const pheduyetvalue = action === "approve" ? 1 : 0;

  const showResult = (title, body) =>
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: RESULT_URL },
    });

  try {
    const response = await fetch(approval.apiUrl, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secureContext: false,
        command: "pheduyetnhanhnhom",
        DATA: {
          off_ids: approval.offIds,
          pheduyetvalue,
          CTR_CD: approval.ctrCd,
        },
      }),
    });

    const json = await response.json().catch(() => null);
    const isOk = json && String(json.tk_status).toUpperCase() === "OK";

    if (isOk) {
      return showResult(
        pheduyetvalue === 1 ? "Đã phê duyệt đơn nghỉ" : "Đã từ chối đơn nghỉ",
        json.message || "Nhân viên đã được thông báo."
      );
    }

    // Đơn đã bị người khác xử lý trước (2 leader nhận thông báo cùng lúc).
    // Đây không phải lỗi — backend trả về ai đã xử lý và theo hướng nào.
    if (json && json.code === "ALREADY_HANDLED") {
      return showResult(
        "Đơn đã được xử lý",
        json.message || "Đơn này đã có người xử lý trước đó."
      );
    }

    return showResult(
      "Chưa xử lý được",
      (json && json.message) || "Vui lòng mở ERP để xử lý."
    );
  } catch (error) {
    return showResult(
      "Chưa xử lý được",
      "Không kết nối được máy chủ. Vui lòng mở ERP để xử lý."
    );
  }
}

self.addEventListener("notificationclick", (event) => {
  const notificationData = event.notification.data || {};

  // Bấm nút hành động (khác với bấm vào thân thông báo).
  if (
    (event.action === "approve" || event.action === "reject") &&
    notificationData.approval
  ) {
    event.notification.close();
    event.waitUntil(handleQuickApproval(event.action, notificationData.approval));
    return;
  }

  event.notification.close();

  const targetUrl = notificationData.url || DEFAULT_URL;
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