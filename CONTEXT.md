# ERP Context & Status

## Update - 2026-09-27 (SX / TINH_HINH_CHOT: Tối Ưu Toàn Diện Giao Diện Mobile Tình Hình Chốt Báo Cáo SX)
- **1. Sao Lưu An Toàn**: Tạo file [TINH_HINH_CHOT.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/TINH_HINH_CHOT.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()` chuẩn từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với header công nghiệp, 6 cards KPI lớn, biểu đồ Recharts và chế độ split 2 cột song song.
- **3. Mobile Header Tinh Gọn ([PrecisionTinhHinhChotMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileHeader.tsx))**:
  * Brand badge "04. SX CHỐT BC", chấm Pulse Live xanh lá nhấp nháy, tiêu đề "TÌNH HÌNH CHỐT BC", telemetry chips (NM1 ngày, NM2 ngày, Tồn chưa chốt cảnh báo đỏ nếu > 0, Cập nhật).
  * Nhóm nút thao tác: Nút bật/tắt Micro-KPI `📊 KPI`, Nút bật/tắt Biểu Đồ `📈 Biểu Đồ`, Nút làm mới dữ liệu `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionTinhHinhChotMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileKpi.tsx))**:
  * 6 cards KPI dạng chip cuộn ngang siêu mượt (Tổng Lệnh NM1 & NM2, Tỷ lệ chốt %, Tỷ lệ nhập HS %, Tồn chưa chốt, Tồn chưa nhập HS, So sánh NM1 vs NM2).
  * Nút đóng nhanh `[X]` giải phóng 100% diện tích cho bảng dữ liệu AG-Grid.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionTinhHinhChotMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh 14px (chống zoom Safari iOS) kèm nút Clear `[X]` + nút `Bộ Lọc` (`FiFilter`) kèm badge đếm điều kiện + Segmented switch mini `[NM1 | NM2 | 2 NM]`.
  * Hàng 2: Dải thao tác cuộn ngang (Quick filter Tất cả / Chưa chốt / Chưa nhập HS + Xuất Excel EX1/EX2 + Nút Reload + Bộ đếm dòng `X / Y ngày`).
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionTinhHinhChotMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/PrecisionTinhHinhChotMobileFilterDrawer.tsx))**:
  * Bottom Sheet trượt mượt mà, backdrop tối đặc `rgba(15, 23, 42, 0.75)` không dùng blur, 4 nhóm điều khiển (Nhà máy, Tình trạng chốt BC, Tình trạng nhập HS, Khoảng ngày SX_DATE kèm quick dates) kèm nút "Đặt lại" và "Áp dụng".
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Cập nhật [PrecisionTinhHinhChotGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/PrecisionTinhHinhChotGrid.tsx) ẩn toolbar trong bảng khi ở mobile, mở rộng [useTinhHinhChotData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/useTinhHinhChotData.ts) hỗ trợ lọc đa chiều và expose đầy đủ chỉ số thống kê.
  * File chính [TINH_HINH_CHOT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/TINH_HINH_CHOT.tsx) chỉ 267 dòng, styling tối ưu trong [PrecisionTinhHinhChot.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/PrecisionTinhHinhChot/PrecisionTinhHinhChot.scss).

## Update - 2026-09-27 (SX / BTP_AUTO: Tối Ưu Toàn Diện Giao Diện Mobile Tra Cứu Bán Thành Phẩm Tự Động)
- **1. Sao Lưu An Toàn**: Tạo file [BTP_AUTO.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), mobile header tinh gọn nhấp nháy Live; Micro-KPI bar cuộn ngang; Toolbar 2 hàng; Filter Drawer Zero-Blur 4 nhóm. File chính [BTP_AUTO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.tsx) chỉ 142 dòng.

## Update - 2026-09-27 (QLSX / ACHIVEMENTTB: Tối Ưu Toàn Diện Giao Diện Mobile Bảng Tỷ Lệ Đạt Kế Hoạch Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [ACHIVEMENTTB.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% Desktop (`!isMobile`), mobile header tinh gọn nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng công thái học, Filter Drawer Zero-Blur 3 nhóm. File chính [ACHIVEMENTTB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.tsx) chỉ 164 dòng.

## Update - 2026-09-27 (QLSX / KHOAO: Tối Ưu Toàn Diện Giao Diện Mobile Kho SX Main - Kho Ảo)
- **1. Sao Lưu An Toàn**: Tạo file [KHOAO.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header mobile nhấp nháy Live; Toolbar 2 hàng; Filter Drawer Zero-Blur 4 nhóm. File chính [KHOAO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.tsx) chỉ 218 dòng.
