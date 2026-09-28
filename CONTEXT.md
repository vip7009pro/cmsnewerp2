# ERP Context & Status

## Update - 2026-09-28 (QC / IQC / NCR_MANAGER: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Biên Bản Bất Thường NCR)
- Tạo backup [NCR_MANAGER.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/NCR_MANAGER.backup2.tsx). Hook `isMobile` (matchMedia 768px), bảo toàn 100% desktop.
- Mobile Header [PrecisionNCRMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCRMobileHeader.tsx): brand badge "NCR" + pulse Online + toggle KPI + Bộ Lọc (badge đếm filter) + NEW NCR + Refresh + Fullscreen.
- Mobile KPI [PrecisionNCRMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCRMobileKpi.tsx): 4 chip cuộn ngang (Tổng, Đóng+%, Pending, Hold R/m), ẩn mặc định.
- Mobile Toolbar 2 hàng [PrecisionNCRMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCRMobileToolbar.tsx): search 14px chống zoom iOS + clear `[X]` + nút Tra + Enter; dải chips cuộn ngang (Pending toggle, COMPLETED, PENDING, Export, EX1, EX2, PIVOT + counter).
- Filter Drawer [PrecisionNCRMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCRMobileFilterDrawer.tsx): Bottom Sheet Zero-Blur 8 trường (Từ ngày, Tới ngày, Tên Liệu, Mã Liệu CMS, Vendor, LOT CMS, Vendor LOT, Pending) + footer Đặt Lại / Áp Dụng 44px.
- Register Sheet [PrecisionNCRMobileRegisterSheet.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCRMobileRegisterSheet.tsx): Bottom Sheet Zero-Blur redesigned form mobile-first — 4 section cards (Vật liệu, Thời gian 2-col grid, Mô tả lỗi, Người kiểm tra) + lookup tag chips + footer cố định ADD DÒNG / LƯU NCR 44px.
- Ẩn Header, KPI Cards, Sidebar 260px trên mobile (conditional rendering JSX). File chính [NCR_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/NCR_MANAGER.tsx).

### Bổ sung (đợt 20) — MASTER→DETAIL mobile: Ảnh lỗi + bảng Holding hiện ngay dưới dòng vừa tap
Yêu cầu: trên mobile trước đây không thấy khối **Ảnh Lỗi (Defect Image)** và **Holding – Failing Detail**; user muốn tap 1 dòng ⇒ chi tiết hiện bên dưới và cuộn xuống xem.
- **Root cause (quan trọng)**: `div.precision-ncr-mobile-scrollable` (JSX đã có từ trước) **không hề có rule CSS nào** ⇒ `display:block`, cao bằng toolbar (87px). Vì nó là block formatting context nên `.precision-ncr-mobile-grid { flex:1 1 auto; min-height:0 }` **vô hiệu**, còn `.agtable` là `position:absolute` (out-of-flow) ⇒ grid-container/wrapper cao **0px** ⇒ bảng và khối chi tiết bị "biến mất" dù DOM có.
- Fix SCSS [PrecisionNCR.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionNCR/PrecisionNCR.scss): **§10.0** `.precision-ncr-mobile-scrollable` = vùng cuộn duy nhất (`flex:1 1 auto; min-height:0; overflow-y:auto`); **§10.4** `.precision-ncr-mobile-grid` đổi sang chiều cao xác định `height:56vh; min-height:300px` (modifier `.has-detail` ⇒ `38vh/220px` để nhường chỗ chi tiết); **§10.4b** `.precision-ncr-mobile-detail` + override `.precision-ncr-right-panel` (`width:100%; overflow:visible`) và 2 card (`defect-image-card` ảnh 200px, `holding-detail-card` cao 380px).
- Fix TSX [NCR_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/NCR_MANAGER.tsx): `mobileDetailRef` + `handleMobileRowClick` (setSelectedNCR → tra Holding → `scrollIntoView({behavior:"smooth", block:"start"})` sau 120ms), grid nhận thêm class `has-detail`, detail gắn `ref`. Backup `NCR_MANAGER.backup3.tsx` + `PrecisionNCR.backup3.scss`.
- **Quyết định kiến trúc**: KHÔNG mở page-level scroll cho root (giữ `height:100%; overflow:hidden`) vì `.tabs-container`/`.tab-pane` của IQC đều `overflow:hidden` ⇒ mở ra sẽ bị cắt cụt (pitfall DTC.scss). Thay vào đó scroll **nội bộ** trong `.precision-ncr-mobile-scrollable`.
- Đo @393×850 (dev 3001): grid 476px (chưa chọn) → khi tap dòng: `has-detail` 38vh ⇒ grid 220px, detail 685px, panel 669px, ảnh lỗi 281px (preview 200px), holding card 380px; auto-scroll khớp `detailTop 164 ≈ viewTop 156`. `bodyOverflowX = 0` tại @360/393/414/768/1440. Desktop @1440: sidebar 260 / center 820 / rightPanel 320 nguyên vẹn, `.is-mobile` không có trong DOM.
- `npm run build` OK (`✓ built in 1m 32s`), `get_errors` 0 lỗi.

## Update - 2026-09-27 (QC / IQC / HOLDING: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Vật Liệu Holding)
- Mobile Toolbar 2 hàng, Filter Drawer Zero-Blur 9 trường. File chính [HOLDING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/HOLDING.tsx).

## Update - 2026-09-27 (QC / IQC / BLOCK: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Lô Bị Khóa)
- Mobile Toolbar 2 hàng, Filter Drawer Zero-Blur 7 trường. File chính [BLOCK.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/BLOCK.tsx).

## Update - 2026-09-27 (QC / DTC: Tối Ưu Mobile TEST_TABLE, DTCRESULT, DKDTC, ADDSPECDTC, SPECDTC, KQDTC)
- Segmented Tabs, Bottom-Sheet, Filter Drawers. Xem ROADMAP.md cho chi tiết từng file.

## Update - 2026-09-27 (KHO / KHOLIEU + MUA HANG / TINHLIEU + QLVL: Tối Ưu Mobile)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. Xem ROADMAP.md cho chi tiết.

## Update - 2026-09-27 (SHARED / SCANNER: SCSS Cyberpunk + Viewfinder HUD)
- File chính [UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx).

## Pitfalls Đã Xử Lý (Tham Khảo Nhanh)
- `.component_element` khóa `height:100%` → cần `height:auto!important` cho mobile root
- `inset: 0` dùng layout viewport → dùng `100dvh` + `env(safe-area-inset-bottom)` cho drawer footer
- Scanner z-index 1300 bị drawer 10000 che → prop `zIndex` tùy chỉnh
- Flex item `min-content` bóp chữ → `min-width:0; white-space:nowrap`
- DTC.scss `overflow:hidden!important` block `@media 5000px` cắt mobile → override `@media 768px`
