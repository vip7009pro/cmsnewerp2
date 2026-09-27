# ERP Context & Status

## Update - 2026-09-27 (SHARED / SCANNER: Tối Ưu Toàn Diện Giao Diện Cyberpunk High-Density SCSS)
- **1. Khắc Phục Lỗi Giao Diện**: Do Tailwind CSS bị vô hiệu hóa trong dự án, các nút và thanh điều khiển trước đó bị vỡ layout và hiển thị thô. Đã chuyển toàn bộ sang hệ thống SCSS độc lập [UniversalScanner.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.scss) và [Scanner.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.scss).
- **2. Thiết Kế Viewfinder HUD Hiện Đại**:
  * Khung ngắm Viewfinder bo góc 18px với hiệu ứng viền tối (vignette dark mask) làm nổi bật mã cần quét.
  * 4 góc ngắm Neon Cyan sắc nét ([UniversalScannerHUD.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerHUD.tsx)), tia laser quét chuyển động mượt mà, chuyển xanh ngọc khi bắt mã thành công.
  * Cụm nút Glassmorphism phía trên: Nút Flash sáng vàng khi bật, nút Lật camera và Dropdown chọn camera nền tối mờ.
  * Thanh Zoom phía dưới: Cụm pill segmented bo tròn `1x`, `2x`, `3x` cùng 2 nút `-` và `+` tinh chỉnh mượt mà.
- **3. Tinh Chỉnh Header Modal ([UniversalScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerModal.tsx))**:
  * Header tối giản với icon QR badge xanh dương, tiêu đề 13px bold, subtitle 11px gọn gàng chống vỡ dòng.
  * Hộp thoại Dialog bo cong 16px, viền mờ 1px và đổ bóng chiều sâu 25px cao cấp.
- **4. Nâng Cấp Trang Quét Độc Lập**:
  * [Scanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.tsx) & [CAMERASCANNER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/SCANBARCODE/CAMERASCANNER.tsx) hoàn toàn sử dụng SCSS, hiển thị kết quả thẻ card công nghiệp kèm nút sao chép tiện lợi.

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
