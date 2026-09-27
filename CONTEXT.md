# ERP Context & Status

## Update - 2026-09-27 (QC / IQC / HOLDING: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Vật Liệu Holding)
- Tạo backup [HOLDING.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/HOLDING.backup2.tsx). Hook `useIsMobile` (matchMedia 768px), bảo toàn 100% desktop.
- Mobile Toolbar 2 hàng [PrecisionHoldingMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionHOLDING/PrecisionHoldingMobileToolbar.tsx): search 14px chống zoom iOS + clear `[X]` + nút Tra Data + nút Bộ Lọc (badge đếm filter); dải chips cuộn ngang (PASS / FAIL / NCR / Reason / EX1 / EX2 + counter).
- Filter Drawer [PrecisionHoldingMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionHOLDING/PrecisionHoldingMobileFilterDrawer.tsx): Bottom Sheet Zero-Blur chứa 9 trường (All Time, Từ ngày, Tới ngày, Tên Liệu, Mã Liệu CMS, LOT CMS, Trạng Thái, NCR ID, Hold ID) + footer Đặt Lại / Áp Dụng.
- Ẩn Header, KPI Cards, Sidebar trên mobile (conditional rendering JSX). Bảng AG Grid chiếm trọn không gian. File chính [HOLDING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/HOLDING.tsx).

## Update - 2026-09-27 (QC / IQC / BLOCK: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Lô Bị Khóa)
- Mobile Toolbar 2 hàng, Filter Drawer Zero-Blur 7 trường. File chính [BLOCK.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/BLOCK.tsx).

## Update - 2026-09-27 (QC / TEST_TABLE: Tối Ưu Mobile Quản Lý Hạng Mục ĐTC)
- Segmented Tabs MASTER–DETAIL 2 panel → 2 tab, auto-switch, Toolbar 2 hàng. File chính [TEST_TABLE.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/TEST_TABLE.tsx).

## Update - 2026-09-27 (QC / DTCRESULT: Tối Ưu Mobile Nhập Kết Quả Đo ĐTC)
- Bottom-Sheet Phiếu Nhập KQ, Micro-KPI compact. File chính [DTCRESULT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/DTCRESULT.tsx).

## Update - 2026-09-27 (QC / DKDTC: Tối Ưu Mobile Đăng Ký Test ĐTC)
- Bottom-Sheet Register tái sử dụng Sidebar, fix Scanner z-index. File chính [DKDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/DKDTC.tsx).

## Update - 2026-09-27 (QC / ADDSPECDTC: Tối Ưu Mobile Thêm SPEC ĐTC)
- Mobile Toolbar 3 hàng, Config Drawer, fix nút đáy bị thanh URL che. File chính [ADDSPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/ADDSPECDTC.tsx).

## Update - 2026-09-27 (QC / SPECDTC: Tối Ưu Mobile Tiêu Chuẩn Kỹ Thuật ĐTC)
- Mobile Header, Micro-KPI, Toolbar 3 hàng, Filter Drawer. File chính [SPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/SPECDTC.tsx).

## Update - 2026-09-27 (QC / KQDTC: Tối Ưu Mobile Kiểm Tra Độ Tin Cậy & Biểu Đồ SPC)
- Mobile Header, Micro-KPI, Toolbar 3 hàng, Filter Drawer, SPC Charts Modal. File chính [KQDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/KQDTC.tsx).

## Update - 2026-09-27 (KHO / KHOLIEU + MUA HANG / TINHLIEU + QLVL: Tối Ưu Mobile)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính: [KHOLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/KHOLIEU.tsx), [TINHLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/TINHLIEU.tsx), [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx).

## Update - 2026-09-27 (SHARED / SCANNER: SCSS Cyberpunk + Viewfinder HUD)
- File chính [UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx).

## Pitfalls Đã Xử Lý (Tham Khảo Nhanh)
- `.component_element` khóa `height:100%` → cần `height:auto!important` cho mobile root
- `inset: 0` dùng layout viewport → dùng `100dvh` + `env(safe-area-inset-bottom)` cho drawer footer
- Scanner z-index 1300 bị drawer 10000 che → prop `zIndex` tùy chỉnh
- Flex item `min-content` bóp chữ → `min-width:0; white-space:nowrap`
- DTC.scss `overflow:hidden!important` block `@media 5000px` cắt mobile → override `@media 768px`
