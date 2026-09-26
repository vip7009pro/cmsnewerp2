# ERP Context & Status

## Update - 2026-09-26 (R&D / BOM_MANAGER: Sửa Triệt Để Lỗi Mất Style Khối Code Banner & Spec Grid Trên Mobile)
- **1. Khắc Phục Selector CSS Scope ([PrecisionBOMManager.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMManager.scss))**:
  * Nguyên nhân: Trước đó toàn bộ rule của `.code-banner`, `.spec-grid`, `.spec-card`, `.field-input`, `.process-panel` bị giới hạn trong selector cha `&__main` (chỉ tồn tại ở Desktop).
  * Khắc phục: Mở rộng selector cha thành `&__main, &__spec-container, .precision-bom__spec-container, .mobile-spec-content` để áp dụng 100% style cho cả Desktop lẫn Mobile.
- **2. Tối Ưu Hiển Thị Thông Số Trên Mobile (Responsive Specs)**:
  * Tinh chỉnh `.code-banner` trên mobile: Giảm font size mã code (`20px`) và tên code (`15px`) cân đối, chống tràn viền.
  * Tinh chỉnh `.spec-grid` trên mobile: Chuyển thành dạng 1 cột dọc (`grid-template-columns: 1fr`), padding card 8px 10px, tăng chiều cao hàng input đạt chuẩn touch di động (min-height 28px, font 12px-13px).
- **3. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-26 (SKILL / MOBILE INTERFACE REFACTORING: Khởi Tạo Skill Tự Động Tối Ưu Mobile)
- **1. Xây Dựng Skill Chuyên Biệt ([SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md))**:
  * Tên skill: `mobile_interface_refactoring` (kèm file đồng bộ [mobile_interface_refactoring.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring.md)).
  * Phương thức cốt lõi: Viewport conditional rendering (`useIsMobile` / `matchMedia("(max-width: 768px)")`), giữ nguyên 100% giao diện và mã nguồn Desktop.
  * Tinh gọn mobile: Chỉ hiển thị ô search chính, nút search và tối đa hóa không gian thao tác cho bảng dữ liệu AGTable.
  * Bộ lọc nhiều trường: Chuyển đổi thành Floating Filter Bar / Drawer Bottom Sheet với badge đếm điều kiện lọc.
  * Công thái học di động: Touch target >= 38px-44px, chống auto-zoom iOS Safari, thanh cuộn ngang mượt mà cho các nút EX1/EX2/PIVOT, zero-blur GPU optimization.
- **2. Tự Động Hóa Workflow**:
  * Người dùng chỉ cần tag skill và tag file, Agent tự động tạo file `.backup.tsx`, triển khai conditional rendering, kiểm tra compile và báo cáo siêu ngắn gọn.

## Update - 2026-09-26 (GLOBAL / UI PERFORMANCE: Xóa Bỏ Triệt Để Toàn Bộ `backdrop-filter: blur` Trên Toàn Dự Án)
- **1. Rà Soát & Thay Thế Toàn Diện 51 Files SCSS/CSS**:
  * Đã quét toàn bộ thư mục `src/` và xóa bỏ 72 thuộc tính `backdrop-filter: blur(...)` / `-webkit-backdrop-filter: blur(...)` tại 51 files (modals, overlays, drawers, sticky headers, boot screen).
  * Giải phóng 100% GPU, tối ưu cuộn chuột và mở modal trên nền bảng AG Grid lớn.
- **2. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-26 (QLSX / PLAN_TABLE: Tối Ưu Hiệu Năng & Khắc Phục Lag Modal Đăng Ký Liệu)
- **1. Triệt Tiêu Nguyên Nhân Gây Lag Do Backdrop Blur ([PrecisionPlanDataTb.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTb.scss))**:
  * Xóa bỏ `backdrop-filter: blur(4px)`, chuyển sang nền đặc `rgba(15, 23, 42, 0.82)`, bổ sung GPU isolation.
- **2. Tối Ưu Component & Re-render ([PrecisionPlanDataTbDangKyLieuModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTbDangKyLieuModal.tsx))**:
  * Bọc component bằng `React.memo` và `useCallback`.
- **3. Tối Ưu Tốc Độ Nút "Lưu CT + ĐKXL"**: Dùng API gộp 1 request `f_luuChiThiVaDangKyXuatLieuFast`.
