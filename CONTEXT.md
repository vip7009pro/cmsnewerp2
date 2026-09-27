# ERP Context & Status

## Update - 2026-09-27 (MUA HANG / QLVL: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Danh Mục Vật Liệu)
- Tạo [QLVL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`).
- Mobile Header tinh gọn [PrecisionQLVLMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileHeader.tsx) với live pulse, telemetry badge và nút toggle Micro-KPI / Filter.
- Micro-KPI bar cuộn ngang [PrecisionQLVLMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileKpi.tsx) tóm tắt nhanh: Tổng mã, Đang dùng, Chuẩn FSC, Hồ sơ kỹ thuật TDS/MSDS và Đơn giá TB.
- Mobile Toolbar 3 hàng công thái học [PrecisionQLVLMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileToolbar.tsx): Search input chống zoom iOS (14px) kèm nút clear `[X]`, Touch targets >= 38px, dải pills lọc nhanh (USE_YN, FSC, Docs) và nút xuất EX1/EX2/PIVOT.
- Bottom-Sheet Filter Drawer Zero-Blur [PrecisionQLVLMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileFilterDrawer.tsx) lọc theo từ khóa, Vendor, USE_YN, FSC và Hồ sơ kỹ thuật.
- Bảng AGTable chiếm trọn không gian còn lại (`flex: 1 1 0; min-height: 0; height: 100%`). File chính [QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx) 390 dòng.

## Update - 2026-09-27 (SHARED / SCANNER: Tối Ưu Toàn Diện Giao Diện Cyberpunk High-Density SCSS)
- Chuyển toàn bộ sang SCSS độc lập [UniversalScanner.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.scss) và [Scanner.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.scss).
- Viewfinder HUD bo góc 18px viền tối, 4 góc ngắm Neon Cyan [UniversalScannerHUD.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerHUD.tsx), tia laser quét mượt mà.
- Cụm nút Flash, Lật camera, Dropdown camera và thanh Zoom `1x`, `2x`, `3x` cùng slider.
- Dialog [UniversalScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerModal.tsx) bo cong 16px, đổ bóng chiều sâu 25px.
- [Scanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.tsx) & [CAMERASCANNER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/SCANBARCODE/CAMERASCANNER.tsx) hoàn toàn sử dụng SCSS, hiển thị kết quả thẻ card công nghiệp.

## Update - 2026-09-27 (SX / DATASAMPLESX: Tối Ưu Toàn Diện Giao Diện Mobile Khai Báo & Chụp Ảnh Sample SX)
- Tạo [DATASAMPLESX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% Desktop (`!isMobile`).
- Mobile Header tinh gọn [PrecisionDataSampleSxMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileHeader.tsx) với telemetry chips.
- Thanh tiến độ 3 bước [PrecisionDataSampleSxMobileStatusBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileStatusBar.tsx).
- Form [PrecisionDataSampleSxForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxForm.tsx), Upload box [PrecisionDataSampleSxImageUploadBox.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImageUploadBox.tsx), LightBox xem ảnh [PrecisionDataSampleSxImagePreviewModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImagePreviewModal.tsx).
- Sticky Bottom Submit Bar [PrecisionDataSampleSxMobileBottomBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileBottomBar.tsx). File chính [DATASAMPLESX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.tsx) 144 dòng.

## Update - 2026-09-27 (SX / KPI_NV: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo KPI Nhân Viên SX)
- Tạo [KPI_NVSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live pulse, Micro-KPI cuộn ngang, Toolbar 3 hàng, Filter Drawer Zero-Blur. File chính [KPI_NVSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.tsx) 214 dòng.

## Update - 2026-09-27 (SX / MAINDEFECTS: Tối Ưu Toàn Diện Giao Diện Mobile Thư Viện Tiêu Chuẩn Lỗi SX)
- Tạo [MAINDEFECTS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live telemetry, Micro-KPI bar cuộn ngang, Toolbar 3 hàng, Filter Drawer Zero-Blur. File chính [MAINDEFECTS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.tsx) 236 dòng.

## Update - 2026-09-27 (SX / PATROL: Tối Ưu Toàn Diện Giao Diện Mobile Giám Sát Chất Lượng Trực Tiếp)
- Tạo [PATROL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live telemetry, Micro-KPI bar cuộn ngang, Toolbar 2 hàng, Filter Drawer Zero-Blur. File chính [PATROL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.tsx) 272 dòng.
