# ERP Context & Status

## Update - 2026-09-25 (AUTH/BOOTSTRAP: Sửa dứt điểm lỗi kẹt màn hình Login & TypeError JOB_NAME)
- **1. Sửa Root Cause Bootstrap ([useAppBootstrap.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/hooks/useAppBootstrap.ts) & [Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts))**:
  * Chuẩn hóa kiểm tra `tkStatus = String(loginData?.data?.tk_status ?? "").toLowerCase() === "ok"`.
  * Guard an toàn dữ liệu người dùng `userData = loginData?.data?.data`: chỉ truy cập `userData.JOB_NAME` và `userData.POSITION_CODE` khi có `userData` hợp lệ. Nếu không có hoặc status khác OK, chủ động reset state sạch sẽ thay vì ném lỗi TypeError làm crash block catch rồi logout ngược ra màn hình Login.
- **2. Khắc phục sự cố kẹt kết nối Load Data & đồng bộ Token/Cookie**:
  * Đặt `axios.defaults.timeout = 45000` (45s) trong [Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts): giải quyết triệt để lỗi cạn kiệt 6 TCP sockets của trình duyệt gây kẹt request khi có truy vấn lag.
  * Thêm Axios Response Interceptor tập trung: bắt mã `401` và `{ tk_status: "TOKEN_EXPIRED" }`, hiển thị cảnh báo và điều hướng logout sạch sẽ.
  * Chuẩn hóa Cookie Token trong hàm `login()` với `sameSite: "lax"`, `secure` khớp với `Home.tsx`.
- **3. Tối ưu Interval Refresh Token ([Home.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/home/Home.tsx))**:
  * Chỉ gọi `checkWebVer` và `getchamcong` khi `document.visibilityState === "visible"`.
  * Thêm listener `visibilitychange`: Tự động làm mới token ngay lập tức khi máy tính thức dậy từ Sleep hoặc quay lại tab sau hơn 60s.
- **4. Xác thực build**: `npm run build` thành công 100% (`code 0`), hoàn tất đóng gói production không có lỗi TypeScript.

## Update - 2026-09-24 (CUST_MANAGER: Sửa modal đối tác đóng ngoài ý muốn khi vuốt chuột & tô đỏ nhãn trường trống/null)
- **1. Sửa modal đóng ngoài ý muốn ([PrecisionCustModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustModal.tsx))**: Dùng `mouseDownTarget` ref chỉ đóng khi chủ động click trực tiếp vào vùng mờ overlay ngoài modal.
- **2. Tô đỏ Label các trường trống/null ([PrecisionCustModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustModal.tsx) & SCSS)**: Helper `isFieldEmpty(val)` nhận diện null/rỗng, font đậm `#dc2626` kèm dấu `*` đỏ đồng bộ 16 trường.

## Update - 2026-09-24 (QLVL: Sửa modal đóng ngoài ý muốn khi vuốt chuột & tô đỏ nhãn trường trống/null)
- **1. Sửa modal đóng ngoài ý muốn ([CustomDialog.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Dialog/CustomDialog.tsx))**: Áp dụng `mouseDownTarget` cho cả Modal Thêm/Sửa vật liệu và Hồ sơ Kỹ thuật (VLDOC) trong [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx).
- **2. Tô đỏ Label các trường trống/null**: Áp dụng `.qlvl-form-label--invalid` cho 11 trường; cho phép xóa trắng input số thời gian thực.
- **3. Chuẩn hóa payload ([QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx))**: Cast số an toàn, validate M_NAME. Build production thành công.

## Update - 2026-09-23 (BOM MANAGER: Tinh gọn sidebar 1 dòng, nút NEW chuẩn không rỗng)
- **Sidebar 1 dòng ([PrecisionBOMSidebar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMSidebar.tsx))**: 5 nút `NEW`, `ADD`, `ADD VER`, `UP LOẠT`, `UPDATE` vào 1 hàng ngang.
- **Nút NEW chuẩn & Check BOM ([useBOMManagerData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/useBOMManagerData.ts))**: Tự sinh mã `ITEM_YYMMDD_HHmmss`, gán `QL_HSD='N'`, tô đỏ nhãn thiếu thông tin.
