import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setTabModeSwap } from "../redux/slices/globalSlice";
import { MOBILE_QUERY, resolveTabMode } from "../api/services/tabModeService";

/**
 * Tự động áp dụng chế độ đa/đơn nhiệm theo viewport.
 *
 * - Chạy 1 lần khi mount (mở app trên mobile ⇒ vào thẳng đơn nhiệm).
 * - Chạy lại khi viewport vượt qua mốc 768px (xoay máy / thu nhỏ cửa sổ).
 *
 * Chỉ tự quyết định khi người dùng CHƯA chủ động chọn — nếu họ đã bật/tắt thủ công thì
 * `resolveTabMode` trả về đúng lựa chọn đó và hook không đổi gì.
 *
 * Lưu ý: hook chỉ đổi cờ chế độ, KHÔNG reset danh sách tab. Nếu chuyển sang đa nhiệm khi
 * chưa có tab nào, `Home` đã có nhánh `tabModeSwap && tabs.length === 0 ⇒ <AccountInfo />`.
 */
export function useAutoTabModeByViewport(): void {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.totalSlice.userData);
  const currentTabMode = useSelector((state: RootState) => state.totalSlice.tabModeSwap);

  const forceSingle =
    userData?.JOB_NAME === "Worker" || userData?.POSITION_CODE === 4;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const applyResolvedMode = () => {
      const shouldUseMultiTab = resolveTabMode({ forceSingle });
      if (shouldUseMultiTab !== currentTabMode) {
        dispatch(setTabModeSwap(shouldUseMultiTab));
      }
    };

    applyResolvedMode();

    const mediaQuery = window.matchMedia(MOBILE_QUERY);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", applyResolvedMode);
      return () => mediaQuery.removeEventListener("change", applyResolvedMode);
    }

    mediaQuery.addListener(applyResolvedMode);
    return () => mediaQuery.removeListener(applyResolvedMode);
  }, [dispatch, forceSingle, currentTabMode]);
}
