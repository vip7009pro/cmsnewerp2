# ERP Context & Status

## Update - 2026-09-25 (YCSX / AMAZON: Tự Động Điền PROD_REQUEST_NO Khi Bấm "+ Thêm Dữ Liệu AMZ")
- **1. Xử Lý Tự Động Điền Dòng Checked ([YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx))**:
  * Khi người dùng tick chọn 1 dòng YCSX trên bảng và bấm nút `+ THÊM DỮ LIỆU AMZ` ở Header hoặc Tab Amazon, hàm `handleOpenAddAmzModal` tự động lấy `PROD_REQUEST_NO` từ dòng được checked.
  * Tự động gọi `handle_findAmazonCodeInfo(prodReqNo)` để tra cứu thông tin mã sản phẩm, model, cavity và phân loại hàng Amazon đưa vào Modal "NHẬP DỮ LIỆU AMAZON HÀNG LOẠT" ([PrecisionAmzAddModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionAmzAddModal.tsx)).
  * Cảnh báo `Swal.fire` khi người dùng chọn nhiều hơn 1 dòng YCSX; tự động mở form trống nếu không tick chọn dòng nào.
- **2. Tối Ưu Hook & Guard Dữ Liệu ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts))**:
  * Thêm hàm `handleOpenAddAmzModal` quản lý mở modal an toàn, tự động dọn sạch state upload cũ (`uploadExcelJson`, `id_congviec`, `progressvalue`).
  * Guard an toàn cho hàm `handle_findAmazonCodeInfo`: kiểm tra chuỗi rỗng và kiểm tra `response.data.data.length > 0` chống lỗi đọc thuộc tính `undefined`.
- **3. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-25 (SETTING / MOBILE UX: Giao Diện Mobile SettingPage Chuẩn UX/UI Mobile-First)
- Viewport listener `(max-width: 768px)` chuyển đổi Desktop (2 cột) sang Mobile Segmented Tabs ([SettingPage.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/SettingPage.tsx)).
- Mobile Card List View cho danh sách tham số ([PrecisionSettingTable.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingTable.tsx)).
- Tối ưu UX MFA Card & Push Notification ([PrecisionSettingMfaCard.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingMfaCard.tsx)).
- Nút Mở Nhanh Google Authenticator Tích Hợp Trong Ô Nhập OTP ([PrecisionLoginMfaForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/login/PrecisionLogin/PrecisionLoginMfaForm.tsx)).

## Update - 2026-09-25 (AUTH/MFA: Tích Hợp Google Authenticator 2FA TOTP RFC 6238)
- Tách module hóa thư mục `src/pages/setting/PrecisionSetting/`.
- Backend `practice1`: Bổ sung 4 cột bảng `ZTBEMPLINFO`, thuật toán TOTP bằng Node built-in `crypto`.
- Luồng đăng nhập 2FA trên [Login.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/login/Login.tsx).

## Update - 2026-09-25 (YCSX: Sửa Lỗi SweetAlert2 Không Hiển Thị / Bị Hủy Khi Tra Cứu)
- Khắc phục `Swal.close()` tự hủy popup với tham số `isSilent = true` ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts)).
- Khắc phục SweetAlert2 bị che bởi Modal Backdrop (`z-index: 2147483647 !important`).
