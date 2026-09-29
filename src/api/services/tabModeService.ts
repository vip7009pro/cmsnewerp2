/**
 * Quản lý chế độ hiển thị ĐA NHIỆM (tab) / ĐƠN NHIỆM của ERP.
 *
 * Quy tắc ưu tiên — áp dụng THỐNG NHẤT cho cả lúc bootstrap và khi viewport thay đổi:
 *   1. Người dùng đã chủ động chọn ⇒ luôn tôn trọng (kể cả trên mobile).
 *   2. Chưa chọn + viewport mobile  ⇒ ĐƠN NHIỆM.
 *   3. Chưa chọn + tài khoản Worker / POSITION_CODE 4 ⇒ ĐƠN NHIỆM.
 *   4. Còn lại ⇒ ĐA NHIỆM (mặc định cũ, giữ nguyên hành vi desktop).
 */

const TAB_MODE_KEY = "erp_tab_mode";
const MOBILE_QUERY = "(max-width: 768px)";

export type TabModePreference = "multi" | "single" | null;

export function getTabModePreference(): TabModePreference {
  try {
    const raw = localStorage.getItem(TAB_MODE_KEY);
    return raw === "multi" || raw === "single" ? raw : null;
  } catch {
    // Chế độ riêng tư / bị chặn storage ⇒ coi như chưa chọn.
    return null;
  }
}

/**
 * Ghi lựa chọn CHỦ ĐỘNG của người dùng.
 * CHỈ gọi từ thao tác toggle của người dùng — không gọi khi hệ thống tự quyết định,
 * nếu không sẽ vô hiệu hoá quy tắc "mobile mặc định đơn nhiệm".
 */
export function saveTabModePreference(isMulti: boolean): void {
  try {
    localStorage.setItem(TAB_MODE_KEY, isMulti ? "multi" : "single");
  } catch {
    /* Bỏ qua: không lưu được thì vẫn chạy theo chế độ đang hiển thị. */
  }
}

export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia(MOBILE_QUERY).matches;
  }
  return window.innerWidth <= 768;
}

/**
 * Trả về `true` nếu nên dùng ĐA NHIỆM.
 *
 * @param options.forceSingle tài khoản thuộc nhóm mặc định đơn nhiệm (Worker / POSITION_CODE 4).
 *   Đây là mặc định hệ thống, KHÔNG phải lựa chọn của người dùng ⇒ vẫn thua lựa chọn chủ động.
 */
export function resolveTabMode(options?: { forceSingle?: boolean }): boolean {
  const preference = getTabModePreference();
  if (preference === "multi") return true;
  if (preference === "single") return false;

  if (isMobileViewport()) return false;
  if (options?.forceSingle) return false;

  return true;
}

export { MOBILE_QUERY, TAB_MODE_KEY };
