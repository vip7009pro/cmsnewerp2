# ERP Context & Status

## Update - 2026-09-25 (YCSX: Sửa lỗi SweetAlert2 không hiển thị hoặc bị hủy khi tra cứu/thêm/sửa/xóa)
- **1. Khắc phục lỗi Swal.close() tự hủy popup thông báo ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts) & [kdUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/utils/kdUtils.tsx))**:
  * **Root Cause 1**: Trong `handletraYCSX()`, ngay sau khi `await f_traYCSX(...)` trả về, dòng `Swal.close()` được thực thi ngay lập tức. Trong khi đó, `f_traYCSX` vừa mở popup `Swal.fire("Thông báo", "Đã load X dòng", "success")`, khiến popup vừa chớp lên trong chốc lát đã bị `Swal.close()` dập tắt ngay.
  * **Root Cause 2**: Sau khi Thêm mới, Sửa, Xóa, Phê duyệt, Khóa/Mở liệu, Khóa/Mở YCSX, hàm `handletraYCSX()` được gọi lại để reload bảng. Khi đó, `handletraYCSX()` lại mở popup loading `Tra YCSX` đè bẹp lên popup thông báo thành công của hành động vừa thực hiện, rồi `Swal.close()` đóng sạch tất cả.
  * **Fix**: Thêm tham số `isSilent = false` cho `handletraYCSX` và `f_traYCSX`. Khi tra cứu chủ động (`isSilent = false`), hiển thị popup thành công rõ ràng và LOẠI BỎ `Swal.close()`. Khi hệ thống reload ngầm sau Thêm/Sửa/Xóa/Duyệt/Khóa (`isSilent = true`), tải dữ liệu ngầm mà không mở popup đè và không đóng popup thông báo của người dùng.
- **2. Khắc phục nguy cơ SweetAlert2 bị che bởi Modal Backdrop ([PrecisionYCSX.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionYCSX.scss))**:
  * Bổ sung quy tắc ưu tiên tối thượng `body .swal2-container, .swal2-container { z-index: 2147483647 !important; }` đảm bảo popup thông báo lỗi validation hoặc xác nhận luôn nổi trên cùng mọi modal backdrop (z-index: 99999) và autocomplete popper (z-index: 120000).
- **3. Chuẩn hóa luồng Thêm/Sửa/Xóa**:
  * `updateYCSX`: Sửa `f_updateYCSX` trả về mã `err_code` chuẩn xác `OK`/`NG`, đóng modal và thực hiện silent reload.
  * `deleteYCSX`: Hiển thị loading "Đang xóa YCSX...", chờ `f_batchDeleteYCSX` hoàn tất hiển thị thông báo kết quả rồi mới silent reload.
  * `handle_add_1YCSX`: Hoàn tất chèn dữ liệu phụ (P500, P501) trước khi đóng modal và thông báo thành công.
- **4. Xác thực build**: `npm run build` thành công 100% (`code 0`), production bundle hoàn tất không có lỗi.

## Update - 2026-09-25 (PWA: Khắc phục lỗi đăng ký Service Worker khi truy cập route con & icon PWA mờ vỡ)
- **1. Sửa lỗi đăng ký Service Worker trên route con ([index.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/index.tsx))**:
  * Đổi sang absolute path `/service-worker.js` với `{ scope: '/' }`, đảm bảo script Service Worker luôn được tải từ root và scope bao trùm toàn bộ ứng dụng.
- **2. Khắc phục triệt để lỗi icon PWA trên điện thoại bị mờ, vỡ hạt**:
  * Tạo trọn bộ icon chất lượng cao siêu nét `icon-192.png`, `icon-512.png`, `logo192.png`, `logo512.png`, `apple-touch-icon.png` (180x180), `favicon-32x32.png`, `favicon-16x16.png` và adaptive `icon-maskable-192.png`, `icon-maskable-512.png` đạt chuẩn Safe Zone.
  * Cập nhật [manifest.json](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/public/manifest.json), [index.html](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/index.html) và [service-worker.js](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/public/service-worker.js).

## Update - 2026-09-25 (AUTH/BOOTSTRAP: Sửa dứt điểm lỗi kẹt màn hình Login & TypeError JOB_NAME)
- **1. Sửa Root Cause Bootstrap ([useAppBootstrap.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/hooks/useAppBootstrap.ts) & [Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts))**:
  * Chuẩn hóa kiểm tra `tkStatus = String(loginData?.data?.tk_status ?? "").toLowerCase() === "ok"`. Guard an toàn dữ liệu `userData`.
- **2. Khắc phục sự cố kẹt kết nối Load Data & đồng bộ Token/Cookie**:
  * Axios timeout 45s, Axios Response Interceptor bắt 401 & TOKEN_EXPIRED, đồng bộ cookie SameSite/Secure, visibilitychange listener tự làm mới token.

## Update - 2026-09-24 (CUST_MANAGER & QLVL: Sửa modal đóng ngoài ý muốn & tô đỏ nhãn trường trống)
- Sửa `mouseDownTarget` ref cho modal khách hàng và vật liệu; tô đỏ label các trường trống/null; chuẩn hóa payload cast số an toàn.
