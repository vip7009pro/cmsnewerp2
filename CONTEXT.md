# ERP Context & Status

## Update - 2026-09-27 (QC / IQC / FAILING: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Lô Lỗi QC)
- **1. Sao Lưu An Toàn**: Tạo file [FAILING.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()`, bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với sub-header, 4 KPI cards lớn, sidebar 280px 3-in-1 (IN/OUT/FILTER) và toolbar đầy đủ.
- **3. Mobile Header Tinh Gọn ([PrecisionFailingMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingMobileHeader.tsx))**: Brand badge "QC • IQC", chấm Pulse Live xanh lá nhấp nháy, tiêu đề "QUẢN LÝ LÔ LỖI", telemetry chips (`Dòng: X/Y`, `Pending: N (%)`, `Pass: N (%)`, `Tồn: N`), nhóm nút điều khiển: Bật/tắt Micro-KPI `📊 KPI`, Mở Drawer Thao Tác `⚡ Thao Tác`, Làm mới dữ liệu `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionFailingMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingMobileKpi.tsx))**: 4 thẻ micro cuộn ngang (Tổng lô failing, Đã tái kiểm PASS, Chờ xử lý Pending, Tồn kho liệu failing) kèm nút đóng nhanh `[X]` giải phóng 100% không gian.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionFailingMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh 14px (chống zoom Safari iOS) kèm nút Clear `[X]`, nút Tra Data và nút Bộ Lọc `FiFilter` kèm badge đếm điều kiện lọc active.
  * Hàng 2: Dải chips cuộn ngang (Toggle lọc Lô Pending, Mở form Nhập IN, Mở form Xuất OUT, Tạo mới New Failing, SET PASS, SET FAIL, IQC Confirm, UPDATE NCR ID, SET CLOSED, SET PENDING, Excel EX1, EX2, Bộ đếm dòng).
- **6. Zero-Blur GPU-Friendly Filter Drawer & Action Drawer**:
  * Filter Drawer ([PrecisionFailingMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingMobileFilterDrawer.tsx)): Backdrop đặc `rgba(15, 23, 42, 0.75)`, bộ lọc Nhà Cung Cấp tích hợp [VendorAutocomplete.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/VendorAutocomplete.tsx) cho phép gõ typing tìm kiếm mã/tên NCC tức thì với autoHighlight, tùy chọn CMSV mặc định, toggle lọc lô PENDING, NCR ID, nút "Đặt lại" và "Áp dụng lọc".
  * Action Drawer ([PrecisionFailingMobileActionDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingMobileActionDrawer.tsx)): 3 tabs mượt mà gồm Tab Form Nhập Lô (IN) kèm nút ADD & SAVE, Tab Form Xuất Kho Liệu (OUT) kèm nút XUẤT KHO, Tab Thao Tác Nhanh hàng loạt cho các dòng đã chọn.
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Nâng cấp cả Desktop Sidebar ([PrecisionFailingSidebar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/PrecisionFailingSidebar.tsx)) và Mobile Drawer sang component dùng chung [VendorAutocomplete.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionFAILING/VendorAutocomplete.tsx), popper z-index nổi mượt mà trên modal/drawer.
  * Bảng dữ liệu AGTable tự động co giãn chiếm trọn 100% chiều cao màn hình còn lại.
  * File chính [FAILING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.tsx) chỉ 208 dòng, tất cả các subcomponents đều dưới 275 dòng, hoàn toàn sạch sẽ.

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
