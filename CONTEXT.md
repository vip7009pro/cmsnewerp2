# ERP Context & Status

## Update - 2026-09-25 (SETTING / MOBILE UX: Làm Lại Giao Diện Mobile SettingPage Chuẩn UX/UI Mobile-First)
- **1. Kiến trúc Mobile Tabs Phân Tách ([SettingPage.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/SettingPage.tsx))**:
  * Tích hợp viewport listener `window.matchMedia("(max-width: 768px)")` chuyển đổi động giữa giao diện Desktop (2 cột song song) và Mobile (Segmented Tabs).
  * Bộ Tabs chuyển đổi mượt mà ([PrecisionSettingMobileTabs.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingMobileTabs.tsx)): `Bảo Mật & 2FA` (kèm badge Bật/Tắt đồng bộ real-time) | `Tham Số` (kèm số lượng tham số) | `Thông Báo` (nếu là Admin NHU1903).
- **2. Chuyển Đổi Dạng Danh Sách Thẻ (Mobile Card List View) ([PrecisionSettingTable.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingTable.tsx))**:
  * Thay thế bảng cuộn ngang chật hẹp trên điện thoại bằng danh sách thẻ tham số (`.param-card-item`), ô nhập to rõ min-height 38px, font 14px chống zoom trình duyệt iOS/Android.
  * Toolbar mobile tích hợp thanh tìm kiếm kèm icon Clear và hàng nút tác vụ (Lưu cấu hình / Đặt lại) full-width với touch target 40px+.
- **3. Tối Ưu UX MFA Card & Push Notification ([PrecisionSettingMfaCard.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingMfaCard.tsx) & [PrecisionSettingNotification.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingNotification.tsx))**:
  * Header thu gọn tiêu đề & ẩn breadcrumb rườm rà trên mobile.
  * Hộp trạng thái MFA dạng cột đứng, nút kích hoạt/tắt tràn viền dễ thao tác ngón cái, modal quét QR tự co giãn 180px, ô nhập OTP 6 số bàn phím số (`inputMode="numeric"`).
- **4. Sửa Lỗi Company Not Supported Khi Nhập OTP 2FA ([Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts))**:
  * Bổ sung `COMPANY: getCompany() || "CMS"` và `CTR_CD` vào `DATA` payload của hàm `verifyMfaLogin` đồng bộ chuẩn backend.
- **5. Nút Mở Nhanh Google Authenticator Tích Hợp Trong Ô Nhập OTP ([PrecisionLoginMfaForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/login/PrecisionLogin/PrecisionLoginMfaForm.tsx))**:
  * Đặt nút `[📲 Mở App]` gọn gàng bên trong góc phải của ô input-box. Chuẩn hóa Android Intent Scheme với `action=MAIN;category=LAUNCHER;package=com.google.android.apps.authenticator2` mở trực tiếp app thay vì bị redirect Google Play; URL Scheme `googleauthenticator://` / `otpauth://` trên iOS và popup trên desktop.
- **6. Xác Thực Toàn Diện**: `npm run build` thành công 100% (exit code 0), bundle tối ưu.

## Update - 2026-09-25 (AUTH/MFA: Tích hợp Google Authenticator 2FA TOTP RFC 6238 & Refactor SettingPage Chuẩn Stitch)
- Tách module hóa dưới 300 dòng/file trong thư mục `src/pages/setting/PrecisionSetting/`.
- Backend `practice1`: Bổ sung 4 cột vào bảng `ZTBEMPLINFO`, thuật toán TOTP bằng Node built-in `crypto` chạy mượt mà trên `pkg`.
- Luồng đăng nhập 2FA trên [Login.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/login/Login.tsx) & [PrecisionLoginMfaForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/login/PrecisionLogin/PrecisionLoginMfaForm.tsx).

## Update - 2026-09-25 (R&D / CODE_MANAGER: Tối ưu giao diện Mobile bằng conditional rendering viewport)
- Conditional rendering theo Viewport ([CODE_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/code_manager/CODE_MANAGER.tsx)): listener `window.matchMedia("(max-width: 768px)")`.
- Tinh gọn Toolbar ([PrecisionCodeManagerToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/code_manager/PrecisionCodeManager/PrecisionCodeManagerToolbar.tsx)).
- Trượt cuộn ngang 1 dòng duy nhất ([PrecisionCodeManager.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/code_manager/PrecisionCodeManager/PrecisionCodeManager.scss)).

## Update - 2026-09-25 (YCSX: Sửa lỗi SweetAlert2 không hiển thị hoặc bị hủy khi tra cứu/thêm/sửa/xóa)
- Khắc phục `Swal.close()` tự hủy popup thông báo với tham số `isSilent = true` khi reload ngầm ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts) & [kdUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/utils/kdUtils.tsx)).
- Khắc phục SweetAlert2 bị che bởi Modal Backdrop (`z-index: 2147483647 !important`).

## Update - 2026-09-25 (PWA: Khắc phục lỗi đăng ký Service Worker khi truy cập route con & icon PWA mờ vỡ)
- Absolute path `/service-worker.js` với `{ scope: '/' }` trong [index.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/index.tsx). Trọn bộ adaptive icons đạt chuẩn Safe Zone.

## Update - 2026-09-25 (AUTH/BOOTSTRAP: Sửa dứt điểm lỗi kẹt màn hình Login & TypeError JOB_NAME)
- Chuẩn hóa case-insensitive status kiểm tra `tkStatus === "ok"` trong [useAppBootstrap.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/hooks/useAppBootstrap.ts) & [Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts).
