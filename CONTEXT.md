# ERP Context & Status

## Update - 2026-09-27 (SX / KPI_NV: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo KPI Nhân Viên SX)
- **1. Sao Lưu An Toàn**: Tạo file [KPI_NVSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) gồm header công nghiệp, toolbar đầy đủ chu kỳ/thời gian, dải 6 KPI cards, 4 biểu đồ Recharts và bảng AGTable.
- **3. Mobile Header Tinh Gọn ([PrecisionKpiNvSxMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/PrecisionKpiNvSx/PrecisionKpiNvSxMobileHeader.tsx))**:
  * Brand badge "SX • KPI NV" (chấm xanh pulse), telemetry chip `⚡ {uniqueEmpl} NV ({option})`.
  * Nhóm nút điều khiển: Bật/tắt Micro-KPI `📊 KPI`, Mở Drawer Lọc `⚙ Lọc` (badge số lượng), Làm mới dữ liệu tức thì `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionKpiNvSxMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/PrecisionKpiNvSx/PrecisionKpiNvSxMobileKpi.tsx))**:
  * 6 thẻ micro cuộn ngang (Tổng Mét TT/KH, Tổng EA TT/KH, Đạt Mét BQ %, Đạt EA BQ %, Quy mô nhân sự, Top 1 Performer) kèm nút đóng `[X]` giải phóng 100% không gian.
- **5. Mobile Toolbar 3 Hàng Công Thái Học ([PrecisionKpiNvSxMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/PrecisionKpiNvSx/PrecisionKpiNvSxMobileToolbar.tsx))**:
  * Hàng 1: Switcher 3 tab (Bảng Dữ Liệu, Biểu Đồ & KPI, Tất Cả).
  * Hàng 2: Ô search 14px chống zoom Safari iOS, nút Clear `[X]`, nút Bộ Lọc (badge count), nút Tải dữ liệu KPI.
  * Hàng 3: Dải nút thao tác ngang mượt mà: chip chu kỳ hiện tại, chip toggle nhanh All-Time, nút xuất Excel `EX1` (Lọc), `EX2` (Tất cả), badge đếm số lượng bản ghi.
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionKpiNvSxMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/PrecisionKpiNvSx/PrecisionKpiNvSxMobileFilterDrawer.tsx))**:
  * Backdrop đặc `rgba(15, 23, 42, 0.75)`, chọn chu kỳ (Daily, Weekly, Monthly, Yearly), toggle All Time, quick dates (1D, 7D, 30D, 90D), khoảng ngày Từ - Đến, nút "Mặc định" và "Áp dụng lọc".
- **7. Clean Code & Tối Ưu Bảng ([PrecisionKpiNvSxGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/PrecisionKpiNvSx/PrecisionKpiNvSxGrid.tsx), [PrecisionKpiNvSx.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/PrecisionKpiNvSx/PrecisionKpiNvSx.scss))**:
  * Tích hợp `isMobile` vào grid, ẩn thanh toolbar trùng lặp trên mobile để nhường 100% diện tích cho bảng dữ liệu AGTable. File chính [KPI_NVSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.tsx) chỉ 214 dòng, các subcomponents đều dưới 190 dòng.

## Update - 2026-09-27 (SX / MAINDEFECTS: Tối Ưu Toàn Diện Giao Diện Mobile Thư Viện Tiêu Chuẩn Lỗi SX)
- Tạo [MAINDEFECTS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live telemetry, Micro-KPI bar cuộn ngang, Toolbar 3 hàng, Filter Drawer Zero-Blur, Tab Switcher. File chính [MAINDEFECTS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.tsx) 236 dòng.

## Update - 2026-09-27 (SX / PATROL: Tối Ưu Toàn Diện Giao Diện Mobile Giám Sát Chất Lượng Trực Tiếp)
- Tạo [PATROL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live telemetry, Micro-KPI bar cuộn ngang, Toolbar 2 hàng, Filter Drawer Zero-Blur, chuyển đổi Lanes vs Grid. File chính [PATROL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.tsx) 272 dòng.

## Update - 2026-09-27 (QC / IQC / FAILING: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Lô Lỗi QC)
- Tạo [FAILING.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Autocomplete search NCC, Header Live, Micro-KPI bar, Toolbar 2 hàng, Filter & Action Drawer 3 tabs Zero-Blur. File chính [FAILING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.tsx) 208 dòng.

## Update - 2026-09-27 (SX / DAOFILM_REPORT: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Dao Film)
- Tạo [DAOFILM_REPORT.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, Header Live, Micro-KPI bar, Toolbar 3 hàng, Filter Drawer & Charts Modal Recharts Zero-Blur. File chính [DAOFILM_REPORT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.tsx) 299 dòng.
