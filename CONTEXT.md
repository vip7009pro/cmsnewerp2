# ERP Context & Status

## Update - 2026-09-27 (SX / DATASAMPLESX: Tối Ưu Toàn Diện Giao Diện Mobile Khai Báo & Chụp Ảnh Sample SX)
- **1. Sao Lưu An Toàn**: Tạo file [DATASAMPLESX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn nguyên vẹn 100% giao diện Desktop (`!isMobile`) gồm header công nghiệp đầy đủ breadcrumb, title lớn, telemetry pills và form desktop.
- **3. Mobile Header Tinh Gọn ([PrecisionDataSampleSxMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileHeader.tsx))**:
  * Brand badge "SX • SAMPLE QC" (chấm xanh pulse), telemetry chips `CT: {planId}`, `NV: {shortEmplName}`.
  * Nút quét Barcode/QR nhanh `📷 Quét`, nút làm mới form `🔄`.
- **4. Mobile Status / Checklist Bar ([PrecisionDataSampleSxMobileStatusBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileStatusBar.tsx))**:
  * Thanh tiến độ 3 bước: 1. Chỉ Thị (Hợp lệ/Chờ) -> 2. Nhân Sự (Đã xác nhận/Chưa) -> 3. Ảnh Mẫu ({fileCount}/2 Ảnh).
- **5. Nâng Cấp Form & Tách Module Upload ([PrecisionDataSampleSxForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxForm.tsx), [PrecisionDataSampleSxImageUploadBox.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImageUploadBox.tsx))**:
  * Input 15px chống zoom Safari iOS, nút Clear `[X]` cho ô PLAN_ID và Mã NV.
  * Hỗ trợ 2 chế độ: Chụp trực tiếp bằng Camera (`capture="environment"`) và Chọn từ Thư viện ảnh.
  * Modal LightBox xem ảnh toàn màn hình ([PrecisionDataSampleSxImagePreviewModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImagePreviewModal.tsx)) kiểm tra độ rõ nét trước khi upload.
- **6. Sticky Bottom Submit Bar ([PrecisionDataSampleSxMobileBottomBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileBottomBar.tsx))**:
  * Cố định ở đáy màn hình điện thoại (fixed bottom, zero-blur GPU-friendly), hiển thị trạng thái sẵn sàng và nút "LƯU DỮ LIỆU & TẢI ẢNH" 44px dễ bấm một tay.
- **7. Clean Code**: File chính [DATASAMPLESX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.tsx) chỉ 144 dòng, toàn bộ subcomponents dưới 250 dòng.

## Update - 2026-09-27 (SX / KPI_NV: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo KPI Nhân Viên SX)
- Tạo [KPI_NVSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live pulse, Micro-KPI cuộn ngang, Toolbar 3 hàng, Filter Drawer Zero-Blur. File chính [KPI_NVSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.tsx) 214 dòng.

## Update - 2026-09-27 (SX / MAINDEFECTS: Tối Ưu Toàn Diện Giao Diện Mobile Thư Viện Tiêu Chuẩn Lỗi SX)
- Tạo [MAINDEFECTS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live telemetry, Micro-KPI bar cuộn ngang, Toolbar 3 hàng, Filter Drawer Zero-Blur, Tab Switcher. File chính [MAINDEFECTS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.tsx) 236 dòng.

## Update - 2026-09-27 (SX / PATROL: Tối Ưu Toàn Diện Giao Diện Mobile Giám Sát Chất Lượng Trực Tiếp)
- Tạo [PATROL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live telemetry, Micro-KPI bar cuộn ngang, Toolbar 2 hàng, Filter Drawer Zero-Blur, chuyển đổi Lanes vs Grid. File chính [PATROL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.tsx) 272 dòng.

## Update - 2026-09-27 (QC / IQC / FAILING: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Lô Lỗi QC)
- Tạo [FAILING.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Autocomplete search NCC, Header Live, Micro-KPI bar, Toolbar 2 hàng, Filter & Action Drawer 3 tabs Zero-Blur. File chính [FAILING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.tsx) 208 dòng.
