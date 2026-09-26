# ERP Context & Status

## Update - 2026-09-26 (QLSX: Tối Ưu Toàn Diện Giao Diện Mobile Cửa Sổ Modal In Chỉ Thị Sản Xuất)
- **1. Sao Lưu An Toàn**: Đã tạo các bản backup:
  * [PrecisionPlanPrintModals.backup.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/modal/PrecisionPlanPrintModals.backup.tsx) (Dành cho [PLANVISUAL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PLANVISUAL.tsx))
  * [PrecisionPlanDataTbPrintModals.backup.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTbPrintModals.backup.tsx) (Dành cho [PLAN_TABLE.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_TABLE.tsx))
- **2. Full-Screen Native App Window Trên Mobile ([PrecisionMachinePlanModal.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/Machine/PrecisionMachine/PrecisionMachinePlanModal.scss), [PrecisionPlanDataTb.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTb.scss))**:
  * Backdrop chiếm trọn màn hình (`padding: 0; background: rgba(15, 23, 42, 0.88)` Zero Blur), modal window mở rộng `100vw x 100dvh`, border-radius 0 cho không gian xem tối đa.
  * Hỗ trợ đóng nhanh khi chạm ngoài backdrop trên mobile (`onClick` backdrop + `stopPropagation` window).
- **3. Header & Toolbar 2 Tầng Công Thái Học**:
  * Header thu gọn thanh lịch, icon 26px, tiêu đề rút gọn ellipsis, nút X bo tròn dễ chạm.
  * Tầng 1: Bộ điều khiển số dòng/trang (`max-lieu-control`) + nút Nạp lại bản in gọn gàng.
  * Tầng 2: Nút **IN BẢN NÀY (PRINT)** toàn chiều ngang màu xanh ngọc lục bảo (Emerald gradient) cao 36px, chạm cực nhạy.
- **4. Khắc Phục Triệt Để Lỗi Mất Nửa Trái Bản In A4 & Scroll Ngang Mượt Mà**:
  * Chuyển layout canvas/body sang `display: block; text-align: left; overflow-x: auto; -webkit-overflow-scrolling: touch;`. Loại bỏ căn giữa làm lệch âm lề trái.
  * Khổ giấy A4 210mm (`.print-paper-sheet`) giữ nguyên vẹn 100% kích thước chuẩn, cho phép pan/cuộn ngang ngón tay từ mép trái qua mép phải mà không bị co rúm méo mó.
  * Bổ sung thanh banner hướng dẫn trực quan: `👉 Vuốt ngang để xem toàn bộ khổ in A4`.
- **5. Đồng Bộ & Kiểm Tra**: Đồng bộ luôn cho [PrecisionQuickPlan.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlan.scss); `yarn build` thành công 100% (exit code 0).

## Update - 2026-09-26 (QLSX / PLAN_TABLE: Toolbar 3 Hàng & Button Style Stitch Enterprise)
- Hàng 1: Nút Tra PLAN cùng hàng với Ngày + Máy; Hàng 2: MOVE TO date + MOVE PLAN + QUICK PLAN; Hàng 3: Cuộn ngang dải action buttons màu gradient nổi bật có bóng đổ.

## Update - 2026-09-26 (QLSX / PLAN_NHANH: Tối Ưu Mobile)
- Switcher 2 tab `[📋 Kế Hoạch]` / `[🔍 Tra Cứu YCSX]`, pan ngang định mức `.dinhmuc-scroll-wrapper` 820px, Omnibar và drawer Zero Blur.

## Update - 2026-09-26 (SKILL / MOBILE INTERFACE REFACTORING)
- Skill chuẩn dự án [SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md) tối ưu hóa giao diện di động ERP.
