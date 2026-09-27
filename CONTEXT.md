# ERP Context & Status

## Update - 2026-09-27 (SX / BTP_AUTO: Tối Ưu Toàn Diện Giao Diện Mobile Tra Cứu Bán Thành Phẩm Tự Động)
- **1. Sao Lưu An Toàn**: Tạo file [BTP_AUTO.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Tích hợp hook `useIsMobile()` chuẩn từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`) với header công nghiệp, 5 cards KPI lớn và toolbar grid.
- **3. Mobile Header Tinh Gọn ([PrecisionBtpAutoMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/PrecisionBtpAutoMobileHeader.tsx))**:
  * Brand badge "04. SX BTP", chấm Pulse Live xanh lá nhấp nháy 2s, tiêu đề "TRA CỨU BTP", chips telemetry (Chế độ Detail/Summary, Số dòng, Cập nhật).
  * Nhóm nút thao tác: Nút bật/tắt Micro-KPI `📊 KPI`, Nút mở Quản lý giao nhận `📦 QLGN`, Nút làm mới dữ liệu `🔄`.
- **4. Dải Micro-KPI Cuộn Ngang ([PrecisionBtpAutoMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/PrecisionBtpAutoMobileKpi.tsx))**:
  * Chuyển 5 cards KPI desktop thành dải chip cuộn ngang siêu mượt (Tổng BTP EA, Xưởng A EA & %, Xưởng B EA & %, Lot & Mã hàng, Phân bổ Nhà máy).
  * Nút đóng nhanh `[X]` giải phóng 100% diện tích cho bảng dữ liệu AG-Grid.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionBtpAutoMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/PrecisionBtpAutoMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh 14px (chống zoom Safari iOS) kèm nút Clear `[X]` + nút `Bộ Lọc` (`FiFilter`) kèm badge đếm điều kiện + Segmented switch mini `Detail / Summary`.
  * Hàng 2: Dải thao tác cuộn ngang (Chips chọn nhanh Xưởng Tất cả / Xưởng A / Xưởng B + Toggle Tồn > 0 + Xuất Excel EX1/EX2 + Mở QLGN + Bộ đếm dòng `filtered / total`).
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionBtpAutoMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/PrecisionBtpAutoMobileFilterDrawer.tsx))**:
  * Bottom Sheet trượt mượt mà, backdrop tối đặc `rgba(15, 23, 42, 0.75)` không dùng blur, 4 nhóm điều khiển (Chế độ dữ liệu, Phân xưởng, Nhà máy, Tình trạng tồn kho) kèm nút "Đặt lại" và "Áp dụng".
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Cập nhật [PrecisionBtpAutoGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/PrecisionBtpAutoGrid.tsx) ẩn GridToolbar desktop khi ở mobile, mở rộng [useBtpAutoData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/useBtpAutoData.ts) hỗ trợ lọc đa chiều.
  * File chính [BTP_AUTO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.tsx) chỉ 142 dòng, styling tối ưu trong [PrecisionBtpAuto.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/PrecisionBtpAuto/PrecisionBtpAuto.scss).

## Update - 2026-09-27 (QLSX / ACHIVEMENTTB: Tối Ưu Toàn Diện Giao Diện Mobile Bảng Tỷ Lệ Đạt Kế Hoạch Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [ACHIVEMENTTB.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.backup2.tsx).
- **2. Viewport Conditional Rendering**: Hook `useIsMobile()`, bảo toàn 100% Desktop (`!isMobile`), mobile header tinh gọn nhấp nháy Live, Micro-KPI bar cuộn ngang, Toolbar 2 hàng công thái học, Filter Drawer Zero-Blur 3 nhóm. File chính [ACHIVEMENTTB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.tsx) chỉ 164 dòng.

## Update - 2026-09-27 (QLSX / KHOAO: Tối Ưu Toàn Diện Giao Diện Mobile Kho SX Main - Kho Ảo)
- **1. Sao Lưu An Toàn**: Tạo file [KHOAO.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.backup2.tsx).
- **2. Viewport Conditional Rendering**: Dùng hook `useIsMobile()`, bảo toàn 100% desktop (`!isMobile`), header mobile nhấp nháy Live; Toolbar 2 hàng; Filter Drawer Zero-Blur 4 nhóm. File chính [KHOAO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.tsx) chỉ 218 dòng.

## Update - 2026-09-27 (KD & QLSX: Cache-Busting Toàn Diện Cho Modal In Bản Vẽ Kỹ Thuật)
- Cập nhật [DrawComponent.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponent.tsx), [DrawComponentTBG.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponentTBG.tsx) sang `useMemo` với `?v=${timestamp}_${randomSalt}`.
- Cố định key độc nhất `key={`${element.G_CODE}_...`}` trong [khsxUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx), [planDataTbPrintRenderers.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/planDataTbPrintRenderers.tsx), [quickPlanPrintRenderers.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/quickPlanPrintRenderers.tsx).
- Bổ sung tham số ngẫu nhiên cho link bản vẽ trong [PrecisionYCSXColumns.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionYCSXColumns.tsx).
