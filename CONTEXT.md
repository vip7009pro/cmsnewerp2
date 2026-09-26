# ERP Context & Status

## Update - 2026-09-26 (KD / CUST_MANAGER: Tối Ưu Hóa Toàn Diện Giao Diện Mobile Theo Chuẩn `mobile_interface_refactoring`)
- **1. Sao Lưu Toàn Diện**: Tạo bản sao lưu [CUST_MANAGER.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/CUST_MANAGER.backup2.tsx) bảo toàn 100% logic và giao diện ban đầu.
- **2. Viewport Conditional Rendering ([CUST_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/CUST_MANAGER.tsx))**:
  * Tích hợp hook chuẩn [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Giữ nguyên 100% giao diện và mã nguồn Desktop (`!isMobile`).
  * Trên Mobile: Ẩn Sub-Header banner và khối Realtime KPI Cards, giải phóng 100% diện tích chiều cao viewport cho bảng AGTable.
- **3. Toolbar Thích Ứng Di Động ([PrecisionCustToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm Omnibar to rõ, font 14px chống zoom iOS Safari kèm nút Clear [X], nút "+ Thêm" nhanh và nút "⚡ Tác Vụ".
  * Hàng 2: Dải cuộn ngang trượt mượt mà chứa 5 chips phân loại (Tất cả, KH, NCC, USE, OFF) và các phím tắt nhanh (Sửa, Load, EX1, EX2, PIVOT).
- **4. Mobile Action Drawer Bottom Sheet ([PrecisionCustMobileActionDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustMobileActionDrawer.tsx))**:
  * Bottom sheet trượt từ dưới lên, hiển thị thông tin đối tác đang chọn trên bảng.
  * Đầy đủ nghiệp vụ: Thêm mới, Sửa hồ sơ đang chọn, Tải lại dữ liệu, Xuất Excel EX1/EX2, Phân tích Pivot.
  * Chuẩn Zero Blur: Nền đặc `rgba(15, 23, 42, 0.75)` tối ưu GPU di động, touch target >= 44px.
- **5. Tối Ưu Modal Form & Style Mobile ([PrecisionCustManager.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/PrecisionCustManager/PrecisionCustManager.scss))**:
  * Modal tự co giãn dạng bottom sheet trên mobile, form 1 cột dọc, input/select cao 38px font 14px chống Safari zoom.
- **6. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0, 67.89s).

## Update - 2026-09-26 (R&D / BOM_MANAGER: Sửa Triệt Để Lỗi Mất Style Khối Code Banner & Spec Grid Trên Mobile)
- **1. Khắc Phục Selector CSS Scope ([PrecisionBOMManager.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/bom_manager/PrecisionBOMManager/PrecisionBOMManager.scss))**:
  * Mở rộng selector cha thành `&__main, &__spec-container, .precision-bom__spec-container, .mobile-spec-content` để áp dụng 100% style cho cả Desktop lẫn Mobile.
- **2. Tối Ưu Hiển Thị Thông Số Trên Mobile (Responsive Specs)**:
  * Tinh chỉnh `.code-banner` và `.spec-grid` trên mobile: Chuyển dạng 1 cột dọc, input touch chuẩn di động (min-height 28px, font 12px-13px).
- **3. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0).

## Update - 2026-09-26 (SKILL / MOBILE INTERFACE REFACTORING: Khởi Tạo Skill Tự Động Tối Ưu Mobile)
- **1. Xây Dựng Skill Chuyên Biệt ([SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md))**:
  * Phương thức cốt lõi: Viewport conditional rendering (`useIsMobile`), bảo toàn 100% giao diện desktop.
  * Tinh gọn mobile: Tối đa hóa bảng AGTable, chuyển tác vụ/filter sang Bottom Sheet Drawer, chống zoom iOS Safari, zero blur GPU.
- **2. Tự Động Hóa Workflow**: Tự động backup `.backup.tsx`, triển khai code, kiểm tra compile và báo cáo siêu ngắn gọn.
