# ERP Context & Status

## Update - 2026-09-26 (QLSX / PLAN_TABLE: Sắp Xếp Toolbar Mobile 3 Hàng Trực Quan & Nâng Cấp Nút Màu Stitch Enterprise)
- **1. Đưa Nút "Tra PLAN" Lên Cùng Hàng Với Chọn Ngày & Máy**:
  * [PrecisionPlanDataTbToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTbToolbar.tsx): Tổ chức Hàng 1 gồm `[NGÀY fromdate]` + `[MÁY machine]` + `[XƯỞNG factory]` + `[🔍 Tra PLAN]` liền mạch trên cùng 1 hàng, tối ưu kích thước trường để không tràn màn hình.
- **2. Bổ Sung Ô Nhập "MOVE TO Date" & Các Nút Thao Tác Trực Tiếp**:
  * Hàng 2: `[MOVE TO todate]` + `[🔁 MOVE PLAN]` (amber gradient) + `[⚡ QUICK PLAN]` (indigo gradient).
  * Hàng 3: Dải nút thao tác & in ấn cuộn ngang đầy đủ: `[💾 Lưu PLAN]` (blue) + `[🖨️ In Chỉ Thị]` (cyan) + `[📑 In Combo]` (blue) + `[📐 Bản Vẽ]` (orange) + `[📊 SAVE Excel]` (emerald green) + `[🗑️ DELETE PLAN]` (red).
- **3. Khắc Phục Triệt Để Lỗi Nút Trắng Đen / Không Có Màu ([PrecisionPlanDataTb.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/PrecisionPlanDataTb.scss))**:
  * Đưa toàn bộ định nghĩa `.tb-btn` và các biến thể màu gradient (`--primary`, `--amber`, `--indigo`, `--danger`, `--success`, `--cyan`, `--orange`) ra cấp độ root toolbar, gán `!important` để chống ghi đè style HTML mặc định.
- **4. Bảo Toàn 100% Desktop & Zero Blur**:
  * Màn hình Desktop vẫn giữ nguyên 100% layout chuẩn. Không dùng `backdrop-filter: blur`, bảo đảm hiệu năng tối đa cho bảng AG Grid.
- **5. Production Build**: `yarn build` thành công 100% (exit code 0).

## Update - 2026-09-26 (QLSX / PLAN_NHANH: Tối Ưu Hóa Mobile)
- **1. Viewport Rendering**: [PLAN_NHANH.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PLAN_NHANH.tsx), switch 2 tab mobile `[📋 Kế Hoạch]` / `[🔍 Tra Cứu YCSX]`, container `.dinhmuc-scroll-wrapper` (`min-width: 820px; overflow-x: auto`) pan ngón tay mượt mà.
- **2. Mobile Omnibar & Filter Drawer**: [PrecisionQuickPlanMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanMobileFilterDrawer.tsx) Zero Blur.

## Update - 2026-09-26 (QLSX / PLAN_VISUAL: Khắc Phục Lỗi Cuộn Chi Tiết & Scroll Định Mức)
- **1. Sửa Lỗi Định Mức CD1-CD4 Bị Bóp**: Container cuộn ngang `.dinhmuc-scroll-wrapper` (`min-width: 840px; overflow-x: auto`).
- **2. Khắc Phục Kẹt Cuộn Modal**: Modal body `overflow-y: auto`, cố định bảng vật tư 300px.

## Update - 2026-09-26 (SKILL / MOBILE INTERFACE REFACTORING)
- Xây dựng Skill chuẩn dự án [SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md) tự động hóa tối ưu Mobile với `useIsMobile`, Zero Blur, bảo toàn 100% desktop.
