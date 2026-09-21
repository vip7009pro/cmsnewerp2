import { useEffect, useRef } from "react";

/**
 * Đóng drawer điều hướng bằng nút Back (Android) / vuốt cạnh (iOS) trên mobile.
 *
 * Nguyên lý: khi drawer mở, đẩy 1 entry "guard" cùng URL vào History. Lúc này lần Back
 * kế tiếp chỉ là popstate về đúng URL hiện tại (không thoát web) ⇒ ta bắt popstate để đóng drawer.
 *
 * 3 điểm dễ sai đã xử lý:
 * 1. React StrictMode (dev) chạy effect 2 lần (mount → cleanup → mount lại ngay). Nếu cleanup
 *    gọi history.back() đồng bộ thì guard bị gỡ mất và drawer tự đóng. ⇒ Việc gỡ guard được
 *    hoãn qua setTimeout(0); nếu component mount lại trước đó thì hủy việc gỡ.
 * 2. cleanup gọi history.back() sẽ sinh popstate. Nếu drawer được mở lại trước khi popstate bắn
 *    ra, listener mới sẽ hiểu nhầm là "người dùng bấm back" và đóng drawer. ⇒ module-level
 *    selfBackPending đánh dấu để bỏ qua đúng những popstate do chính hook này tạo.
 * 3. Khi người dùng bấm vào 1 menu (React Router push route mới) thì drawer unmount — lúc đó
 *    KHÔNG được gọi history.back() vì sẽ kéo ngược lại route vừa điều hướng. ⇒ Chỉ gỡ guard khi
 *    entry hiện tại vẫn còn dấu guard của chính hook.
 */

const GUARD_STATE_KEY = "__erpNavDrawerGuard";

/** Số popstate do chính hook này tạo ra (từ history.back() khi gỡ guard) cần bỏ qua. */
let selfBackPending = 0;

/** Timer gỡ guard đang chờ, dùng để hủy khi component mount lại (StrictMode). */
let pendingGuardRemoval: ReturnType<typeof setTimeout> | null = null;

const cancelPendingGuardRemoval = () => {
  if (pendingGuardRemoval !== null) {
    clearTimeout(pendingGuardRemoval);
    pendingGuardRemoval = null;
  }
};

const isOnGuardEntry = (): boolean => {
  if (typeof window === "undefined") return false;
  const state = window.history.state as Record<string, unknown> | null;
  return Boolean(state && state[GUARD_STATE_KEY]);
};

const removeGuardEntry = () => {
  pendingGuardRemoval = null;
  if (!isOnGuardEntry()) return;
  selfBackPending += 1;
  window.history.back();
};

/**
 * @param enabled  Chỉ bật trên mobile (desktop đã có chuột/phím, không nên chiếm nút Back).
 * @param onRequestClose  Hàm đóng drawer do component cung cấp.
 */
export function useMobileBackClose(enabled: boolean, onRequestClose: () => void): void {
  const closeHandlerRef = useRef(onRequestClose);
  closeHandlerRef.current = onRequestClose;

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || !window.history?.pushState) return;

    // Mount lại ngay sau cleanup (StrictMode) ⇒ giữ nguyên guard đang có.
    cancelPendingGuardRemoval();

    if (!isOnGuardEntry()) {
      // Giữ lại state sẵn có (React Router lưu key/idx trong đó) để không phá bookkeeping của router.
      window.history.pushState(
        { ...(window.history.state || {}), [GUARD_STATE_KEY]: true },
        "",
        window.location.href
      );
    }

    const handlePopState = () => {
      if (selfBackPending > 0) {
        selfBackPending -= 1;
        return;
      }
      closeHandlerRef.current();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      cancelPendingGuardRemoval();
      pendingGuardRemoval = setTimeout(removeGuardEntry, 0);
    };
  }, [enabled]);
}
