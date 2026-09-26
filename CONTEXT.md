# ERP Context & Status

## Update - 2026-09-26 (QLSX / PLAN_STATUS: Tối Ưu Toàn Diện Giao Diện Mobile Trạng Thái Tiến Độ Chỉ Thị)
- **1. Sao Lưu An Toàn**: Đã tạo file sao lưu [PLAN_STATUS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**:
  * Sử dụng hook chuẩn `useIsMobile()` từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`): [PrecisionPlanStatusHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PrecisionPlanStatus/PrecisionPlanStatusHeader.tsx), [PrecisionPlanStatusKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PrecisionPlanStatus/PrecisionPlanStatusKpi.tsx), [PrecisionPlanStatusToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PrecisionPlanStatus/PrecisionPlanStatusToolbar.tsx).
- **3. Toolbar Thích Ứng Công Thái Học 2 Hàng Trên Mobile ([PrecisionPlanStatusMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PrecisionPlanStatus/PrecisionPlanStatusMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh `quickSearch` (font 14px chống zoom iOS, nút [X] xóa nhanh, phím Enter tìm kiếm) + nút chuyển đổi chế độ xem **Thẻ / Bảng** + nút **Tra Cứu** (Primary Blue Gradient) + nút **Bộ Lọc** (`FiFilter`) kèm badge số điều kiện đang lọc.
  * Hàng 2: Dải nút cuộn ngang 1 dòng (`overflow-x: auto; scrollbar-width: none`): Chip thống kê số lượng (`Hiện: X / Y CT`), chip toggle **All Time**, chip **Tự Làm Mới** (chu kỳ Tắt / 30s / 60s), nút **Làm mới**, nút **Tóm Tắt KPI**, nút **Xuất Excel** và nút **Reset** bộ lọc.
- **4. Zero-Blur GPU-Friendly Bottom Sheet Filter Drawer ([PrecisionPlanStatusMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PrecisionPlanStatus/PrecisionPlanStatusMobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` tuân thủ triệt để quy tắc Zero Blur, bảo vệ GPU điện thoại.
  * Cung cấp 4 nhóm trường lọc thân thiện cảm ứng (touch targets 40px, font 14px chống zoom): Thời gian (Từ ngày, Tới ngày, All Time), Lệnh & Chỉ thị (PLAN ID, YCSX), Sản phẩm (Code ERP, Code KD), Nhà máy & Máy (Factory, Machine).
  * Hỗ trợ nút "Đặt lại" và nút "Áp Dụng & Tra Cứu".
- **5. Mini KPI Bar Cuộn Ngang Thích Ứng ([PrecisionPlanStatusMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PrecisionPlanStatus/PrecisionPlanStatusMobileKpi.tsx))**:
  * 6 micro-card hiển thị nhanh: Tổng CT, Chờ dao, Chờ liệu, Setting, Mass, Chốt BC kèm nút đóng [X].
- **6. Tối Đa Hóa Không Gian**:
  * Chế độ Luồng Thẻ: Tinh gọn padding, flex-wrap metadata, card stepper 2 cột touch-friendly.
  * Chế độ Bảng Grid: AGTable chiếm trọn 100% diện tích không gian còn lại.
- **7. Kiểm Tra Toàn Diện**: TypeScript compilation kiểm tra sạch sẽ với 0 lỗi trên module PLAN_STATUS.

## Update - 2026-09-26 (QLSX / DATASX: Tối Ưu Toàn Diện Giao Diện Mobile Dữ Liệu Sản Xuất)
- **1. Sao Lưu An Toàn**: [DATASX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/DATASX.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**: Bảo toàn 100% Desktop (`!isMobile`).
- **3. Mobile Toolbar 2 Hàng**: Ô search thông minh, nút Chỉ Thị, YCSX, Lọc; Hàng 2 cuộn ngang chứa chip thống kê, All Time, Trừ Sample, Bảng Hao Hụt, Pivot, Chi Tiết YCSX, Xuất Excel.
- **4. Bottom Sheet Filter Drawer**: Zero Blur GPU-Friendly lọc 5 nhóm trường.
- **5. Tối Đa Hóa Bảng**: Tab Bar 3 bảng độc lập Chỉ Thị / Xuất Liệu / Kho Ảo chiếm 100% diện tích.

## Update - 2026-09-26 (QLSX / LICHSUINPUTLIEU: Tối Ưu Toàn Diện Giao Diện Mobile Lịch Sử Cấp Liệu)
- Sao lưu [LICHSUINPUTLIEU.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU.backup2.tsx); bảo toàn 100% Desktop.
- Mobile Toolbar 2 hàng + Bottom Sheet Filter Drawer Zero Blur + tối đa hóa diện tích AGTable.

## Update - 2026-09-26 (QLSX / LONGTERM_PLAN: Tối Ưu Toàn Diện Giao Diện Mobile Kế Hoạch 16 Ngày)
- Sao lưu [LONGTERM_PLAN.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.backup2.tsx); bảo toàn 100% Desktop.
- Mobile Toolbar 2 hàng + Bottom Sheet Filter Drawer Zero Blur + tối đa hóa diện tích AGTable.
