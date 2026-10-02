/**
 * Tắt thông báo (snackbar) của "Trung tâm thông báo" — THUẦN CLIENT (localStorage).
 *
 * Vì snackbar là trải nghiệm phía trình duyệt (do socket đẩy về), không cần lưu server.
 * Trạng thái dùng CHUNG cho:
 *   - `App.tsx` (chặn `enqueueSnackbar` khi đang tắt) — qua `isNotiMuted()`.
 *   - `NotificationPanel` (nút chuông + menu chọn thời lượng).
 *
 * Quy tắc: giống chat — KHÔNG tự bật lại khi mở lại; chỉ bật lại khi người dùng tự bấm
 * "Bật lại thông báo" (lựa chọn "Cho tới khi tôi bật lại").
 */

const STORAGE_KEY = "noti_center_mute_until";

/** Mốc "vô hạn" cho lựa chọn "Cho tới khi tôi bật lại". */
export const NOTI_MUTE_UNTIL_OPEN = Number.MAX_SAFE_INTEGER;
/** Ngưỡng số giây coi như "vô hạn" khi hiển thị. */
export const NOTI_MUTE_UNTIL_OPEN_THRESHOLD_SECONDS = 300 * 24 * 3600;

export type NotiMuteOption = number | "untilOpen" | null;

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* bỏ qua */
    }
  });
}

/** Mốc hết hạn tuyệt đối (ms) hoặc null nếu đang nhận thông báo. */
export function getNotiMuteUntil(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) return null;
    // Hết hạn theo thời gian ⇒ tự dọn.
    if (value < NOTI_MUTE_UNTIL_OPEN && value <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

/** Đang tắt thông báo nổi (snackbar)? */
export function isNotiMuted(): boolean {
  return getNotiMuteUntil() !== null;
}

/** Đặt thời lượng tắt: null = bật lại, "untilOpen" = tới khi tự bật lại, số = số phút. */
export function setNotiMute(option: NotiMuteOption): number | null {
  let until: number | null = null;
  if (option === null) until = null;
  else if (option === "untilOpen") until = NOTI_MUTE_UNTIL_OPEN;
  else if (typeof option === "number" && Number.isFinite(option) && option > 0) {
    until = Date.now() + option * 60_000;
  }
  try {
    if (until === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, String(until));
  } catch {
    /* localStorage có thể bị chặn — bỏ qua */
  }
  emit();
  return until;
}

/** Số giây còn lại (null = đang nhận). Mốc "vô hạn" trả về giá trị rất lớn. */
export function notiMuteSecondsLeft(): number | null {
  const until = getNotiMuteUntil();
  if (until === null) return null;
  if (until >= NOTI_MUTE_UNTIL_OPEN) return Math.floor(NOTI_MUTE_UNTIL_OPEN / 1000);
  return Math.max(0, Math.round((until - Date.now()) / 1000));
}

/** Lựa chọn có phải "cho tới khi tôi bật lại"? */
export function isNotiMuteUntilOpen(secondsLeft: number | null): boolean {
  return Boolean(secondsLeft && secondsLeft >= NOTI_MUTE_UNTIL_OPEN_THRESHOLD_SECONDS);
}

/** Theo dõi thay đổi (cùng tab) để UI cập nhật ngay. Trả hàm huỷ đăng ký. */
export function subscribeNotiMute(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
