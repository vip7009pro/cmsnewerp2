# ERP Context & Status

## Update - 2026-09-26 (QLSX / PLAN_TABLE: Tối Ưu Tốc Độ Nút "Lưu CT + ĐKXL" Chuẩn PLANVISUAL)
- **1. Đồng Bộ Hóa Xử Lý Bằng API Siêu Tốc `f_luuChiThiVaDangKyXuatLieuFast`**:
  * Thay thế chuỗi gọi tuần tự nhiều request chậm (`f_saveChiThiMaterialTable` + `f_handleDangKyXuatLieu`) bằng API gộp 1 request duy nhất `f_luuChiThiVaDangKyXuatLieuFast` (gọi endpoint `luuChiThiVaDangKyXuatLieu` đã tối ưu backend trong `sanxuatService.js`).
  * Áp dụng đồng bộ cho cả [usePlanDataTbOldData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/usePlanDataTbOldData.ts) (phục vụ [PLAN_TABLE.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_TABLE.tsx)) và [usePlanDataTbData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/usePlanDataTbData.ts) (phục vụ [PLAN_DATATB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_DATATB.tsx)).
- **2. Tối Ưu UX & Phản Hồi Tiến Độ Realtime**:
  * Hiển thị thanh tiến trình trực quan (20% -> 70% -> 90% -> 100%) tránh cảm giác đơ/treo ứng dụng.
  * Tự động gửi thông báo hệ thống `f_insert_Notification_Data` và broadcast qua Socket.IO `notification_panel`.
  * Khắc phục triệt để việc tải lại bảng 2 lần liên tiếp gây giật lag; dọn sạch dòng chọn `clearSelectedMaterialRows()`.
  * Cập nhật nút gọi trực tiếp trong [PrecisionPlanDataTbDangKyLieuModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTbDangKyLieuModal.tsx).
- **3. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-25 (YCSX / AMAZON: Tự Động Điền PROD_REQUEST_NO Khi Bấm "+ Thêm Dữ Liệu AMZ")
- **1. Xử Lý Tự Động Điền Dòng Checked ([YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx))**:
  * Khi người dùng tick chọn 1 dòng YCSX trên bảng và bấm nút `+ THÊM DỮ LIỆU AMZ` ở Header hoặc Tab Amazon, hàm `handleOpenAddAmzModal` tự động lấy `PROD_REQUEST_NO` từ dòng được checked.
  * Tự động gọi `handle_findAmazonCodeInfo(prodReqNo)` để tra cứu thông tin mã sản phẩm, model, cavity và phân loại hàng Amazon đưa vào Modal "NHẬP DỮ LIỆU AMAZON HÀNG LOẠT" ([PrecisionAmzAddModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionAmzAddModal.tsx)).
- **2. Tối Ưu Hook & Guard Dữ Liệu ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts))**:
  * Dọn sạch state upload cũ (`uploadExcelJson`, `id_congviec`, `progressvalue`). Guard an toàn cho chuỗi rỗng và kiểm tra `response.data.data.length > 0`.
- **3. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-25 (SETTING / MOBILE UX: Giao Diện Mobile SettingPage Chuẩn UX/UI Mobile-First)
- Viewport listener `(max-width: 768px)` chuyển đổi Desktop sang Mobile Segmented Tabs ([SettingPage.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/SettingPage.tsx)).
- Mobile Card List View cho danh sách tham số ([PrecisionSettingTable.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingTable.tsx)).
- Tối ưu UX MFA Card & Push Notification ([PrecisionSettingMfaCard.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/setting/PrecisionSetting/PrecisionSettingMfaCard.tsx)).

## Update - 2026-09-25 (AUTH/MFA: Tích Hợp Google Authenticator 2FA TOTP RFC 6238)
- Tách module hóa thư mục `src/pages/setting/PrecisionSetting/`.
- Backend `practice1`: Bổ sung 4 cột bảng `ZTBEMPLINFO`, thuật toán TOTP bằng Node built-in `crypto`.
- Luồng đăng nhập 2FA trên [Login.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/login/Login.tsx).
