import { generalQuery } from "../Api";
import { getPlatformInfo, isStandalonePwa } from "./platformDetect";
import { getDeviceId } from "./deviceIdentity";

/**
 * Quản lý quyền thông báo đẩy (Web Push) của trình duyệt.
 *
 * Tách khỏi `App.tsx` để component/hook có thể kiểm tra quyền và đăng ký lại
 * subscription mà không kéo theo logic khởi động của app.
 */

/** Khoá công khai VAPID dùng cho Web Push (giữ nguyên giá trị đang chạy ở App.tsx cũ). */
const VAPID_PUBLIC_KEY =
  "BDrr_753esKQykp6mnFRExVohLC_yBXGdodkkOB3KzVAJegzQ79Nk-bDxAeZ3feyzIa9XgAcxpoXb0kdtP9cXBE";

/** 10s: `navigator.serviceWorker.ready` có thể treo vô hạn nếu SW đăng ký lỗi. */
const READY_TIMEOUT_MS = 10_000;

export type NotificationPermissionState = NotificationPermission | "unsupported";

/** Kết quả của một lần đảm bảo quyền + subscription. */
export type EnsurePushResult =
  | "granted"
  | "denied"
  | "dismissed"
  | "unsupported"
  | "error";

const isIOSDevice = (): boolean => getPlatformInfo().platform === "ios";

/**
 * Trình duyệt có hỗ trợ Web Push thật sự hay không.
 *
 * Lưu ý quan trọng: phải kiểm tra `isSecureContext` — Web Push + Service Worker
 * chỉ hoạt động trên HTTPS/localhost. Nếu bỏ qua bước này, bản deploy LAN qua
 * HTTP (rất phổ biến với ERP nội bộ) sẽ bị API trả `denied` và khoá người dùng.
 *
 * iOS Safari chỉ hỗ trợ Web Push từ 16.4 VÀ khi đã "Add to Home Screen"; các
 * trường hợp còn lại coi như không hỗ trợ để không chặn người dùng oan.
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  if (!window.isSecureContext) return false;
  if (!("Notification" in window)) return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
  if (isIOSDevice() && !isStandalonePwa()) return false;
  return true;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (!isPushNotificationSupported()) return "unsupported";
  try {
    return window.Notification.permission;
  } catch {
    return "unsupported";
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function serviceWorkerReady(): Promise<ServiceWorkerRegistration> {
  return new Promise<ServiceWorkerRegistration>((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error("serviceWorker.ready timeout")),
      READY_TIMEOUT_MS
    );
    navigator.serviceWorker.ready.then(
      (registration) => {
        window.clearTimeout(timer);
        resolve(registration);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/** Xin quyền (chỉ có tác dụng khi quyền đang ở trạng thái "default"). */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isPushNotificationSupported()) return "unsupported";
  try {
    return await window.Notification.requestPermission();
  } catch {
    return getNotificationPermission();
  }
}

/** Đăng ký subscription với push service và gửi lên backend (`addSubscription`). */
async function registerPushSubscription(): Promise<boolean> {
  const registration = await serviceWorkerReady();
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
    }));

  const response = await generalQuery("addSubscription", {
    subscription: JSON.stringify(subscription),
    // deviceId ⇒ server biết subscription này của THIẾT BỊ nào; nhờ đó không push
    // cho đúng thiết bị đang mở ERP mà vẫn push cho các thiết bị khác của cùng user.
    deviceId: getDeviceId(),
  });
  return response?.data?.tk_status !== "NG";
}

/**
 * Đảm bảo app đã có quyền thông báo và subscription đã được lưu ở server.
 *
 * @param requestIfDefault `true` ⇒ tự bật prompt của trình duyệt khi quyền còn "default".
 *   Chỉ nên bật cho luồng chủ động (nút "Bật thông báo"), KHÔNG nên bật lúc boot
 *   vì prompt sẽ bật lên ngay khi người dùng chưa hiểu lý do.
 */
export async function ensurePushSubscription(options?: {
  requestIfDefault?: boolean;
}): Promise<EnsurePushResult> {
  if (!isPushNotificationSupported()) return "unsupported";

  let permission = getNotificationPermission();
  if (permission === "default" && options?.requestIfDefault) {
    permission = await requestNotificationPermission();
  }
  if (permission === "default") return "dismissed";
  if (permission === "denied") return "denied";

  try {
    const ok = await registerPushSubscription();
    return ok ? "granted" : "error";
  } catch (error) {
    console.log("Lỗi đăng ký push subscription:", error);
    return "error";
  }
}
