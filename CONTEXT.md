# ERP Context & Status

## Update - 2026-09-27 (SX / BAOCAOFULLROLL: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Full Roll Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [BAOCAOFULLROLL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()` chuẩn từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với header công nghiệp, toolbar đa trường lọc & segmented switch, KPI cards lớn, biểu đồ Recharts, summary metric 3 hệ đơn vị và AG-Grid.
- **3. Mobile Header Tinh Gọn ([PrecisionBaoCaoFullRollMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileHeader.tsx))**:
  * Brand badge "06. FULL ROLL", chấm Pulse Live xanh lá nhấp nháy, tiêu đề "BÁO CÁO FULL ROLL", telemetry chips (Dòng `X / Y`, Tổng cấp liệu `In: ... m`, Thành phẩm `OK: ... m`, Tỷ lệ `Yield: ...%`, Cân chỉnh `ST: ...%`).
  * Nhóm nút điều khiển: Nút bật/tắt Micro-KPI `📊 KPI`, Nút bật/tắt Biểu Đồ `📈 Biểu Đồ`, Nút làm mới dữ liệu `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionBaoCaoFullRollMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileKpi.tsx))**:
  * 6 cards KPI dạng chip cuộn ngang siêu mượt (Cấp liệu m / Xuất kho m, Đã dập m / Yield %, Thành phẩm m / EA, Cân chỉnh m / Setting loss %, Lỗi CĐ m / NG loss %, Kiểm tra đạt m / Inspect OK rate %).
  * Nút đóng nhanh `[X]` giải phóng 100% diện tích cho bảng dữ liệu.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionBaoCaoFullRollMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh 14px (chống zoom Safari iOS) kèm nút Clear `[X]` + nút `Bộ Lọc` (`FaFilter`) kèm badge đếm điều kiện lọc active.
  * Hàng 2: Dải thao tác cuộn ngang (Nút Xuất Excel EX1 lọc, EX2 tất cả, Bộ đếm dòng `X / Y dòng`).
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionBaoCaoFullRollMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollMobileFilterDrawer.tsx))**:
  * Bottom Sheet trượt mượt mà, backdrop tối đặc `rgba(15, 23, 42, 0.75)` không dùng blur, 5 nhóm điều khiển (Khoảng ngày kèm quick dates hôm nay/3/7/30 ngày & All Time, Nhà máy & Máy Line, Code KD/ERP, Tên/Mã Liệu, Số YCSX/Chỉ thị/Khách hàng) kèm nút "Đặt lại" và "Áp dụng".
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Bổ sung `isMobile` prop vào [PrecisionBaoCaoFullRollGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRollGrid.tsx), mở rộng [useBaoCaoFullRollData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/useBaoCaoFullRollData.ts) bổ sung `activeFilterCount` và `resetFilters`.
  * File chính [BAOCAOFULLROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.tsx) chỉ 225 dòng, styling tối ưu trong [PrecisionBaoCaoFullRoll.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/PrecisionBaoCaoFullRoll/PrecisionBaoCaoFullRoll.scss).

## Update - 2026-09-27 (SX / BAOCAOTHEOROLL: Tối Ưu Toàn Diện Giao Diện Mobile Báo Cáo Sản Xuất Theo Roll)
- **1. Sao Lưu An Toàn**: Tạo file [BAOCAOTHEOROLL.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), mobile header nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng công thái học, Filter Drawer Zero-Blur 2 nhóm. File chính [BAOCAOTHEOROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL.tsx) chỉ 218 dòng.

## Update - 2026-09-27 (SX / TINH_HINH_CUON_LIEU: Tối Ưu Toàn Diện Giao Diện Mobile Theo Dõi Tình Hình Cuộn Liệu)
- **1. Sao Lưu An Toàn**: Tạo file [TINHINHCUONLIEU.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), mobile header nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng, Filter Drawer Zero-Blur 4 nhóm. File chính [TINHINHCUONLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU.tsx) chỉ 188 dòng.

## Update - 2026-09-27 (SX / LICHSUTEMLOTSX: Tối Ưu Toàn Diện Giao Diện Mobile Lịch Sử Tem Lót Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [LICHSUTEMLOTSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), mobile header nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng công thái học, Filter Drawer Zero-Blur 4 nhóm. File chính [LICHSUTEMLOTSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.tsx) chỉ 198 dòng.
