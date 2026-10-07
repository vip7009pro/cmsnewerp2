# ERP Context & Status

## Update - 2026-10-07 (QC / ISO / CALIBRATION: Tích Hợp Upload File PDF Kết Quả Hiệu Chuẩn & Xem/Tải Trực Tiếp)
- **Mục tiêu**: Thêm tính năng upload file PDF kết quả hiệu chuẩn trong modal Thêm/Sửa lịch sử hiệu chuẩn và bổ sung cột "File Kết Quả" trên Bảng Lịch Sử hiệu chuẩn [PrecisionCalibrationTables.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/PrecisionCalibration/PrecisionCalibrationTables.tsx) cho phép view/download file PDF.
- **Thực hiện**:
  - **Database & Backend** ([qcService.js](file:///g:/NODEJS/practice1/services/qcService.js)):
    - Bổ sung cột `RESULT_FILE_URL NVARCHAR(500) NULL` vào bảng `QC_CALIBRATION_HISTORY`.
    - Nâng cấp `qc_insert_calibration` và `qc_update_calibration` lưu trữ `RESULT_FILE_URL`.
    - Bổ sung `RESULT_FILE_URL` vào truy vấn `qc_get_equipment_list` (`LAST_RESULT_FILE_URL`).
  - **Types & State** ([calibrationTypes.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/PrecisionCalibration/calibrationTypes.ts), [useCalibrationData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/PrecisionCalibration/useCalibrationData.ts)):
    - Thêm `RESULT_FILE_URL?: string` vào interface `CalibrationHistory`.
    - Thêm state `histPdfFile, setHistPdfFile`, tự động upload file PDF kết quả qua `uploadQuery(..., "calibration")` và lưu URL khi submit.
  - **Modal Upload** ([PrecisionCalibrationModals.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/PrecisionCalibration/PrecisionCalibrationModals.tsx)):
    - Chuyển đổi toàn bộ Grid sang CSS grid `.pc-form-grid` thuần để tương thích tuyệt đối với MUI v7, tránh lỗi overload.
    - Thêm khu vực dropzone chuyên biệt cho PDF với icon màu đỏ, hiển thị trạng thái file (file mới/file hiện tại/kích thước), nút "Xem PDF", "Hủy chọn" và "Đổi/Tải lên PDF".
  - **Cột Bảng Lịch Sử & Styling** ([PrecisionCalibrationColumns.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/PrecisionCalibration/PrecisionCalibrationColumns.tsx), [PrecisionCalibration.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/PrecisionCalibration/PrecisionCalibration.scss)):
    - Thêm cột `RESULT_FILE_URL` ("File Kết Quả") vào `createHistoryColumns`.
    - Tích hợp 2 nút thao tác trong ô: nút **Xem PDF** (mở trực tiếp tab mới) và nút **Tải về** (download qua `f_downloadFile`).
    - Nếu chưa có file hiển thị trạng thái "Chưa có file".
  - **Container & Props** ([CALIBRATION.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/CALIBRATION.tsx)):
    - Đồng bộ `pdfFile` và `setPdfFile` truyền xuống `HistoryModal`.

## Update - 2026-10-06 (QLSX / LONGTERM_PLAN: Chuyển Đổi Biểu Đồ Capa Dài Hạn Sang Hiển Thị Động Theo Dòng Máy)
- **Mục tiêu**: Chuyển các biểu đồ Capa cố định theo 4 dòng máy (FR, SR, DC, ED) trong [LONGTERM_PLAN.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.tsx) sang hiển thị biểu đồ & tab động linh hoạt, lấy danh sách dòng máy từ API `f_getMachineListData()` và lọc bỏ máy `'NA'`, `'NO'`.
- **Thực hiện**:
  - [useLongTermPlanData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/useLongTermPlanData.ts):
    - Cập nhật hàm `getMachineList`: gọi `f_getMachineListData()`, lọc sạch các mã không hợp lệ `EQ_NAME !== 'NA' && EQ_NAME !== 'NO' && EQ_NAME !== 'ALL'`.
    - Mở rộng kiểu `activeCapaTab` từ enum tĩnh sang `string` (mặc định `'ALL'`).
  - [LONGTERM_PLAN.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/LONGTERM_PLAN.tsx):
    - Truyền `machineList={machine_list}` vào [PrecisionLongTermCapaSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermCapaSection.tsx).
  - [PrecisionLongTermCapaSection.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermCapaSection.tsx):
    - Trích xuất danh sách dòng máy động `seriesList` từ `machineList` kết hợp dữ liệu `capaData` (tự động fallback nếu danh sách trống, loại trừ `'NA'`, `'NO'`, `'ALL'`).
    - Khởi tạo bảng màu palette doanh nghiệp (`KNOWN_SERIES_META` cho FR, SR, DC, ED, SP, IN và auto-color theo index cho các dòng máy mới phát sinh trong tương lai).
    - Render động danh sách Tab: nút "Tất cả (N máy)" + từng tab máy kèm nhãn công đoạn.
    - Render động danh sách Executive Cards: hỗ trợ lọc theo tab, xuất Excel từng dòng máy độc lập `SaveExcel(data, `${series}_PLAN_CAPA`)`, tích hợp Recharts [PrecisionLongTermCapaChart.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermCapaChart.tsx).
  - [PrecisionLongTermPlan.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/LICHSUCHITHITABLE/PrecisionLongTermPlan/PrecisionLongTermPlan.scss):
    - Cấu hình `.capa-tabs` hỗ trợ `overflow-x: auto; max-width: 100%` cuộn mượt mà khi có nhiều tab dòng máy.
    - Cấu hình `.precision-longterm-capa-section__grid` dạng `repeat(auto-fit, minmax(280px, 1fr))` tự co giãn số cột theo số lượng dòng máy, mở rộng `max-height: 320px` khi xem single tab.

## Update - 2026-10-05 (SHARED / RECHARTS: Sửa Triệt Để Warning width(0) & height(0) Trong ResponsiveContainer)
- **Mục tiêu**: Loại bỏ cảnh báo Recharts: *"The width(0) and height(0) of chart should be greater than 0..."* tại [SXPlanLossTrend.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/SX/SXPlanLossTrend.tsx) và các biểu đồ dùng [CustomResponsiveContainer](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/services/utilService.tsx).
- **Nguyên nhân**: `CustomResponsiveContainer` sử dụng thẻ con `position: absolute` bên trong thẻ `position: relative` nằm trong flex container. Khi flex item chưa có kích thước hoặc `height: 100%` chưa tính xong, chiều cao bằng 0 khiến Recharts cảnh báo.
- **Khắc phục**:
  - [utilService.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/services/utilService.tsx): Nâng cấp `CustomResponsiveContainer` bổ sung `minWidth={props.minWidth ?? 0}`, `minHeight={props.minHeight ?? 250}`, `flex: 1` vào thẻ wrapper và truyền trực tiếp xuống `ResponsiveContainer`.
  - [SXPlanLossTrend.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/SX/SXPlanLossTrend.tsx): Đặt prop `minHeight={260}` và `minWidth={0}` trên `CustomResponsiveContainer`.
  - [PrecisionSxReport.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/sx/BAOCAOSX/PrecisionSxReport/PrecisionSxReport.scss): Thêm `position: relative; width: 100%;` cho `.executive-card__body`.

## Update - 2026-10-05 (QLSX / CAPA: Chuyển Biểu Đồ Production Lead Time Từng Dòng Thiết Bị Sang Cột Ngang)
- **Mục tiêu**: Chuyển biểu đồ *Production Lead Time Từng Dòng Thiết Bị (PO Balance Standard)* trong [PrecisionCapaSx2LeadTimeCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2LeadTimeCharts.tsx) từ dạng cột đứng sang dạng thanh ngang (Horizontal Bar Chart).
- **Thực hiện**:
  - Cấu hình Recharts BarChart `layout="vertical"`, trục X hiển thị giá trị số ngày (`type="number"`), trục Y hiển thị danh mục dòng máy (`type="category"`, dataKey `name`).
  - Tích hợp `LabelList` hiển thị trực tiếp giá trị số ngày bên cạnh mỗi thanh Bar.
  - Phân tách màu sắc: Đỏ (`#ef4444`) cho Lead Time Thực Tế (ATT WF) và Xanh Lá (`#10b981`) cho Lead Time Đăng Ký (RETAIN WF).
  - Chiều cao container co giãn tự động theo số dòng máy, đảm bảo khoảng cách thanh thoáng đãng và dễ đọc.

## Update - 2026-10-05 (QLSX / CAPA: Bổ Sung Biểu Đồ CapaSx Delivery Plan Lead Time Chart Cho CAPASX.tsx)
- **Mục tiêu**: Bổ sung đầy đủ biểu đồ Capa Lead Time theo kế hoạch giao hàng (`Delivery Plan Capa / Lead Time Chart`) cho màn hình [CAPASX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX.tsx).
- **Phát hiện & Khắc phục nguyên nhân gốc**:
  - Dữ liệu `dlleadtime` và hàm `getDeliveryLeadTime` từ `capabydeliveryplan` trước đó không được render ra UI của `CAPASX.tsx`.
  - Nâng cấp [useCapaSxData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx/useCapaSxData.ts): hàm `getDeliveryLeadTime` tự động tính toán nhân sự điểm danh độc lập, tránh race-condition.
  - Xây dựng component mới [PrecisionCapaSxDeliveryLeadTimeCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx/PrecisionCapaSxDeliveryLeadTimeCharts.tsx) (Recharts ComposedChart: Bar Leadtime + Line 12H + Line 8H).
  - Tích hợp vào [CAPASX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX.tsx) hiển thị ở các tab `leadtime`, `plans`, và `all`.

## Update - 2026-10-05 (QLSX / CAPA: Khôi Phục Logic CAPASX2 Theo CAPASX2.backup.tsx & Chuẩn Hóa Stitch UI)
- **Mục tiêu**: Khôi phục 100% logic nghiệp vụ của [CAPASX2.backup.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX2.backup.tsx) cho [CAPASX2.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX2.tsx), giữ nguyên phong cách giao diện Google Stitch High-Density Enterprise & Mobile-First từ [CAPASX.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/CAPASX.tsx).
- **Kiến trúc tách biệt (PrecisionCapaSx2)**:
  - Tạo bộ module riêng tại `src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/`: [useCapaSx2Data.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/useCapaSx2Data.ts), [PrecisionCapaSx2Header.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2Header.tsx), [PrecisionCapaSx2Toolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2Toolbar.tsx), [PrecisionCapaSx2Kpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2Kpi.tsx), [PrecisionCapaSx2WorkforceCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2WorkforceCharts.tsx), [PrecisionCapaSx2LeadTimeCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2LeadTimeCharts.tsx), [PrecisionCapaSx2PlanCharts.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qlsx/QLSXPLAN/CAPA/PrecisionCapaSx2/PrecisionCapaSx2PlanCharts.tsx).
  - Khôi phục `getSXCapaData`, `f_handle_loadEQ_STATUS`, `f_loadcapabydeliveryplan`, AGTable 14 cột, dòng `TOTAL`.

## Update - 2026-10-03 (EMAIL: Tối ưu Mobile — viewport conditional rendering)
- `src/components/Mail/MailDock.tsx`: nhánh `isMobile` = app bar (`MailMobileBar.tsx`) + tìm kiếm thu gọn + FAB soạn thư; cột thư mục chuyển vào bottom sheet (`MailMobileDrawer.tsx` + `.erp-mail__mSheet*` trong `mail.scss`). Dialog con dùng `fullScreen={isMobile}`. Desktop giữ nguyên 100%.
- Backup: `Mail*.backup.tsx`, `mail.backup.scss` trong `src/components/Mail/`. Chi tiết ở `ROADMAP.md` (mục MAIL — Mobile UX).

## Update - 2026-09-28 (QC / IQC / NCR_MANAGER: Tối Ưu Toàn Diện Giao Diện Mobile)
- Tạo backup `NCR_MANAGER.backup2.tsx`. Hook `isMobile` (matchMedia 768px), bảo toàn 100% desktop.
- Header, KPI, Toolbar 2 hàng, Filter Drawer 8 trường, Register Sheet 4 cards, Master->Detail mobile tap hiển thị ảnh lỗi + Holding.

## Update - 2026-09-27 (QC / IQC & DTC & KHO & MUA HANG: Tối Ưu Mobile)
- Tối ưu HOLDING, BLOCK, TEST_TABLE, DTCRESULT, DKDTC, KQDTC, KHOLIEU, TINHLIEU, QLVL.
- Universal Barcode & QR Code Scanner chuẩn Enterprise [UniversalScanner.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Scanner/UniversalScanner.tsx).

## Pitfalls Đã Xử Lý (Tham Khảo Nhanh)
- `.component_element` khóa `height:100%` → cần `height:auto!important` cho mobile root
- `inset: 0` dùng layout viewport → dùng `100dvh` + `env(safe-area-inset-bottom)` cho drawer footer
- Scanner z-index 1300 bị drawer 10000 che → prop `zIndex` tùy chỉnh
- Flex item `min-content` bóp chữ → `min-width:0; white-space:nowrap`
- Font size mobile input/select >= 14px chống auto-zoom iOS Safari.
