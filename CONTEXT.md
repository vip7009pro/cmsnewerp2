# ERP Context & Status

## Update - 2026-09-26 (QLSX / PLAN_NHANH: Tối Ưu Hóa Toàn Diện Giao Diện Mobile Theo Chuẩn `mobile_interface_refactoring`)
- **1. Sao Lưu An Toàn**: Tạo bản sao lưu [PLAN_NHANH.backup.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PLAN_NHANH.backup.tsx) bảo toàn 100% logic và giao diện ban đầu.
- **2. Viewport Conditional Rendering ([PLAN_NHANH.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PLAN_NHANH.tsx))**:
  * Tích hợp hook chuẩn [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), giữ nguyên 100% giao diện & hành vi Desktop (> 768px).
  * Xử lý thông minh trên mobile: Nếu đang ở mode Split 3 thì tự động chuyển sang mode 1 hoặc 2 để chống vỡ layout chiều ngang.
- **3. Header Bar Thích Ứng Công Thái Học ([PrecisionQuickPlanHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanHeader.tsx))**:
  * Rút gọn Brand Title và hiển thị Badge Code & Thống kê YCSX/Plan/SL gọn gàng.
  * Segmented switcher trên mobile chuyển đổi mượt mà giữa 2 tab chính `[📋 Kế Hoạch]` và `[🔍 Tra Cứu YCSX]`.
  * Bổ sung nút toggle `[📐 Hiện/Ẩn Đ.Mức]` giúp người dùng chủ động gập/mở khối định mức để giải phóng tối đa chiều cao cho bảng AGTable.
- **4. Bảo Toàn Khối Định Mức 4 Hàng CĐ1-CĐ4 Bằng Container Cuộn Ngang ([PrecisionQuickPlanDinhMuc.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanDinhMuc.tsx))**:
  * Bọc 4 hàng CĐ1 - CĐ4 và thanh Note vào container `.dinhmuc-scroll-wrapper` (`min-width: 820px; overflow-x: auto; -webkit-overflow-scrolling: touch`).
  * Giữ nguyên 100% kích thước 7 cột định mức chuẩn Excel như Desktop, người dùng pan/cuộn ngang ngón tay nhập liệu mượt mà, tuyệt đối không bị co bóp hay chèn ép ô nhập.
- **5. Cô Đọng Khối YCSX & Zero Blur Bottom Sheet Filter ([PrecisionQuickPlanYCSXSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanYCSXSection.tsx) & [PrecisionQuickPlanMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanMobileFilterDrawer.tsx))**:
  * Thay thế lưới form 12 trường cồng kềnh trên mobile bằng thanh Mobile Omnibar tinh gọn: Ô tìm kiếm nhanh Code KD/ERP + Nút mở bộ lọc (hiển thị badge số lượng filter đang active) + Nút Tìm kiếm.
  * Tách toàn bộ form lọc nhiều trường sang Bottom Sheet Drawer (`PrecisionQuickPlanMobileFilterDrawer.tsx`) với nền đặc `rgba(15, 23, 42, 0.75)` chuẩn Zero Blur, layout 2 cột chạm lớn, input font 14px chống zoom iOS.
  * Toolbar DataGrid và AGTable cuộn ngang mượt mà, tối ưu hiển thị bảng dữ liệu.

## Update - 2026-09-26 (QLSX / PLAN_VISUAL: Khắc Phục Lỗi Cuộn Chi Tiết Kế Hoạch & Tối Ưu Scroll Ngang Định Mức CD1-CD4)
- **1. Sửa Lỗi Định Mức CD1-CD4 Bị Bóp Ríu Rít ([PrecisionPlanDinhMucSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/modal/PrecisionPlanDinhMucSection.tsx))**:
  * Bổ sung container cuộn ngang `.dinhmuc-scroll-wrapper` với `min-width: 840px` và `overflow-x: auto`.
- **2. Khắc Phục Triệt Để Lỗi Kẹt Cuộn Không Thấy Plan Card & List Vật Liệu ([PrecisionMachinePlanModal.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/PrecisionMachinePlanModal.scss))**:
  * Loại bỏ `overflow: hidden`/`height: 100%` ở các container con, chuyển modal body sang `overflow-y: auto` mượt mà và cố định bảng vật tư 300px.

## Update - 2026-09-26 (KD / CUST_MANAGER: Tối Ưu Hóa Toàn Diện Giao Diện Mobile)
- **1. Viewport Conditional Rendering**: Tích hợp [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), giữ nguyên 100% Desktop, tinh gọn toolbar mobile, Action Drawer Bottom Sheet GPU-friendly.

## Update - 2026-09-26 (SKILL / MOBILE INTERFACE REFACTORING: Khởi Tạo Skill Tự Động Tối Ưu Mobile)
- **1. Xây Dựng Skill Chuyên Biệt ([SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md))**: Tự động hóa 100% quy trình tối ưu giao diện ERP cho Mobile bằng Viewport Conditional Rendering (`useIsMobile`), giữ nguyên 100% desktop, action drawer zero blur, chống zoom iOS.
