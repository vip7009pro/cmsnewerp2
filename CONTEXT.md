# ERP Context & Status

## Update - 2026-09-27 (SX / PATROL: Tối Ưu Toàn Diện Giao Diện Mobile Giám Sát Chất Lượng Trực Tiếp)
- **1. Sao Lưu An Toàn**: Tạo file [PATROL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()`, bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với header TV Telemetry, Toolbar chuyển chế độ, Lanes sự cố phân hệ (PQC3, DTC, INS) và modal preview ảnh phóng to.
- **3. Mobile Header Tinh Gọn ([PrecisionPatrolMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PrecisionPATROL/PrecisionPatrolMobileHeader.tsx))**:
  * Brand badge "SX • PATROL", chip Live hôm nay (chấm đỏ pulse nhấp nháy) vs Lịch Sử ngày.
  * Telemetry chips: tổng số sự cố `⚡ N`, bộ đếm auto-refresh `⏳ Ns` (chạm bật/tắt tạm dừng).
  * Nhóm nút điều khiển: Bật/tắt Micro-KPI `📊 KPI`, Mở Drawer Lọc `⚙`, Làm mới dữ liệu tức thì `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionPatrolMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PrecisionPATROL/PrecisionPatrolMobileKpi.tsx))**:
  * 4 thẻ micro cuộn ngang (Tổng Sự Cố, Lỗi PQC3, Độ Tin Cậy DTC, Ngoại Quan INS) có thể chạm lọc nhanh từng phân hệ, kèm nút đóng `[X]` giải phóng 100% không gian.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionPatrolMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PrecisionPATROL/PrecisionPatrolMobileToolbar.tsx))**:
  * Hàng 1: Ô input tìm kiếm 14px (chống zoom Safari iOS) kèm icon kính lúp, nút xóa nhanh `[X]` + nút `Bộ Lọc` (`FiFilter`) kèm badge đếm điều kiện lọc active.
  * Hàng 2: Dải chip lọc phân hệ (Tất cả, PQC3, DTC, INS), chuyển layout (Lưới Dọc Grid vs Hàng Ngang Lanes), bộ đếm `X/Y thẻ`.
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionPatrolMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PrecisionPATROL/PrecisionPatrolMobileFilterDrawer.tsx))**:
  * Backdrop đặc `rgba(15, 23, 42, 0.75)`, chuyển đổi chế độ Live vs Lịch Sử ngày, quick dates (hôm nay, hôm qua, 3 ngày, 7 ngày), khoảng ngày tùy chọn, chọn phân hệ sự cố, toggle bật/tắt Auto Refresh 10s, nút "Mặc định" và "Áp dụng lọc".
- **7. Clean Code & Tối Ưu Thẻ Sự Cố ([PrecisionPATROL.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PrecisionPATROL/PrecisionPATROL.scss))**:
  * Tách riêng hook chuẩn hóa & tìm kiếm [usePatrolCards.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PrecisionPATROL/usePatrolCards.ts), lọc realtime đa trường (sản phẩm, lỗi, máy, khách hàng, mã NV).
  * Thẻ sự cố co giãn 100% width trên mobile, ảnh tỷ lệ đẹp, căn chỉnh nhãn lỗi 2 hàng rõ ràng.
  * File chính [PATROL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.tsx) chỉ 272 dòng, tất cả subcomponents đều dưới 300 dòng.

## Update - 2026-09-27 (QC / IQC / FAILING: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý Lô Lỗi QC)
- **1. Sao Lưu An Toàn**: Tạo file [FAILING.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), Autocomplete search NCC, Header nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng, Filter Drawer & Action Drawer 3 tabs Zero-Blur GPU-friendly. File chính [FAILING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.tsx) chỉ 208 dòng.

## Update - 2026-09-27 (SX / DAOFILM_REPORT: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Dao Film)
- **1. Sao Lưu An Toàn**: Tạo file [DAOFILM_REPORT.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header Live, Micro-KPI bar cuộn ngang, Toolbar 3 hàng, Filter Drawer & Charts Modal Recharts Zero-Blur. File chính [DAOFILM_REPORT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.tsx) chỉ 299 dòng.

## Update - 2026-09-27 (SX / LICHSUDAOFILM: Tối Ưu Toàn Diện Giao Diện Mobile Quản Lý & Lịch Sử Dao Film)
- Tạo file [DAOFILMDATA.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUDAOFILM/DAOFILMDATA.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, toolbar 3 hàng, Filter Drawer Zero-Blur 4 nhóm. File chính [DAOFILMDATA.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUDAOFILM/DAOFILMDATA.tsx) chỉ 253 dòng.

## Update - 2026-09-27 (SX / BAOCAOFULLROLL: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Full Roll Sản Xuất)
- Tạo file [BAOCAOFULLROLL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.backup2.tsx). Hook `useIsMobile()`, bảo toàn 100% desktop, header Live, Micro-KPI bar, Toolbar 2 hàng, Filter Drawer. File chính [BAOCAOFULLROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.tsx) chỉ 225 dòng.
