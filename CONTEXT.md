# ERP Context & Status

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
