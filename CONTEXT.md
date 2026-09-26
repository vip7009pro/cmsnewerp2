# ERP Context & Status

## Update - 2026-09-26 (QLSX / EQ_STATUS: Tối Ưu Toàn Diện Giao Diện Mobile Andon Giám Sát Máy)
- **1. Sao Lưu An Toàn**: Đã tạo file sao lưu [EQ_STATUS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS.backup2.tsx) bảo toàn 100% mã nguồn ban đầu.
- **2. Viewport Conditional Rendering**:
  * Sử dụng hook chuẩn `useIsMobile()` từ [useIsMobile.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Navbar/AccountInfo/useIsMobile.ts).
  * Bảo toàn nguyên vẹn 100% giao diện và trải nghiệm Desktop (`!isMobile`): [PrecisionEqStatusHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus/PrecisionEqStatusHeader.tsx), [PrecisionEqStatusToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus/PrecisionEqStatusToolbar.tsx).
- **3. Mobile Andon Header Tinh Gọn ([PrecisionEqStatusMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus/PrecisionEqStatusMobileHeader.tsx))**:
  * Hàng trên: Brand icon, thông tin xưởng/nhóm máy, đồng hồ số realtime cùng các nút điều khiển TV (Auto-Slide, Đổi Theme Dark/Light, Toàn màn hình TV).
  * Hàng dưới: Dải Micro KPI cuộn ngang (Tổng máy, Chạy %, Setting, Dừng, Trang hiện tại) kèm thanh Countdown progress bar đếm ngược trực quan.
- **4. Toolbar Thích Ứng Công Thái Học 2 Hàng ([PrecisionEqStatusMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus/PrecisionEqStatusMobileToolbar.tsx))**:
  * Hàng 1: Ô tìm kiếm thông minh `searchString` (font 14px chống zoom iOS, nút [X] clear) + cụm điều hướng trang nhanh `< Trang X/Y >` + nút `Bộ Lọc` (`FiFilter`) kèm badge số điều kiện đang lọc.
  * Hàng 2: Dải nút cuộn ngang 1 dòng (`overflow-x: auto; scrollbar-width: none`): Chip thống kê máy (`Máy: start-end / total`), segmented switcher xưởng NM1/NM2, quick dropdown loại máy, chip toggle `Chỉ máy chạy`, dropdown số máy/trang và nút `Reset`.
- **5. Zero-Blur GPU-Friendly Bottom Sheet Filter Drawer ([PrecisionEqStatusMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus/PrecisionEqStatusMobileFilterDrawer.tsx))**:
  * Backdrop tối đặc `rgba(15, 23, 42, 0.75)` tuân thủ triệt để quy tắc Zero Blur, bảo vệ GPU điện thoại.
  * 4 nhóm cấu hình & lọc thân thiện cảm ứng (touch targets 40-42px, font 14px): Phân xưởng & nhóm máy, Cấu hình hiển thị & thời gian chuyển slide, Tùy chọn lọc trạng thái & theme Dark/Light, Lọc từ khóa.
- **6. Tối Ưu Lưới Thẻ Máy Andon Mobile ([PrecisionEqStatus.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/PrecisionEqStatus/PrecisionEqStatus.scss))**:
  * Chế độ `mobile-machine-grid`: tự động co giãn 1 cột linh hoạt (2 cột trên màn hình rộng > 520px), cuộn mượt mà touch-scrolling.
  * Thẻ máy `andon-machine-card` không bị cắt cụt, ảnh công nhân và các thông số UPH, Setting, Plan/Result hiển thị rõ nét.

## Update - 2026-09-26 (QLSX / PLAN_STATUS: Tối Ưu Toàn Diện Giao Diện Mobile Trạng Thái Tiến Độ Chỉ Thị)
- Sao lưu [PLAN_STATUS.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS.backup2.tsx); bảo toàn 100% Desktop.
- Mobile Toolbar 2 hàng + Bottom Sheet Filter Drawer Zero Blur + Mini KPI Bar cuộn ngang + tối đa hóa diện tích AGTable và Luồng Thẻ.

## Update - 2026-09-26 (QLSX / DATASX: Tối Ưu Toàn Diện Giao Diện Mobile Dữ Liệu Sản Xuất)
- Sao lưu [DATASX.backup2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/DATASX.backup2.tsx); bảo toàn 100% Desktop.
- Mobile Toolbar 2 hàng + Bottom Sheet Filter Drawer Zero Blur + Tab Bar 3 bảng độc lập chiếm 100% diện tích.
