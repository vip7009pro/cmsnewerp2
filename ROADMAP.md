# Roadmap - cmsnewerp2

- [x] KHO / KHOLIEU: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý Kho Liệu (Data Nhập / Data Xuất / Tồn Kho) theo chuẩn `mobile_interface_refactoring` ([KHOLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/KHOLIEU.tsx), [PrecisionKHOLIEUMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileHeader.tsx), [PrecisionKHOLIEUMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileKpi.tsx), [PrecisionKHOLIEUMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileToolbar.tsx), [PrecisionKHOLIEUMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEUMobileFilterDrawer.tsx), [PrecisionKHOLIEU.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/kholieu/PrecisionKHOLIEU/PrecisionKHOLIEU.scss)) — Bảo toàn 100% Desktop (`useIsMobile`), Header telemetry live pulse, Micro-KPI bar cuộn ngang, Toolbar 3 hàng công thái học (search chống zoom iOS, clear search, touch targets >= 38px, switch mode segmented Nhập/Xuất/Tồn, quick pills Tồn > 0 / All Time, nút mở modal Nhập/Xuất Liệu và xuất EX1/EX2/Pivot), Bottom-Sheet Filter Drawer Zero-Blur đa tiêu chí (ngày, M_NAME, M_CODE, Model KD, YCSX, PLAN ID, STT Cuộn, Tồn > 0, In nhanh PVN).

- [x] MUA HANG / TINHLIEU: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Tính Liệu Sản Xuất MRP Engine theo chuẩn `mobile_interface_refactoring` ([TINHLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/TINHLIEU.tsx), [PrecisionTinhLieuMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileHeader.tsx), [PrecisionTinhLieuMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileKpi.tsx), [PrecisionTinhLieuMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileToolbar.tsx), [PrecisionTinhLieuMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieuMobileFilterDrawer.tsx), [PrecisionTinhLieu.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/tinhlieu/PrecisionTinhLieu/PrecisionTinhLieu.scss)).

- [x] MUA HANG / QLVL: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý Danh Mục Vật Liệu theo chuẩn `mobile_interface_refactoring` ([QLVL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/QLVL.tsx), [PrecisionQLVLMobileHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileHeader.tsx), [PrecisionQLVLMobileKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileKpi.tsx), [PrecisionQLVLMobileToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileToolbar.tsx), [PrecisionQLVLMobileFilterDrawer.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVLMobileFilterDrawer.tsx), [PrecisionQLVL.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/muahang/quanlyvatlieu/PrecisionQLVL/PrecisionQLVL.scss)).

- [x] SHARED / SCANNER: Xây dựng Universal Barcode & QR Code Scanner chuẩn Enterprise ([UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx), [UniversalScannerModal.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerModal.tsx), [UniversalScannerHUD.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerHUD.tsx), [UniversalScannerFeedback.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScannerFeedback.ts), [index.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/index.ts)).

- [x] SX / DATASAMPLE: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Khai Báo Dữ Liệu & Upload Ảnh Sample Sản Xuất theo chuẩn `mobile_interface_refactoring` ([DATASAMPLESX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/DATASAMPLE/DATASAMPLESX.tsx)).

- [x] SX / KPI_NV: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Báo Cáo Hiệu Suất & Đánh Giá KPI Nhân Viên Sản Xuất theo chuẩn `mobile_interface_refactoring` ([KPI_NVSX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/KPI_NV/KPI_NVSX.tsx)).

- [x] SX / MAINDEFECTS: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Thư Viện & Quản Lý Tiêu Chuẩn Lỗi Công Đoạn theo chuẩn `mobile_interface_refactoring` ([MAINDEFECTS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/MAINDEFECTS/MAINDEFECTS.tsx)).

- [x] SX / PATROL: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Giám Sát Chất Lượng Trực Tiếp theo chuẩn `mobile_interface_refactoring` ([PATROL.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/PATROL/PATROL.tsx)).

- [x] QC / IQC / FAILING: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Quản Lý Lô Lỗi QC theo chuẩn `mobile_interface_refactoring` ([FAILING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/FAILING.tsx)).

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

- [x] KD / YCSXManager & QLSX / PLAN_TABLE: Nâng cấp toàn diện cơ chế cache-busting cho modal print bản vẽ kỹ thuật ([DrawComponent.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/DrawComponent/DrawComponent.tsx)).

- [x] KD / YCSXManager: Tự động kiểm tra sản phẩm FIRST LOT và tự động chọn ô FIRST LOT trong modal Thêm/Sửa YCSX chuẩn bản gốc ([YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx)).

- [x] QLSX / EQ_STATUS2: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Thiết Bị Sản Xuất Realtime theo chuẩn `mobile_interface_refactoring` ([EQ_STATUS2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS2.tsx)).

- [x] QLSX / EQ_STATUS: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Andon Giám Sát Thiết Bị Sản Xuất theo chuẩn `mobile_interface_refactoring` ([EQ_STATUS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/EQ_STATUS/EQ_STATUS.tsx)).

- [x] QLSX / PLAN_STATUS: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Trạng Thái Tiến Độ Chỉ Thị Sản Xuất theo chuẩn `mobile_interface_refactoring` ([PLAN_STATUS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/PLAN_STATUS/PLAN_STATUS.tsx)).

- [x] QLSX / DATASX: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Dữ Liệu Sản Xuất theo chuẩn `mobile_interface_refactoring` ([DATASX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/DATASX/DATASX.tsx)).

- [x] QLSX / LICHSUINPUTLIEU: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Lịch Sử Cấp Liệu theo chuẩn `mobile_interface_refactoring` ([LICHSUINPUTLIEU.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUINPUTLIEU/LICHSUINPUTLIEU.tsx)).

- [x] QLSX / LONGTERM_PLAN: Tối ưu hóa toàn diện giao diện Mobile cho màn hình Kế Hoạch Dài Hạn (16 Ngày) theo chuẩn `mobile_interface_refactoring` ([LONGTERM_PLAN.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.tsx)).

- [x] QLSX / PLAN_TABLE: Sắp xếp Toolbar Mobile 3 hàng công thái học & Nâng cấp toàn diện Button Style chuẩn Stitch Enterprise ([PLAN_TABLE.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PLAN_TABLE.tsx)).

- [x] SKILL / MOBILE INTERFACE REFACTORING: Xây dựng Skill chuẩn dự án [SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/mobile_interface_refactoring/SKILL.md).
