import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, CircularProgress, Dialog, Typography } from "@mui/material";
import { FiAlertTriangle, FiBell, FiRefreshCw } from "../icons/localIconSet";
import {
  ensurePushSubscription,
  getNotificationPermission,
  isPushNotificationSupported,
  requestNotificationPermission,
} from "../../api/services/notificationPermissionService";
import { getPlatformInfo } from "../../api/services/platformDetect";
import NotificationPermissionGuide from "./NotificationPermissionGuide";
import "./NotificationPermissionGate.scss";

/**
 * - `prompt`: chưa cấp quyền, có thể xin lại.
 * - `denied`: đã bị chặn, phải bật thủ công trong cài đặt.
 * - `ios-setup`: iOS ở tab Safari — chưa thể cấp quyền, chỉ hướng dẫn Add to Home Screen.
 * - `loading`: đang xử lý.
 */
type GateStatus = "prompt" | "denied" | "loading" | "ios-setup";

interface NotificationPermissionGateProps {
  /** Chỉ bật kiểm tra khi người dùng đã đăng nhập và đã bootstrap xong. */
  enabled: boolean;
  /**
   * iOS/iPadOS đang mở ở TAB Safari (chưa “Add to Home Screen”): Apple KHÔNG cho cấp quyền
   * push ở chế độ này ⇒ không thể bắt buộc, chỉ có thể HƯỚNG DẪN thêm vào màn hình chính.
   */
  iosNeedsHomeScreen?: boolean;
  /** Gọi khi quyền đã "granted" (không gọi nếu quyền không được hỗ trợ). */
  onGranted?: () => void;
  onLogout?: () => void;
}

/**
 * Chặn người dùng cho tới khi họ cấp quyền thông báo đẩy (Web Push).
 *
 * Hành vi:
 * - Kiểm tra `Notification.permission` ngay khi mount (không tự bật prompt trình duyệt
 *   lúc boot để tránh người dùng bấm "Chặn" mà chưa hiểu lý do).
 * - Chưa cấp quyền (`default`) ⇒ hiện popup, mọi cách đóng đều bị vô hiệu.
 * - Đã "Chặn" (`denied`) ⇒ trình duyệt không cho hỏi lại; popup hướng dẫn bật lại
 *   trong Settings và cho phép đăng xuất để thoát (không khoá cứng tài khoản).
 * - iOS ở tab Safari ⇒ Apple không cho cấp quyền push; popup hướng dẫn thêm ERP vào
 *   màn hình chính rồi mở lại (khi đó cổng mới kiểm tra quyền bình thường).
 * - Trình duyệt không hỗ trợ (HTTP nội bộ…) ⇒ không chặn, tránh khoá người dùng oan.
 */
export default function NotificationPermissionGate({
  enabled,
  iosNeedsHomeScreen = false,
  onGranted,
  onLogout,
}: NotificationPermissionGateProps) {
  const platformInfo = useMemo(() => getPlatformInfo(), []);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<GateStatus>("prompt");
  const [message, setMessage] = useState<string | null>(null);
  const grantedNotifiedRef = useRef(false);
  const busy = status === "loading";

  const notifyGranted = useCallback(() => {
    if (grantedNotifiedRef.current) return;
    grantedNotifiedRef.current = true;
    onGranted?.();
  }, [onGranted]);

  const syncPermission = useCallback(async () => {
    if (!enabled && !iosNeedsHomeScreen) return;

    // iOS ở tab Safari: chưa thể cấp quyền ⇒ chỉ hiện hướng dẫn Add to Home Screen.
    if (iosNeedsHomeScreen) {
      setStatus("ios-setup");
      setOpen(true);
      return;
    }

    if (!isPushNotificationSupported()) {
      setOpen(false);
      return;
    }

    const permission = getNotificationPermission();
    if (permission === "granted") {
      // Quyền đã có nhưng subscription có thể chưa được lưu (đổi máy, SW mới…).
      void ensurePushSubscription();
      notifyGranted();
      setOpen(false);
      return;
    }

    setStatus(permission === "denied" ? "denied" : "prompt");
    setOpen(true);
  }, [enabled, iosNeedsHomeScreen, notifyGranted]);

  useEffect(() => {
    void syncPermission();
  }, [syncPermission]);

  // Người dùng có thể bật quyền ở tab cài đặt trình duyệt rồi quay lại app.
  useEffect(() => {
    if (!open || (!enabled && !iosNeedsHomeScreen)) return;
    // Trạng thái ios-setup không thể tự chuyển thành "granted" ⇒ không cần dò quyền.
    if (status === "ios-setup") return;

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      const permission = getNotificationPermission();
      if (permission === "granted") {
        void ensurePushSubscription();
        notifyGranted();
        setOpen(false);
      } else if (permission === "denied") {
        setStatus("denied");
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [open, enabled, iosNeedsHomeScreen, status, notifyGranted]);

  const handleAllow = useCallback(async () => {
    setMessage(null);
    setStatus("loading");

    const permission = await requestNotificationPermission();
    if (permission === "denied") {
      setStatus("denied");
      setMessage(
        "Bạn vừa chọn Chặn. Trình duyệt sẽ không hỏi lại — hãy bật lại theo hướng dẫn bên dưới."
      );
      return;
    }
    if (permission !== "granted") {
      // Người dùng đóng prompt của trình duyệt mà không chọn gì.
      setStatus("prompt");
      setMessage("Bạn cần bấm \"Cho phép\" trên hộp thoại của trình duyệt để tiếp tục.");
      return;
    }

    // Đã có quyền ⇒ mở cổng ngay. Việc đăng ký subscription là best-effort:
    // thất bại (incognito/không có Push API/ mạng) không được phép khoá người dùng.
    notifyGranted();
    setOpen(false);
    const result = await ensurePushSubscription();
    if (result !== "granted") {
      console.warn("Chưa đăng ký được push subscription:", result);
    }
  }, [notifyGranted]);

  const handleRecheck = useCallback(async () => {
    setStatus("loading");
    const permission = getNotificationPermission();
    if (permission === "granted") {
      // Đã có quyền ⇒ cho vào, subscription chỉ đăng ký nền (best-effort).
      notifyGranted();
      setOpen(false);
      const result = await ensurePushSubscription();
      if (result !== "granted") {
        console.warn("Chưa đăng ký được push subscription:", result);
      }
      return;
    }
    setStatus(permission === "denied" ? "denied" : "prompt");
    setMessage(
      permission === "default"
        ? 'Trình duyệt vẫn đang ở trạng thái chưa cho phép. Hãy bấm "Cho phép" để tiếp tục.'
        : "Trình duyệt vẫn đang chặn thông báo cho trang này."
    );
  }, [notifyGranted]);

  const handleLater = useCallback(() => {
    setMessage(null);
    setOpen(false);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleLater}
      maxWidth="sm"
      fullWidth
      className="notiPermGate"
      PaperProps={{ className: "notiPermGate__paper" }}
    >
      <div className="notiPermGate__hero">
        <div className="notiPermGate__heroGlow" />
        <div className="notiPermGate__iconWrap">
          {status === "prompt" || status === "loading" ? (
            <FiBell size={26} strokeWidth={2.2} />
          ) : (
            <FiAlertTriangle size={26} strokeWidth={2.2} />
          )}
        </div>
        <Typography className="notiPermGate__eyebrow" variant="overline">
          {status === "ios-setup" ? "Thiết lập iPhone / iPad" : "Bắt buộc"}
        </Typography>
        <Typography className="notiPermGate__title" variant="h6">
          {status === "denied"
            ? "Thông báo đang bị chặn"
            : status === "ios-setup"
              ? "Cần thêm ERP vào màn hình chính"
              : "Cho phép thông báo để tiếp tục"}
        </Typography>
      </div>

      <div className="notiPermGate__body">
        <Typography className="notiPermGate__desc">
          {status === "ios-setup"
            ? "iPhone/iPad chỉ cho phép nhận thông báo đẩy khi ERP được mở từ biểu tượng ngoài màn hình chính. Hãy làm theo 2 bước dưới đây (chỉ làm một lần)."
            : "Hệ thống dùng thông báo đẩy để gửi chỉ thị, cảnh báo lỗi chất lượng và các phê duyệt cần xử lý ngay. Vì vậy bạn cần bật quyền thông báo trước khi sử dụng ERP."}
        </Typography>

        {status === "denied" && (
          <NotificationPermissionGuide platformInfo={platformInfo} />
        )}

        {status === "ios-setup" && (
          <NotificationPermissionGuide platformInfo={platformInfo} onlyTarget="ios" />
        )}

        {message && <div className="notiPermGate__message">{message}</div>}

        <div className="notiPermGate__actions">
          {status === "ios-setup" ? (
            <>
              <Button
                className="notiPermGate__btn notiPermGate__btn--primary"
                variant="contained"
                disableElevation
                startIcon={<FiRefreshCw size={18} />}
                onClick={() => window.location.reload()}
                disabled={busy}
              >
                Tôi đã thêm, mở lại ERP
              </Button>
              {onLogout && (
                <Button
                  className="notiPermGate__btn"
                  variant="text"
                  onClick={onLogout}
                  disabled={busy}
                >
                  Đăng xuất
                </Button>
              )}
            </>
          ) : status === "denied" ? (
            <>
              <Button
                className="notiPermGate__btn notiPermGate__btn--primary"
                variant="contained"
                disableElevation
                startIcon={<FiRefreshCw size={18} />}
                onClick={() => void handleRecheck()}
                disabled={busy}
              >
                Tôi đã bật lại
              </Button>
              <Button
                className="notiPermGate__btn"
                variant="text"
                onClick={handleLater}
                disabled={busy}
              >
                Để sau
              </Button>
              {onLogout && (
                <Button
                  className="notiPermGate__btn"
                  variant="text"
                  onClick={onLogout}
                  disabled={busy}
                >
                  Đăng xuất
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                className="notiPermGate__btn notiPermGate__btn--primary"
                variant="contained"
                disableElevation
                startIcon={busy ? undefined : <FiBell size={18} />}
                onClick={() => void handleAllow()}
                disabled={busy}
              >
                {busy ? <CircularProgress size={18} color="inherit" /> : "Cho phép"}
              </Button>
              <Button
                className="notiPermGate__btn"
                variant="text"
                onClick={() => void handleRecheck()}
                disabled={busy}
              >
                Đã bật, kiểm tra lại
              </Button>
              <Button
                className="notiPermGate__btn"
                variant="text"
                onClick={handleLater}
                disabled={busy}
              >
                Để sau
              </Button>
            </>
          )}
        </div>

        <div className="notiPermGate__note">
          {status === "denied"
            ? "Sau khi bật quyền ở cài đặt thiết bị, quay lại đây và bấm “Tôi đã bật lại” — ERP không cần tải lại trang."
            : status === "ios-setup"
              ? "Sau khi bấm “Thêm”, hãy thoát Safari và mở ERP bằng biểu tượng mới trên màn hình chính; lúc đó iOS mới hỏi cấp quyền thông báo."
              : "Nếu không thấy hộp thoại xin quyền, hãy bật quyền thủ công theo hướng dẫn tương ứng với thiết bị bạn đang dùng."}
        </div>
      </div>
    </Dialog>
  );
}
