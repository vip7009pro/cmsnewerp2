# ERP Context & Status

## Update - 2026-09-26 (QLSX / DATASX: Tối Ưu Toàn Diện Giao Diện Mobile Dữ Liệu Sản Xuất)
- **1. Sao Lưu An Toàn**: Đã tạo file sao lưu [DATASX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/DATASX.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**:
  * Sử dụng hook chuẩn `useIsMobile()` từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`): [PrecisionDataSxHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/PrecisionDataSx/PrecisionDataSxHeader.tsx), [PrecisionDataSxToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/PrecisionDataSx/PrecisionDataSxToolbar.tsx), [PrecisionDataSxSummary.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/PrecisionDataSx/PrecisionDataSxSummary.tsx) và layout chia pane/drawer ban đầu.
- **3. Toolbar Thích Ứng Công Thái Học 2 Hàng Trên Mobile ([PrecisionDataSxMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/PrecisionDataSx/PrecisionDataSxMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh (font 14px chống zoom iOS, nút [X] xóa nhanh, phím Enter tìm kiếm) + nút **Chỉ Thị** (Primary Blue Gradient) + nút **YCSX** (Purple Gradient) + nút **Bộ Lọc** (`FiFilter`) kèm badge số điều kiện đang lọc.
  * Hàng 2: Dải nút cuộn ngang 1 dòng (`overflow-x: auto; scrollbar-width: none`): Chip thống kê số lượng (`Hiện: X / Y bản ghi`), chip toggle **All Time**, chip toggle **Trừ Sample**, chip toggle **Full Summary**, nút toggle **Bảng Hao Hụt**, nút **Pivot Table**, nút **Hiện/Ẩn Chi Tiết YCSX**, nút **Xuất Excel** và nút **Reset** bộ lọc.
- **4. Zero-Blur GPU-Friendly Bottom Sheet Filter Drawer ([PrecisionDataSxMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/PrecisionDataSx/PrecisionDataSxMobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` tuân thủ triệt để quy tắc Zero Blur, bảo vệ GPU điện thoại.
  * Cung cấp 5 nhóm trường lọc thân thiện cảm ứng (touch targets 40px, font 14px chống zoom): Thời gian (Từ ngày, Tới ngày, All Time), Lệnh & Chỉ thị (PLAN ID, YCSX), Sản phẩm & Liệu (Code ERP, Code KD, Tên liệu, Mã liệu), Nhà máy & Máy (Factory, Máy), Tùy chọn (Trừ Sample, Only Closed, Full Summary).
  * Hỗ trợ nút "Đặt lại", nút "Tra Chỉ Thị" và "Tra YCSX".
- **5. Tối Đa Hóa Không Gian Bảng Dữ Liệu**:
  * Chế độ Chỉ Thị: Thanh Tab Bar chuyển đổi linh hoạt 3 bảng độc lập chiếm trọn 100% diện tích: `[ 📑 Chỉ Thị ]` | `[ 📦 Xuất Liệu ]` | `[ 🏭 Kho Ảo ]`. Chạm dòng chỉ thị tự động chuyển xem xuất liệu, chạm dòng xuất liệu chuyển xem kho ảo.
  * Chế độ YCSX: AGTable YCSX chiếm 100% chiều cao; khi bật chi tiết có drawer tích hợp sub-tabs: `[ 📊 Hao Hụt Tracking ]` | `[ 📅 Tiến Độ Ngày ]` kèm nút đóng nhanh `[X]`.
- **6. Kiểm Tra Toàn Diện**: TypeScript compilation kiểm tra sạch sẽ với 0 lỗi trên DATASX.

## Update - 2026-09-26 (QLSX / LICHSUINPUTLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Lịch Sử Cấp Liệu)
- **1. Sao Lưu An Toàn**: Đã tạo file sao lưu [LICHSUINPUTLIEU.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**:
  * Sử dụng hook chuẩn `useIsMobile()` từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`): [PrecisionLichSuInputLieuHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/PrecisionLichSuInputLieu/PrecisionLichSuInputLieuHeader.tsx), [PrecisionLichSuInputLieuKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/PrecisionLichSuInputLieu/PrecisionLichSuInputLieuKpi.tsx), [PrecisionLichSuInputLieuToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/PrecisionLichSuInputLieu/PrecisionLichSuInputLieuToolbar.tsx) và thanh toolbar lọc bảng.
- **3. Toolbar Thích Ứng Công Thái Học 2 Hàng Trên Mobile ([PrecisionLichSuInputLieuMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/PrecisionLichSuInputLieu/PrecisionLichSuInputLieuMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh (font 14px chống zoom iOS, nút [X] xóa nhanh, bấm Enter để tìm) + nút **Tra Lịch Sử** (Primary Blue Gradient) + nút **Bộ Lọc** (`FiFilter`) kèm badge số điều kiện đang lọc.
  * Hàng 2: Dải nút cuộn ngang 1 dòng (`overflow-x: auto; scrollbar-width: none`): Chip thống kê số lượng (`Hiện: X / Y bản ghi`), chip toggle **All Time**, nút **Xuất Excel** (Green gradient) và nút **Reset** bộ lọc.
- **4. Zero-Blur GPU-Friendly Bottom Sheet Filter Drawer ([PrecisionLichSuInputLieuMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/PrecisionLichSuInputLieu/PrecisionLichSuInputLieuMobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` tuân thủ triệt để quy tắc Zero Blur, bảo vệ GPU điện thoại.
  * Cung cấp các trường lọc thân thiện cảm ứng (touch targets 40px, font 14px chống zoom): Từ ngày, Tới ngày, All Time, Số YCSX, Số PLAN ID, Code ERP (G_CODE), Code KD (G_NAME), Tên Liệu (M_NAME), Mã Liệu (M_CODE).
  * Hỗ trợ nút "Đặt lại" và "Áp Dụng & Tra Cứu".
- **5. Tối Đa Hóa Diện Tích Bảng Dữ Liệu AGTable**: Container bảng chiếm trọn chiều cao còn lại (`flex: 1 1 auto; min-height: 0;`), cuộn mượt mà không kẹt touch.

## Update - 2026-09-26 (QLSX / LONGTERM_PLAN: Tối Ưu Toàn Diện Giao Diện Mobile Kế Hoạch Dài Hạn 16 Ngày)
- **1. Sao Lưu An Toàn**: Đã tạo file sao lưu [LONGTERM_PLAN.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**:
  * Sử dụng hook chuẩn `useIsMobile()` từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`): [PrecisionLongTermPlanHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermPlanHeader.tsx), [PrecisionLongTermPlanToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermPlanToolbar.tsx), [PrecisionLongTermCapaSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermCapaSection.tsx) và thanh toolbar lọc bảng.
- **3. Toolbar Thích Ứng Công Thái Học 2 Hàng Trên Mobile ([PrecisionLongTermPlanMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermPlanMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh (font 14px chống zoom iOS, nút [X] xóa nhanh, bấm Enter để tìm) + nút **Tra PLAN** (Primary Blue Gradient) + nút **Bộ Lọc** (`FiFilter`) kèm badge số điều kiện đang lọc.
  * Hàng 2: Dải nút cuộn ngang 1 dòng (`overflow-x: auto; scrollbar-width: none`): Chip thống kê số lượng (`Hiện: X / Y lệnh`), nút **MOVE PLAN** (Amber gradient), nút **DELETE PLAN** (Red gradient), nút **Xuất Excel** (Green gradient), nút **Bỏ chọn** và nút toggle xem **Biểu Đồ Capa**.
- **4. Zero-Blur GPU-Friendly Bottom Sheet Filter Drawer ([PrecisionLongTermPlanMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermPlanMobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` tuân thủ triệt để quy tắc Zero Blur, bảo vệ GPU điện thoại.
  * Cung cấp các trường lọc thân thiện cảm ứng (touch targets 40px, font 14px): PLAN DATE, FACTORY (NM1/NM2), MACHINE (tất cả máy) và MOVE TO DATE kèm nút thao tác Dời Kế Hoạch nhanh.
  * Hỗ trợ nút "Mặc Định" đặt lại bộ lọc và "Áp Dụng & Tra Cứu".
- **5. Tối Đa Hóa Diện Tích Bảng Dữ Liệu AGTable**: Container bảng chiếm trọn chiều cao còn lại (`flex: 1 1 auto; min-height: 0;`), cuộn mượt mà không kẹt touch.
- **6. Kiểm Tra & Xác Nhận**: TypeScript check vượt qua với 0 lỗi phát sinh trên các module kế hoạch dài hạn.

## Update - 2026-09-26 (QLSX: Tối Ưu Toàn Diện Mobile Modal In Chỉ Thị Sản Xuất)
- Full-screen native app `100vw x 100dvh`, toolbar 2 tầng (Emerald print button), khắc phục lệch âm lề trái A4 210mm.

## Update - 2026-09-26 (QLSX / PLAN_TABLE: Toolbar 3 Hàng & Button Style Stitch Enterprise)
- Hàng 1: Nút Tra PLAN cùng hàng với Ngày + Máy; Hàng 2: MOVE TO date + MOVE PLAN + QUICK PLAN; Hàng 3: Cuộn ngang dải action buttons gradient nổi bật.
