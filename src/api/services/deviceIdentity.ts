/**
 * Định danh THIẾT BỊ/TRÌNH DUYỆT cho chat.
 *
 * Vì sao cần: một người có thể đăng nhập đồng thời trên PC + Android + iPhone.
 * Để quyết định push theo TỪNG thiết bị (PC đang mở thì PC không nhận push, nhưng
 * điện thoại để nền vẫn phải nhận), server cần biết socket/subscription thuộc thiết bị nào.
 *
 * Giá trị được lưu trong `localStorage` nên ổn định qua các lần mở tab (mỗi tab cùng
 * máy dùng chung 1 deviceId — đúng ý nghĩa "thiết bị", không phải "tab").
 */
const STORAGE_KEY = "chat_device_id";

let cached: string | null = null;

/** Sinh id ngẫu nhiên đủ dài, không phụ thuộc thư viện ngoài. */
function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // Một số môi trường chặn crypto.randomUUID ⇒ rơi xuống nhánh dưới.
  }
  const rand = Math.random().toString(36).slice(2, 10);
  return `dev-${Date.now().toString(36)}-${rand}`;
}

/**
 * Trả về deviceId ổn định của thiết bị hiện tại (tự sinh ở lần gọi đầu).
 * An toàn khi SSR/chặn localStorage: trả về id tạm trong bộ nhớ.
 */
export function getDeviceId(): string {
  if (cached) return cached;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      cached = existing;
      return cached;
    }
    const created = randomId();
    window.localStorage.setItem(STORAGE_KEY, created);
    cached = created;
    return cached;
  } catch {
    cached = randomId();
    return cached;
  }
}

/** Mô tả ngắn nền tảng — chỉ để hiển thị/chẩn đoán, KHÔNG dùng làm khoá. */
export function describeDevice(): string {
  try {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
  } catch {
    return "unknown";
  }
}
