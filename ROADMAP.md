# Roadmap - cmsnewerp2

- [x] SHARED / SCANNER: Xây dựng Universal Barcode & QR Code Scanner chuẩn Enterprise ([UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx), [UniversalScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerModal.tsx), [UniversalScannerHUD.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerHUD.tsx), [UniversalScannerFeedback.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerFeedback.ts), [index.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/index.ts)) — Thay thế triệt để `Html5QrcodeScanner` cũ kỹ bằng cấu hình Full HD 1080p (`1920x1080 @ 30fps`) nét căng cận native; kích hoạt Google ML Kit `BarcodeDetector` tăng tốc GPU/NPU bắt code siêu tốc đa định dạng 1D (Code 128, Code 39, EAN...) & 2D (QR, Data Matrix); hỗ trợ Zoom phần cứng (pills `1x`, `2x`, `3x` & slider trượt mượt mà) cùng fallback CSS transform zoom; hỗ trợ bật/tắt đèn Flash tức thì; cho phép chuyển đổi camera và nhớ thiết bị ưa thích; âm thanh bíp 2.4kHz Web Audio API không cần file ngoài và rung haptic; tích hợp 3 tab: Camera live, Upload ảnh, Nhập mã tay; kế thừa ngay lập tức cho các modal hiện có ([PrecisionDataSampleSxScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxScannerModal.tsx), [PrecisionLineQcScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/pqc/PrecisionLineQc/PrecisionLineQcScannerModal.tsx), [PrecisionDKDTCScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/dtc/PrecisionDKDTC/PrecisionDKDTCScannerModal.tsx), [Scanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/Scanner.tsx), [CAMERASCANNER.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/SCANBARCODE/CAMERASCANNER.tsx)).

- [x] SX / DATASAMPLE: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Khai Báo Dữ Liệu & Upload Ảnh Sample Sản Xuất (SX SAMPLE DATA) theo chuẩn `mobile_interface_refactoring` ([DATASAMPLESX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.tsx), [PrecisionDataSampleSxMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileHeader.tsx), [PrecisionDataSampleSxMobileStatusBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileStatusBar.tsx), [PrecisionDataSampleSxMobileBottomBar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxMobileBottomBar.tsx), [PrecisionDataSampleSxForm.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxForm.tsx), [PrecisionDataSampleSxImageUploadBox.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImageUploadBox.tsx), [PrecisionDataSampleSxImagePreviewModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/PrecisionDataSampleSx/PrecisionDataSampleSxImagePreviewModal.tsx)).

- [x] SX / KPI_NV: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Báo Cáo Hiệu Suất & Đánh Giá KPI Nhân Viên Sản Xuất (SX KPI NV) theo chuẩn `mobile_interface_refactoring` ([KPI_NVSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.tsx)).

- [x] SX / MAINDEFECTS: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Thư Viện & Quản Lý Tiêu Chuẩn Lỗi Công Đoạn (MAIN DEFECTS) theo chuẩn `mobile_interface_refactoring` ([MAINDEFECTS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.tsx)).

- [x] SX / PATROL: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Giám Sát Chất Lượng Trực Tiếp (Quality Patrol Live Dashboard) theo chuẩn `mobile_interface_refactoring` ([PATROL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.tsx)).

- [x] QC / IQC / FAILING: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý Lô Lỗi QC (QC Failing Control) theo chuẩn `mobile_interface_refactoring` ([FAILING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.tsx)).

- [x] SX / DAOFILM_REPORT: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Báo Cáo Dao Film theo chuẩn `mobile_interface_refactoring` ([DAOFILM_REPORT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.tsx)).

- [x] SX / LICHSUDAOFILM: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý & Lịch Sử Dao Film theo chuẩn `mobile_interface_refactoring` ([DAOFILMDATA.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUDAOFILM/DAOFILMDATA.tsx)).

- [x] SX / BAOCAOFULLROLL: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Báo Cáo Full Roll Sản Xuất theo chuẩn `mobile_interface_refactoring` ([BAOCAOFULLROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOFULLROLL.tsx)).

- [x] SX / BAOCAOTHEOROLL: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Báo Cáo Sản Xuất Theo Roll theo chuẩn `mobile_interface_refactoring` ([BAOCAOTHEOROLL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOTHEOROLL/BAOCAOTHEOROLL.tsx)).

- [x] SX / TINH_HINH_CUON_LIEU: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Theo Dõi Tình Hình Cuộn Liệu theo chuẩn `mobile_interface_refactoring` ([TINHINHCUONLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CUON_LIEU/TINHINHCUONLIEU.tsx)).

- [x] SX / LICHSUTEMLOTSX: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Lịch Sử Tem Lót Sản Xuất theo chuẩn `mobile_interface_refactoring` ([LICHSUTEMLOTSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/LICHSUTEMLOTSX/LICHSUTEMLOTSX.tsx)).

- [x] SX / TINH_HINH_CHOT: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Tình Hình Chốt Báo Cáo & Nhập Hiệu Suất Sản Xuất theo chuẩn `mobile_interface_refactoring` ([TINH_HINH_CHOT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/TINH_HINH_CHOT/TINH_HINH_CHOT.tsx)).

- [x] SX / BTP_AUTO: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Tra Cứu BTP Tự Động theo chuẩn `mobile_interface_refactoring` ([BTP_AUTO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BTP_AUTO/BTP_AUTO.tsx)).

- [x] QLSX / ACHIVEMENTTB: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Bảng Tỷ Lệ Đạt Kế Hoạch Sản Xuất theo chuẩn `mobile_interface_refactoring` ([ACHIVEMENTTB.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/ACHIVEMENTTB/ACHIVEMENTTB.tsx)).

- [x] QLSX / KHOAO: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Kho SX Main (Kho Ảo) theo chuẩn `mobile_interface_refactoring` ([KHOAO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.tsx)).

- [x] KD / YCSXManager & QLSX / PLAN_TABLE: Kiểm tra và nâng cấp toàn diện cơ chế cache-busting cho modal print bản vẽ kỹ thuật ([DrawComponent.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponent.tsx)).

- [x] KD / YCSXManager: Tự động kiểm tra sản phẩm FIRST LOT và tự động chọn ô FIRST LOT trong modal Thêm/Sửa YCSX chuẩn bản gốc ([YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx)).

- [x] QLSX / EQ_STATUS2: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Thiết Bị Sản Xuất Realtime theo chuẩn `mobile_interface_refactoring` ([EQ_STATUS2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2.tsx)).

- [x] QLSX / EQ_STATUS: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Andon Giám Sát Thiết Bị Sản Xuất theo chuẩn `mobile_interface_refactoring` ([EQ_STATUS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS.tsx)).

- [x] QLSX / PLAN_STATUS: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Trạng Thái Tiến Độ Chỉ Thị Sản Xuất theo chuẩn `mobile_interface_refactoring` ([PLAN_STATUS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS.tsx)).

- [x] QLSX / DATASX: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Dữ Liệu Sản Xuất theo chuẩn `mobile_interface_refactoring` ([DATASX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/DATASX.tsx)).

- [x] QLSX / LICHSUINPUTLIEU: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Lịch Sử Cấp Liệu theo chuẩn `mobile_interface_refactoring` ([LICHSUINPUTLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU.tsx)).

- [x] QLSX / LONGTERM_PLAN: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Kế Hoạch Dài Hạn (16 Ngày) theo chuẩn `mobile_interface_refactoring` ([LONGTERM_PLAN.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.tsx)).

- [x] QLSX / PLAN_TABLE: Sắp xếp Toolbar Mobile 3 hàng công thái học & Nâng cấp toàn diện Button Style chuẩn Stitch Enterprise ([PLAN_TABLE.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_TABLE.tsx)).

- [x] SKILL / MOBILE INTERFACE REFACTORING: Xây dựng Skill chuẩn dự án [SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md).
