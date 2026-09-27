# ERP Context & Status

## Update - 2026-09-27 (QC / ADDSPECDTC: Fix nút đáy Bottom-Sheet Config bị "chìm")
- Triệu chứng: sau khi refactor mobile, bấm nút Config thì hàng nút dưới cùng của bottom sheet (`Đóng` / `LOAD & Đóng`) bị thanh địa chỉ trình duyệt mobile che mất.
- **Nguyên nhân 1**: `.addspecdtc-drawer-overlay` dùng `position: fixed; inset: 0` ⇒ neo theo **layout viewport** (đáy nằm sau thanh URL). Fix: `height: 100vh` → `height: 100dvh` (dòng `vh` làm fallback) để neo theo **visual viewport**.
- **Nguyên nhân 2**: `.addspecdtc-drawer` là flex-column + `overflow: hidden` nhưng `.drawer-header` mất `flex-shrink: 0`, nên khi body dài header bị bóp và đẩy footer khỏi sheet. Fix: `flex-shrink: 0` cho `.drawer-header` và `.drawer-footer`, `flex: 1 1 auto; min-height: 0; overscroll-behavior: contain` cho `.drawer-body`.
- Phụ: `.drawer` dùng `max-height: 88dvh`; `.drawer-footer` thêm `padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px))` né thanh home iOS.
- Verify 380/430/520/640/740/850px: nút Đóng & LOAD đều nằm trọn trong viewport (`pxBelowViewport = 0`). Build production PASS. File [PrecisionADDSPECDTC.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionADDSPECDTC/PrecisionADDSPECDTC.scss).
- ⚠️ Cùng pattern overlay `inset: 0` + `.drawer-body { flex: 1 }` còn lặp ở ~40 drawer mobile khác (`PrecisionSPECDTC`, `PrecisionKQDTC`, `PrecisionKHOLIEU`, `PrecisionQLVL`, `PrecisionTinhLieu`, `PrecisionPOandStockFull`…) — nếu gặp lỗi tương tự thì áp cùng 2 fix.

## Update - 2026-09-27 (QC / ADDSPECDTC: Tối Ưu Toàn Diện Giao Diện Mobile Thêm SPEC ĐTC)
- Tạo [ADDSPECDTC.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/ADDSPECDTC.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Toolbar 3 hàng [PrecisionADDSPECDTCMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionADDSPECDTC/PrecisionADDSPECDTCMobileToolbar.tsx): Search chống zoom iOS (14px), nút clear `[X]`, Config trigger, NVL/SP toggle, Save, cuộn ngang (EX1/EX2/PIVOT/+Điểm Đo/Xóa).
- Bottom-Sheet Config Drawer Zero-Blur [PrecisionADDSPECDTCMobileConfigDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionADDSPECDTC/PrecisionADDSPECDTCMobileConfigDrawer.tsx): Chứa toàn bộ Sidebar (Autocomplete code/NVL, Test select, Load/Add/Update, Copy XRF, Matrix checklist).
- AGTable chiếm trọn không gian còn lại (`flex: 1 1 0; min-height: 0`). Mobile Status Bar. File chính [ADDSPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/ADDSPECDTC.tsx).

## Update - 2026-09-27 (QC / SPECDTC: Tối Ưu Toàn Diện Giao Diện Mobile Tiêu Chuẩn Kỹ Thuật ĐTC)
- Mobile Header, Micro-KPI, Toolbar 3 hàng, Filter Drawer. File chính [SPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/SPECDTC.tsx).

## Update - 2026-09-27 (QC / KQDTC: Tối Ưu Toàn Diện Giao Diện Mobile Kiểm Tra Độ Tin Cậy & Biểu Đồ SPC)
- Mobile Header, Micro-KPI, Toolbar 3 hàng, Filter Drawer, SPC Charts Modal. File chính [KQDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/KQDTC.tsx).

## Update - 2026-09-27 (KHO / KHOLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Kho Liệu)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính [KHOLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/KHOLIEU.tsx).

## Update - 2026-09-27 (MUA HANG / TINHLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Tính Liệu MRP)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính [TINHLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/TINHLIEU.tsx).

## Update - 2026-09-27 (MUA HANG / QLVL: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Vật Liệu)
- Mobile Header, Micro-KPI, Toolbar, Filter Drawer. File chính [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx).

## Update - 2026-09-27 (SHARED / SCANNER: Tối Ưu Toàn Diện Giao Diện Cyberpunk High-Density SCSS)
- SCSS độc lập, Viewfinder HUD, Modal. File chính [UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx).
