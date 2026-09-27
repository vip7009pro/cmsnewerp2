# ERP Context & Status

## Update - 2026-09-27 (SX / LICHSUTEMLOTSX: Tối Ưu Toàn Diện Giao Diện Mobile Lịch Sử Tem Lót Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [LICHSUTEMLOTSX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()` chuẩn từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với header công nghiệp, 6 cards KPI lớn, biểu đồ Recharts và chế độ Grid.
- **3. Mobile Header Tinh Gọn ([PrecisionLichSuTemLotSxMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileHeader.tsx))**:
  * Brand badge "04. SX TEM LÓT", chấm Pulse Live xanh lá nhấp nháy, tiêu đề "LỊCH SỬ TEM LÓT SX", telemetry chips (Bản ghi `X / Y`, Tổng EA, LOT đang chọn).
  * Nhóm nút thao tác: Nút bật/tắt Micro-KPI `📊 KPI`, Nút bật/tắt Biểu Đồ `📈 Biểu Đồ`, Nút làm mới dữ liệu `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionLichSuTemLotSxMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileKpi.tsx))**:
  * 6 cards KPI dạng chip cuộn ngang siêu mượt (Tổng tem đã in, Sản lượng EA, Chiều dài m, Cơ cấu NM1 vs NM2, Chờ chuyển CĐ, Setting & NG CĐ).
  * Nút đóng nhanh `[X]` giải phóng 100% diện tích cho bảng dữ liệu AG-Grid.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionLichSuTemLotSxMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh 14px (chống zoom Safari iOS) kèm nút Clear `[X]` + nút `Bộ Lọc` (`FaFilter`) kèm badge đếm điều kiện lọc active.
  * Hàng 2: Dải thao tác cuộn ngang (Nút Xem & In Tem, Nút Hủy LOT, Xuất Excel EX1/EX2, Bộ đếm dòng `X / Y dòng`, chip LOT đang chọn).
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionLichSuTemLotSxMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxMobileFilterDrawer.tsx))**:
  * Bottom Sheet trượt mượt mà, backdrop tối đặc `rgba(15, 23, 42, 0.75)` không dùng blur, 4 nhóm điều khiển (Khoảng ngày SX kèm quick dates, Code KD & Code ERP, YCSX & LOT SX, Khách hàng) kèm nút "Đặt lại" và "Áp dụng".
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Cập nhật [PrecisionLichSuTemLotSxGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSxGrid.tsx) ẩn toolbar trong bảng khi ở mobile, mở rộng [useLichSuTemLotSxData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/useLichSuTemLotSxData.ts) bổ sung `activeFilterCount` và `resetFilters`.
  * File chính [LICHSUTEMLOTSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.tsx) chỉ 198 dòng, styling tối ưu trong [PrecisionLichSuTemLotSx.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/PrecisionLichSuTemLotSx/PrecisionLichSuTemLotSx.scss).

## Update - 2026-09-27 (SX / TINH_HINH_CHOT: Tối Ưu Toàn Diện Giao Diện Mobile Tình Hình Chốt Báo Cáo SX)
- **1. Sao Lưu An Toàn**: Tạo file [TINH_HINH_CHOT.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/TINH_HINH_CHOT.backup2.tsx).
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header mobile nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng công thái học, Filter Drawer Zero-Blur 4 nhóm. File chính [TINH_HINH_CHOT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/TINH_HINH_CHOT.tsx) chỉ 267 dòng.

## Update - 2026-09-27 (SX / BTP_AUTO: Tối Ưu Toàn Diện Giao Diện Mobile Tra Cứu BTP Tự Động)
- **1. Sao Lưu An Toàn**: Tạo file [BTP_AUTO.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), mobile header tinh gọn nhấp nháy Live; Micro-KPI bar cuộn ngang; Toolbar 2 hàng; Filter Drawer Zero-Blur 4 nhóm. File chính [BTP_AUTO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.tsx) chỉ 142 dòng.

## Update - 2026-09-27 (QLSX / ACHIVEMENTTB: Tối Ưu Toàn Diện Giao Diện Mobile Bảng Tỷ Lệ Đạt Kế Hoạch Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [ACHIVEMENTTB.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% Desktop (`!isMobile`), mobile header tinh gọn nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng công thái học, Filter Drawer Zero-Blur 3 nhóm. File chính [ACHIVEMENTTB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.tsx) chỉ 164 dòng.
