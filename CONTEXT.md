# ERP Context & Status

## Update - 2026-09-27 (QC / SPECDTC: Tối Ưu Toàn Diện Giao Diện Mobile Tiêu Chuẩn Kỹ Thuật ĐTC)
- Tạo [SPECDTC.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/SPECDTC.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Header tinh gọn [PrecisionSPECDTCMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionSPECDTC/PrecisionSPECDTCMobileHeader.tsx) với live pulse, badge SPEC, nút toggle KPI / Filter Drawer / Reload.
- Micro-KPI bar cuộn ngang [PrecisionSPECDTCMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionSPECDTC/PrecisionSPECDTCMobileKpi.tsx) tóm tắt: Tổng SPEC, Test chủ lực, Dung sai TB, Top Khách hàng.
- Mobile Toolbar 3 hàng công thái học [PrecisionSPECDTCMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionSPECDTC/PrecisionSPECDTCMobileToolbar.tsx): Search input chống zoom iOS (14px) kèm nút clear `[X]`, Touch targets >= 38px, quick pills (All Time, Tra cứu SPEC), dải cuộn ngang tiện ích (EX1, EX2, Lọc cột, Đặt lại).
- Bottom-Sheet Filter Drawer Zero-Blur [PrecisionSPECDTCMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionSPECDTC/PrecisionSPECDTCMobileFilterDrawer.tsx) lọc theo Code KD, Code CMS, Tên Liệu, Mã Liệu, Hạng mục Test, Số YCSX, All Time.
- Bảng AGTable chiếm trọn không gian còn lại (`flex: 1 1 0; min-height: 0; height: 100%`). File chính [SPECDTC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/SPECDTC.tsx).

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
