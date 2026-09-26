# ERP Context & Status

## Update - 2026-09-26 (GLOBAL / UI PERFORMANCE: Xóa Bỏ Triệt Để Toàn Bộ `backdrop-filter: blur` Trên Toàn Dự Án)
- **1. Rà Soát & Thay Thế Toàn Diện 51 Files SCSS/CSS**:
  * Đã quét toàn bộ thư mục `src/` và phát hiện 72 thuộc tính `backdrop-filter: blur(...)` / `-webkit-backdrop-filter: blur(...)` tại 51 files (modals, overlays, drawers, backdrops, sticky headers, boot screen).
  * Xóa bỏ hoàn toàn tất cả các thuộc tính blur này: giải phóng 100% tài nguyên GPU khỏi việc liên tục tính toán Gaussian blur khi người dùng cuộn chuột, rê chuột hoặc mở modal trên nền bảng dữ liệu AG Grid nặng.
  * Tinh chỉnh nền [PrecisionHeader.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/PrecisionHeader/PrecisionHeader.scss) sang `#ffffff` đặc sạch giúp cuộn trang siêu mượt.
  * Chuyển các overlay modal (nhân sự, QC, R&D, kho, kinh doanh, sản xuất) sang nền dim & focus `rgba(...)` sắc nét, nhẹ GPU.
- **2. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-26 (QLSX / PLAN_TABLE: Tối Ưu Hiệu Năng & Khắc Phục Lag Modal Đăng Ký Liệu)
- **1. Triệt Tiêu Nguyên Nhân Gây Lag Do Backdrop Blur ([PrecisionPlanDataTb.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTb.scss))**:
  * Xóa bỏ `backdrop-filter: blur(4px)` và `filter: blur(3px)`.
  * Chuyển sang nền tối đặc sắc nét `rgba(15, 23, 42, 0.82)`. Thêm `isolation: isolate`, `contain: layout style`, `will-change: transform`.
- **2. Tối Ưu Component & Re-render ([PrecisionPlanDataTbDangKyLieuModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTbDangKyLieuModal.tsx))**:
  * Bọc component bằng `React.memo` và `useCallback`.
  * Dọn sạch dummy functions trong [usePlanDataTbData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/usePlanDataTbData.ts).
- **3. Tối Ưu Tốc Độ Nút "Lưu CT + ĐKXL" Chuẩn PLANVISUAL**:
  * Dùng API gộp 1 request `f_luuChiThiVaDangKyXuatLieuFast` (lưu chỉ thị + đăng ký xuất liệu O300/O301).

## Update - 2026-09-25 (YCSX / AMAZON: Tự Động Điền PROD_REQUEST_NO Khi Bấm "+ Thêm Dữ Liệu AMZ")
- **1. Xử Lý Tự Động Điền Dòng Checked ([YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx))**:
  * Khi tick chọn 1 dòng YCSX trên bảng và bấm nút `+ THÊM DỮ LIỆU AMZ`, tự động lấy `PROD_REQUEST_NO` tra cứu thông tin mã sản phẩm đưa vào Modal ([PrecisionAmzAddModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionAmzAddModal.tsx)).
- **2. Tối Ưu Hook & Guard Dữ Liệu ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts))**:
  * Dọn sạch state upload cũ; guard an toàn chuỗi rỗng và kiểm tra `response.data.data.length > 0`.
