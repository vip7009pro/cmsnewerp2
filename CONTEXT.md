# ERP Context & Status

## Update - 2026-09-26 (QLSX / EQ_STATUS2: Tối Ưu Toàn Diện Giao Diện Mobile Thiết Bị Sản Xuất Realtime)
- **1. Sao Lưu An Toàn**: Đã tạo file sao lưu [EQ_STATUS2.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**:
  * Sử dụng hook chuẩn `useIsMobile()` từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`): [PrecisionEqStatus2DesktopPanel.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2DesktopPanel.tsx), header tìm kiếm và panel NM1/NM2.
- **3. Mobile Header Tinh Gọn ([PrecisionEqStatus2MobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2MobileHeader.tsx))**:
  * Brand icon thiết bị, Live pulse indicator (3s nhấp nháy), thống kê số máy realtime, nút gập mở KPI và nút mở EQ Manager.
- **4. Dải Micro KPI Cuộn Ngang ([PrecisionEqStatus2MobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2MobileKpi.tsx))**:
  * Thay thế bảng table 6 cột `EQ_SUMMARY` cồng kềnh trên mobile bằng thanh KPI cuộn ngang (Tổng máy, Vận hành %, Đang chạy, Setting, Tạm dừng, Máy NG).
  * Hỗ trợ chip lọc theo từng series máy (FR, SR, DC, ED...).
- **5. Mobile Toolbar 2 Hàng Công Thái Học ([PrecisionEqStatus2MobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2MobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh 14px chống zoom iOS kèm nút xóa nhanh `[X]` + nút `Bộ Lọc` (`FiFilter`) kèm badge số điều kiện đang lọc.
  * Hàng 2: Segmented Switcher xưởng (Tất cả / NM1 / NM2) + chip trạng thái nhanh (Tất cả / Chạy / Setting / Dừng / OK / NG) + nút Reset.
- **6. Zero-Blur GPU-Friendly Filter Drawer ([PrecisionEqStatus2MobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2MobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` không dùng blur, 4 nhóm chọn: Nhà máy, Nhóm máy (Series), Trạng thái vận hành, Tình trạng thiết bị.
- **7. Lưới Thẻ Máy Mobile Linh Hoạt ([PrecisionEqStatus2MobileContent.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2MobileContent.tsx))**:
  * Phân nhóm theo phân xưởng và dòng máy, thẻ máy `MACHINE_COMPONENT3` co giãn không bị cắt cụt, giữ nguyên tương tác double click toggle trạng thái.
- **8. Phân Rã Clean Code Dưới 300 Dòng**:
  * [EQ_STATUS2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2.tsx) chỉ còn 290 dòng; tách rời [PrecisionEqStatus2ManagerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2ManagerModal.tsx) và [PrecisionEqStatus2AddMachineDialog.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus2/PrecisionEqStatus2AddMachineDialog.tsx).

## Update - 2026-09-26 (QLSX / EQ_STATUS: Tối Ưu Toàn Diện Giao Diện Mobile Andon Giám Sát Máy)
- Sao lưu [EQ_STATUS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS.backup2.tsx); bảo toàn 100% desktop.
- Header Andon TV mobile siêu gọn + Micro KPI bar + Toolbar 2 hàng + Filter Drawer Zero-Blur.

## Update - 2026-09-26 (QLSX / PLAN_STATUS: Tối Ưu Toàn Diện Giao Diện Mobile Trạng Thái Tiến Độ Chỉ Thị)
- Sao lưu [PLAN_STATUS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS.backup2.tsx); bảo toàn 100% Desktop.
- Mobile Toolbar 2 hàng + Bottom Sheet Filter Drawer Zero Blur + Mini KPI Bar cuộn ngang.
