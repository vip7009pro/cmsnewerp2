# ERP Context & Status

## Update - 2026-09-27 (SX / DAOFILM_REPORT: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Dao Film)
- **1. Sao Lưu An Toàn**: Tạo file [DAOFILM_REPORT.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()`, bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với 3 thẻ widget chỉ số lớn, 2 biểu đồ Recharts tròn và 2 bảng AG-Grid song song (BackData & DetailData).
- **3. Mobile Header Tinh Gọn ([PrecisionDaoFilmReportMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileHeader.tsx))**:
  * Brand badge "04. BÁO CÁO DAO FILM", chấm Pulse Live xanh lá nhấp nháy, tiêu đề "BÁO CÁO DAO FILM", telemetry chips (Dòng `X / Y`, Tổng dao `Total: ...`, Số dao đạt `OK: ...%`, Vượt định mức `NG: ...`).
  * Nhóm nút điều khiển: Bật/tắt Micro-KPI `📊 KPI`, Mở Biểu Đồ `📈 Biểu Đồ`, Làm mới dữ liệu `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionDaoFilmReportMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileKpi.tsx))**:
  * 4 cards micro cuộn ngang (Tổng số dao, Dao đạt chuẩn OK & tỷ lệ %, Dao vượt định mức cảnh báo đỏ, Dao đang chọn) kèm nút đóng nhanh `[X]` giải phóng 100% không gian.
- **5. Mobile Toolbar 3 Hàng Công Thái Học ([PrecisionDaoFilmReportMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileToolbar.tsx))**:
  * Hàng 1: Tab Switcher 2 Bảng (Báo Cáo Dao `{N}` vs Chi Tiết Dập `{N}`).
  * Hàng 2: Ô tìm kiếm thông minh 14px (chống zoom Safari iOS) kèm nút Clear `[X]` + nút `Bộ Lọc` (`FiFilter`) kèm badge đếm điều kiện lọc active.
  * Hàng 3: Dải nút thao tác cuộn ngang (Chip toggle All-Time 2020-nay, Chip mã dao đang chọn, Bộ đếm dòng `X / Y dòng`).
- **6. Zero-Blur GPU-Friendly Filter Drawer & Biểu Đồ Modal**:
  * Bottom Sheet Filter Drawer ([PrecisionDaoFilmReportMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileFilterDrawer.tsx)): Trượt mượt mà, backdrop đặc `rgba(15, 23, 42, 0.75)`, tùy chọn All-Time, quick dates (hôm nay, 3, 7, 30 ngày), khoảng ngày tùy chọn, nút "Đặt lại" và "Áp dụng".
  * Biểu Đồ Modal ([PrecisionDaoFilmReportMobileChartsModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/PrecisionDaoFilmReport/PrecisionDaoFilmReportMobileChartsModal.tsx)): Zero-Blur modal hiển thị 2 biểu đồ tròn Recharts (% sử dụng & Số lần xuất) kèm responsive container và nút đóng.
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Chạm 1 dòng trên Báo Cáo Dao tự động tải chi tiết và chuyển tab mượt mà sang Chi Tiết Dập, kèm thanh banner và nút "⬅ Báo Cáo Tổng Hợp".
  * File chính [DAOFILM_REPORT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.tsx) tối ưu chỉ 299 dòng, module hóa hoàn chỉnh trong thư mục [PrecisionDaoFilmReport](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/PrecisionDaoFilmReport).

## Update - 2026-09-27 (SX / LICHSUDAOFILM: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý & Lịch Sử Dao Film)
- **1. Sao Lưu An Toàn**: Tạo file [DAOFILMDATA.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUDAOFILM/DAOFILMDATA.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header mobile biến thiên mode & nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 3 hàng công thái học, Filter Drawer Zero-Blur 4 nhóm. File chính [DAOFILMDATA.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUDAOFILM/DAOFILMDATA.tsx) chỉ 253 dòng.

## Update - 2026-09-27 (SX / BAOCAOFULLROLL: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Full Roll Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [BAOCAOFULLROLL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header mobile Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng, Filter Drawer Zero-Blur 5 nhóm. File chính [BAOCAOFULLROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.tsx) chỉ 225 dòng.

## Update - 2026-09-27 (SX / BAOCAOTHEOROLL: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Sản Xuất Theo Roll)
- **1. Sao Lưu An Toàn**: Tạo file [BAOCAOTHEOROLL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), toolbar & micro-kpi mobile. File chính [BAOCAOTHEOROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL.tsx) chỉ 218 dòng.

## Update - 2026-09-27 (SX / TINH_HINH_CUON_LIEU: Tối Ưu Toàn Diện Giao Diện Mobile Theo Dõi Tình Hình Cuộn Liệu)
- **1. Sao Lưu An Toàn**: Tạo file [TINHINHCUONLIEU.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header Live, Micro-KPI, Filter Drawer. File chính [TINHINHCUONLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU.tsx) chỉ 188 dòng.

## Update - 2026-09-27 (SX / LICHSUTEMLOTSX: Tối Ưu Toàn Diện Giao Diện Mobile Lịch Sử Tem Lót Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [LICHSUTEMLOTSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header Live, Micro-KPI, Filter Drawer. File chính [LICHSUTEMLOTSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.tsx) chỉ 198 dòng.
