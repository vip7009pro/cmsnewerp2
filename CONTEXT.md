# ERP Context & Status

## Update - 2026-09-26 (QLSX / PLAN_VISUAL: Khắc Phục Lỗi Cuộn Chi Tiết Kế Hoạch & Tối Ưu Scroll Ngang Định Mức CD1-CD4)
- **1. Sửa Lỗi Định Mức CD1-CD4 Bị Bóp Ríu Rít ([PrecisionPlanDinhMucSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/modal/PrecisionPlanDinhMucSection.tsx) & [PrecisionMachinePlanModal.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/PrecisionMachinePlanModal.scss))**:
  * Bổ sung container cuộn ngang `.dinhmuc-scroll-wrapper` với `min-width: 840px` và `overflow-x: auto` (`-webkit-overflow-scrolling: touch`).
  * Giữ nguyên 100% bố cục 7 cột định mức rộng rãi như Desktop; người dùng di động có thể pan/cuộn ngang mượt mà để xem và nhập số liệu từng công đoạn (EQ, Setting, UPH, Step, Loss SX, Loss ST, Factory, Note).
  * Tăng chiều cao input/select lên 26px font 11.5px giúp thao tác ngón tay chạm chuẩn xác, không bị đè chữ.
- **2. Khắc Phục Triệt Để Lỗi Kẹt Cuộn Không Thấy Plan Card & List Vật Liệu ([PrecisionMachinePlanModal.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/PrecisionMachinePlanModal.scss))**:
  * Xóa bỏ triệt để các thuộc tính `overflow: hidden` và `height: 100%` bị kẹt ở các container con (`&__splitContent`, `&__rightPane`, `&__detailContent`, `.bottom-plan-material-row`), chuyển sang `display: flex; flex-direction: column; height: auto; overflow: visible`.
  * `.precision-plan-modal__body` trở thành container cuộn dọc mượt mà trên mobile (`overflow-y: auto; -webkit-overflow-scrolling: touch; padding-bottom: 40px`).
  * Cố định chiều cao bảng vật tư `.material-table-container` ở 300px và thanh công cụ vật tư cuộn ngang, giúp hiển thị trọn vẹn Plan Card cùng bảng đăng ký xuất liệu ở dưới cùng.
- **3. Kiểm Tra Toàn Diện**: Vite production build thành công 100% (exit code 0, 71.92s).

## Update - 2026-09-26 (KD / CUST_MANAGER: Tối Ưu Hóa Toàn Diện Giao Diện Mobile Theo Chuẩn `mobile_interface_refactoring`)
- **1. Sao Lưu Toàn Diện**: Tạo bản sao lưu [CUST_MANAGER.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/CUST_MANAGER.backup2.tsx) bảo toàn 100% logic và giao diện ban đầu.
- **2. Viewport Conditional Rendering ([CUST_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/custManager/CUST_MANAGER.tsx))**:
  * Tích hợp hook chuẩn [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), giữ nguyên 100% giao diện Desktop.
  * Tinh gọn toolbar mobile, Action Drawer Bottom Sheet GPU-friendly, modal responsive; Vite build thành công 100%.

## Update - 2026-09-26 (SKILL / MOBILE INTERFACE REFACTORING: Khởi Tạo Skill Tự Động Tối Ưu Mobile)
- **1. Xây Dựng Skill Chuyên Biệt ([SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md))**:
  * Tự động hóa 100% quy trình tối ưu giao diện ERP cho Mobile bằng Viewport Conditional Rendering (`useIsMobile`), giữ nguyên 100% desktop, tối đa hóa không gian bảng, action drawer zero blur, chống zoom iOS.
