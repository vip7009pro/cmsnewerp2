# ERP Context & Status

## Update - 2026-09-27 (KHO / KHOLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Kho Liệu)
- Tạo [KHOLIEU.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/KHOLIEU.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Header tinh gọn [PrecisionKHOLIEUMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileHeader.tsx) với live pulse, telemetry badge và nút toggle Micro-KPI / Filter Drawer / Reload.
- Micro-KPI bar cuộn ngang [PrecisionKHOLIEUMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileKpi.tsx) tóm tắt nhanh: Tổng cuộn/mã, Tổng sản lượng quy đổi, Tổng lô NCC/mã liệu, Cảnh báo FIFO/Holding.
- Mobile Toolbar 3 hàng công thái học [PrecisionKHOLIEUMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileToolbar.tsx): Search input chống zoom iOS (14px) kèm nút clear `[X]`, Touch targets >= 38px, Chuyển mode segmented (DATA NHẬP / DATA XUẤT / TỒN KHO), dải pills lọc nhanh (Tồn > 0, All Time, Nút mở modal Nhập Liệu / Xuất Liệu, EX1/EX2/Pivot, Bật/tắt lọc cột).
- Bottom-Sheet Filter Drawer Zero-Blur [PrecisionKHOLIEUMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileFilterDrawer.tsx) lọc theo từ khóa, khoảng ngày (hoặc All Time), Tên Liệu, Mã Liệu, Model KD, Số YCSX, PLAN ID, STT Cuộn, Tồn > 0 và In nhanh PVN.
- Tích hợp Modals Nhập/Xuất/Pivot trực tiếp trong [KHOLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/KHOLIEU.tsx), xử lý dứt điểm lỗi import 500 runtime.
- Bảng AGTable chiếm trọn không gian còn lại (`flex: 1 1 0; min-height: 0; height: 100%`).

## Update - 2026-09-27 (MUA HANG / TINHLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Tính Liệu MRP)
- Tạo [TINHLIEU.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/TINHLIEU.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Header tinh gọn [PrecisionTinhLieuMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileHeader.tsx) với live pulse, telemetry badge và nút toggle Micro-KPI / Filter.
- Micro-KPI bar cuộn ngang [PrecisionTinhLieuMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileKpi.tsx).
- Mobile Toolbar 3 hàng công thái học [PrecisionTinhLieuMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileToolbar.tsx).
- Bottom-Sheet Filter Drawer Zero-Blur [PrecisionTinhLieuMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileFilterDrawer.tsx). File chính [TINHLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/TINHLIEU.tsx).

## Update - 2026-09-27 (MUA HANG / QLVL: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Danh Mục Vật Liệu)
- Tạo [QLVL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Header tinh gọn [PrecisionQLVLMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileHeader.tsx).
- Micro-KPI bar cuộn ngang [PrecisionQLVLMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileKpi.tsx).
- Mobile Toolbar 3 hàng công thái học [PrecisionQLVLMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileToolbar.tsx).
- Bottom-Sheet Filter Drawer Zero-Blur [PrecisionQLVLMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileFilterDrawer.tsx). File chính [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx).

## Update - 2026-09-27 (SHARED / SCANNER: Tối Ưu Toàn Diện Giao Diện Cyberpunk High-Density SCSS)
- Chuyển toàn bộ sang SCSS độc lập [UniversalScanner.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.scss) và [Scanner.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.scss).
- Viewfinder HUD bo góc 18px viền tối, 4 góc ngắm Neon Cyan [UniversalScannerHUD.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerHUD.tsx).
- Dialog [UniversalScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerModal.tsx) bo cong 16px, đổ bóng chiều sâu 25px.
- [Scanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.tsx) & [CAMERASCANNER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/SCANBARCODE/CAMERASCANNER.tsx).

## Update - 2026-09-27 (SX / DATASAMPLESX: Tối Ưu Toàn Diện Giao Diện Mobile Khai Báo & Chụp Ảnh Sample SX)
- Tạo [DATASAMPLESX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% Desktop.
- Mobile Header [PrecisionDataSampleSxMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileHeader.tsx).
- Thanh tiến độ [PrecisionDataSampleSxMobileStatusBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileStatusBar.tsx).
- Form [PrecisionDataSampleSxForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxForm.tsx), Upload box [PrecisionDataSampleSxImageUploadBox.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImageUploadBox.tsx).
- File chính [DATASAMPLESX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.tsx).

## Update - 2026-09-27 (SX / KPI_NV: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo KPI Nhân Viên SX)
- Tạo [KPI_NVSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop.
- Header Live pulse, Micro-KPI cuộn ngang, Toolbar 3 hàng, Filter Drawer Zero-Blur. File chính [KPI_NVSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.tsx).
