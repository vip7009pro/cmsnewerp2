# ERP Context & Status

## Update - 2026-09-27 (QLSX / ACHIVEMENTTB: Tối Ưu Toàn Diện Giao Diện Mobile Bảng Tỷ Lệ Đạt Kế Hoạch Sản Xuất)
- **1. Sao Lưu An Toàn**: Tạo file [ACHIVEMENTTB.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Dùng hook `useIsMobile()` chuẩn từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), bảo toàn 100% Desktop (`!isMobile`) với header công nghiệp, toolbar lọc và grid 6 cards KPI realtime.
- **3. Mobile Header Tinh Gọn ([PrecisionAchivementTbMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/PrecisionAchivementTbMobileHeader.tsx))**:
  * Brand badge "03. QLSX", Live pulse indicator xanh lá nhấp nháy 2s, tiêu đề "TỶ LỆ ĐẠT KH", các micro chip (Xưởng, Máy, Ngày).
  * Nút toggle bật/tắt dải Micro-KPI nhanh và nút Làm Mới dữ liệu.
- **4. Dải Micro KPI Cuộn Ngang ([PrecisionAchivementTbMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/PrecisionAchivementTbMobileKpi.tsx))**:
  * Chuyển đổi grid 6 cards chiếm diện tích sang dải chip cuộn ngang siêu mượt (Toàn ngày % Đạt & Delta, Ca ngày, Ca đêm, Quy mô Lệnh/Máy, Tình trạng Định mức, Tỷ lệ Lệnh đạt).
  * Nút đóng nhanh `[X]` giải phóng 100% không gian hiển thị cho bảng dữ liệu AG-Grid.
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionAchivementTbMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/PrecisionAchivementTbMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm nhanh thông minh (font 14px chống Safari auto-zoom) kèm nút Clear `[X]` + nút `Bộ Lọc` (`FiFilter`) kèm badge số điều kiện active + nút `Tra Plan`.
  * Hàng 2: Chips chọn ngày nhanh (Hôm nay / Hôm qua / Hôm kia) + Nút xuất Excel EX1 (Đang lọc), EX2 (Tất cả) + Bộ đếm số lệnh Mono.
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionAchivementTbMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/PrecisionAchivementTbMobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` không dùng blur, 3 nhóm điều khiển (Ngày kế hoạch + Quick chips, Phân xưởng NM1/NM2, Thiết bị máy dập) kèm nút "Đặt lại" và "Áp dụng".
- **7. Clean Code & Tối Ưu Bảng Dữ Liệu**:
  * Cập nhật [PrecisionAchivementTbGrid.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/PrecisionAchivementTbGrid.tsx) ẩn GridToolbar desktop khi ở mobile, tối đa hóa diện tích AGTable.
  * File chính [ACHIVEMENTTB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.tsx) chỉ 164 dòng, styling tối ưu trong [PrecisionAchivementTb.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/PrecisionAchivementTb/PrecisionAchivementTb.scss).

## Update - 2026-09-27 (QLSX / KHOAO: Tối Ưu Toàn Diện Giao Diện Mobile Kho SX Main - Kho Ảo)
- **1. Sao Lưu An Toàn**: Tạo file [KHOAO.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Dùng hook `useIsMobile()` chuẩn từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts), bảo toàn 100% desktop (`!isMobile`).
- **3. Mobile Header & Micro KPI Bar**: Header siêu tinh gọn nhấp nháy Live; Micro KPI bar cuộn ngang có nút đóng nhanh.
- **4. Mobile Toolbar 2 Hàng & Filter Drawer Zero-Blur**: Hàng 1 tìm kiếm 14px chống zoom + Nút lọc badge; Hàng 2 segmented switch tabs + mini Next Plan + EX1/EX2; Bottom Sheet Filter Drawer 4 nhóm. File chính [KHOAO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.tsx) chỉ 218 dòng.

## Update - 2026-09-27 (KD & QLSX: Cache-Busting Toàn Diện Cho Modal In Bản Vẽ Kỹ Thuật)
- Cập nhật [DrawComponent.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponent.tsx), [DrawComponentTBG.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponentTBG.tsx) sang `useMemo` với `?v=${timestamp}_${randomSalt}`.
- Cố định key độc nhất `key={`${element.G_CODE}_...`}` trong [khsxUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/utils/khsxUtils.tsx), [planDataTbPrintRenderers.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionPlanDataTb/planDataTbPrintRenderers.tsx), [quickPlanPrintRenderers.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/QUICKPLAN/PrecisionQuickPlan/quickPlanPrintRenderers.tsx).
- Bổ sung tham số ngẫu nhiên cho link bản vẽ trong [PrecisionYCSXColumns.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionYCSXColumns.tsx).

## Update - 2026-09-26 (R&D / CODE_MANAGER: Chống Cache Bản Vẽ & Phục Hồi First Lot YCSX)
- [CODE_MANAGER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/rnd/code_manager/CODE_MANAGER.tsx): Gán `getRowId` theo `G_CODE` trên AGTable, xử lý click mở tab mới chống cache.
- [YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx): Tự động kiểm tra và chọn First LOT (`Y`/`N`) cho modal Thêm/Sửa YCSX.
- [EQ_STATUS2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2.tsx) & [EQ_STATUS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS.tsx) & [PLAN_STATUS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS.tsx): Tối ưu toàn diện mobile theo chuẩn `mobile_interface_refactoring`.
