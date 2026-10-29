# ERP Context & Status

## Update - 2026-10-29 (QC / IQC: Thêm Checkbox Lọc Nhanh DTC_RESULT OK)
- **Mục tiêu**: Bổ sung checkbox không tên ngay sau nút `Update NCR_ID` trên toolbar bảng dữ liệu Incoming tại màn hình IQC ([INCOMMING.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/INCOMMING.tsx)).
- **Logic & Giao diện**:
  - Checkbox mặc định checked (`onlyDtcOk = true`): lưới Incoming chỉ hiển thị các dòng có `DTC_RESULT` là `"OK"` (chuẩn hóa `row.DTC_RESULT?.toString().trim().toUpperCase() === "OK"`).
  - Khi bỏ chọn checkbox (`onlyDtcOk = false`): lưới Incoming hiển thị đầy đủ toàn bộ dữ liệu như hiện tại.
  - Tích hợp chuẩn hóa cả trên Desktop ([PrecisionIncomingGridToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionINCOMMING/PrecisionIncomingGridToolbar.tsx)) và Bottom Sheet ĐTC trên Mobile ([PrecisionIncomingMobileDtcSheet.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionINCOMMING/PrecisionIncomingMobileDtcSheet.tsx)).
  - Bổ sung `dataAlias={incoming.iqc1datatable}` cho [PrecisionIncomingTable.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionINCOMMING/PrecisionIncomingTable.tsx) để giữ trọn vẹn khả năng xuất Excel EX1 theo dữ liệu đang hiển thị trên AG Grid và EX2 toàn bộ mảng gốc.
  - Bổ sung định dạng CSS/SCSS compact ERP không inline style ([PrecisionINCOMMING.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iqc/PrecisionINCOMMING/PrecisionINCOMMING.scss)), màu checkbox xanh lá (`#059669`) đồng bộ nhận diện kết quả OK.

## Update - 2026-10-26 (EMAIL: Khắc Phục Lỗi Đồng Bộ Dừng Ngày 15/10 & Kẹt Ở 387/442)
- **Mục tiêu**: Xử lý triệt để phản ánh đồng bộ email không có thư mới sau 15/10/2026, kẹt 387/442 dù server có 442 email.
- **Khắc phục**:
  - Chuyển tài khoản `nvh1903@cmsbando.com` sang POP3S Cổng 995 (Bảo mật SSL/TLS, `POP3_SECURE = true`) và SMTP Cổng 25: vượt qua rào cản DPI của tường lửa mạng trên cổng 110 (từng drop gói tin email spam msg #383).
  - Tối ưu `services/mail/mailIngest.js`: Luôn đọc `skippedUidls`, tự động cách ly UIDL lỗi `RETR_FAILED` vào bảng `ZTB_MAIL_SYNC_SKIP` chống treo vĩnh viễn hàng đợi, tự động reconnect kết nối POP3 khi socket bị ngắt và cập nhật trạng thái cảnh báo chuẩn xác.
  - Đồng bộ thành công 100% toàn bộ 442 email đến tận ngày 24/10/2026, hiển thị trạng thái hoàn tất 442/442.

## Update - 2026-10-21 (QC / OQC: Thêm Tab "OQC_Quản lý xuất hàng" & Command Backend)
- **Mục tiêu**: Bổ sung tab mới "OQC_Quản lý xuất hàng" trên màn hình OQC [OQC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/OQC.tsx), tra cứu dữ liệu xuất hàng theo câu truy vấn SQL nghiệp vụ (liên kết `tbl_InputOutput`, `P501`, `ZTB_OQC_OUTGOING_SCAN`, `ZTB_OQC_SAMPLING_STANDARD_AQL`, `M100`, `M110`), lọc theo khoảng ngày, khách hàng, code `G_NAME`, code `G_CODE`.
- **Thực hiện Backend ([qcService.js](file:///g:/NODEJS/practice1/services/qcService.js))**:
  - Thêm 2 command `traOQCShippingData` & `oqc_shipping_management`: nhận các biến `FROM_DATE`, `TO_DATE`, `G_NAME`, `G_CODE`, `CUST_NAME`, escape an toàn ký tự nháy đơn.
  - Tích hợp câu truy vấn CTE chuẩn hóa: tính toán `OUT_ID_KEY`, `WEEK_`, `OUT_SHIFT`, `OUT_DATE`, `PO_TYPE`, `CUST_NAME_KD`, `G_CODE`, `G_NAME`, `PLAN_ID`, `OUT_QTY`, `SAMPLING_QTY`, `SAMPLE_NG_QTY_TT`, `RATE_OK`, `OUT_STATUS_RESULT`, `OUT_CUST_NAME`.
- **Thực hiện Frontend ([OQC_SHIPPING_MANAGEMENT.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/OQC_SHIPPING_MANAGEMENT.tsx), `src/pages/qc/oqc/PrecisionOQCShipping/`)**:
  - Module hóa sạch sẽ chuẩn Google Stitch Enterprise theo phong cách [OQC_DATA.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/OQC_DATA.tsx):
    - [OQCShippingTypes.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShippingTypes.ts): Định nghĩa kiểu dữ liệu `OQC_SHIPPING_ROW`, `OQCShippingFilterState`, `OQCShippingKpiMetrics`.
    - [useOQCShippingData.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/useOQCShippingData.ts): Quản lý state bộ lọc, gọi `generalQuery("traOQCShippingData")`, tính KPI thời gian thực, xuất Excel EX1 (lưới lọc) & EX2 (toàn bộ).
    - [OQCShippingHeader.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShippingHeader.tsx): Header thanh bar tiêu chuẩn ERP, trạng thái hệ thống, nút Làm Mới, Toàn Màn Hình.
    - [OQCShippingKpi.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShippingKpi.tsx): 4 thẻ KPI (Tổng lượt xuất & Tỷ lệ Pass, Tổng sản lượng xuất OUT_QTY, Lấy mẫu AQL & Mẫu lỗi PPM, Tỷ lệ OK bình quân & Ca ngày/đêm) + Strip thông tin vận hành tóm tắt.
    - [OQCShippingToolbar.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShippingToolbar.tsx): Bộ lọc 5 trường (Từ ngày, Đến ngày, Khách hàng, Tên SP/G_NAME, Mã G_CODE), phím tắt Enter, Quick Search, 2 nút Excel và badge đếm dòng.
    - [OQCShippingTable.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShippingTable.tsx): AGTable compact high-density triệt tiêu toolbar/footer thừa.
    - [OQCShippingColumns.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShippingColumns.tsx): Định dạng chuẩn số lượng (`.toLocaleString("en-US")`), font JetBrains Mono, style màu sắc nổi bật (Mã G_CODE xanh dương, Sản lượng xuất xanh ngọc, Mẫu NG đỏ, Tỷ lệ OK xanh lá/đỏ, Badge trạng thái Pass xanh lá, Pending cam, Closed xanh dương, Badge Ca Day/Night, Badge Tuần).
    - [OQCShipping.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/PrecisionOQCShipping/OQCShipping.scss): Bố cục layout SCSS thuần, responsive, high-density, không inline styles thừa.
- **Tích hợp Tab ([OQC.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/oqc/OQC.tsx))**: Thêm tab `<MyTabs.Tab title={"OQC_Quản lý xuất hàng"}>` render `<OQC_SHIPPING_MANAGEMENT />`.

## Update - 2026-10-20 (NHAN SU / DIEM DANH NHOM: Đồng Bộ & Chuẩn Hóa Logic Nút Điểm Danh Nghỉ 50%)
- **Mục tiêu**: So sánh và đồng bộ logic nút "Điểm danh nghỉ 50%" giữa [DiemDanhNhomCMS.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.tsx) ([PrecisionAttendanceCell.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/nhansu/DiemDanhNhom/PrecisionDiemDanh/PrecisionAttendanceCell.tsx)) và bản gốc [DiemDanhNhomCMS.backup.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.backup.tsx) ([AttendanceCell.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/nhansu/DiemDanhNhom/components/AttendanceCell.tsx)).
- **Khắc phục**:
  - Chuẩn hóa hiển thị trạng thái đã điểm danh của [PrecisionAttendanceCell.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/nhansu/DiemDanhNhom/PrecisionDiemDanh/PrecisionAttendanceCell.tsx) thành `{isPresent ? 'Đi làm' : 'Nghỉ làm'}` chuẩn 100% theo bản gốc.
  - Bổ sung `REMARK: 'AUTO'` khi `dangkynghi_auto` hoàn tất và `REMARK: null` khi `onReset()` thành công, đảm bảo nút Reset hoạt động triệt để ngay lập tức.

## Update - 2026-10-13 (REPORT / CENTRAL SCHEDULER: Bộ Lập Lịch Refresh Chung 10 Phút & Reload Guard)
- **Mục tiêu**: Đặt lịch refresh chung cho toàn bộ hệ thống báo cáo ERP là **10 phút** (`minIntervalMinutes = 10`), cứ 10 phút chạy cập nhật tất cả các báo cáo một lần. Thiết kế Central Registry (`REPORT_REGISTRY`), Reload Guard chống spam (`shouldSyncReport`), Polling 60s, tích hợp shutdown an toàn ([reportSyncService.js](file:///g:/NODEJS/practice1/services/reportSyncService.js), [index.js](file:///g:/NODEJS/practice1/index.js), [SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/report_table_refactoring/SKILL.md)).

## Update - 2026-10-13 (SHARED / RECHARTS: Fix Triệt Để Runtime Error DecimalError Invalid argument: NaN)
- **Khắc phục**: Tại 5 component biểu đồ ([KDDailyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDDailyClosing.tsx), [KDWeeklyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDWeeklyClosing.tsx), [KDMonthlyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDMonthlyClosing.tsx), [KDYearlyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDYearlyClosing.tsx), [ChartWeekLyPO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/ChartWeekLyPO.tsx)), tách logic tính `maxLeft` và `maxRight` vào các hook `useMemo` dạng pure `number[]`, loại bỏ trả về `'auto'` gây crash Decimal khi data rỗng.

## Update - 2026-10-13 (REPORT / KINH DOANH REPORT: Nâng Cấp Báo Cáo Sang Bảng Summary RP_*)
- **Mục tiêu**: Nâng cấp toàn diện màn hình [KinhDoanhReport.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport.tsx) từ truy vấn trực tiếp hàng chục triệu dòng dữ liệu backdata sang truy vấn bảng summary `RP_*`. Thời gian phản hồi giảm từ hàng chục giây xuống dưới 100ms. Hiển thị badge thời gian đồng bộ và nút Cập Nhật Mới Nhất.

## Update - 2026-10-12 (KD / YCSX: Hiển Thị Đầy Đủ Swal.fire Khi Bấm Nút Tra Cứu YCSX)
- **Khắc phục**: Sửa lỗi truyền SyntheticEvent làm đối số biến `isSilent` thành truthy khiến Swal.fire bị bỏ qua khi click chuột tại nút tra cứu ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts), [PrecisionYCSXFilterPanel.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionYCSXFilterPanel.tsx)).

## Update - 2026-10-12 (SYSTEM / API TIMEOUT: Nâng Timeout Toàn Bộ Lên 5 Phút)
- **Thực hiện**: Nâng timeout API lên 5 phút (`DEFAULT_API_TIMEOUT = 300000`) trên Frontend [Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts) và Backend `DB_REQUEST_TIMEOUT` [database_mssql.js](file:///g:/NODEJS/practice1/config/database_mssql.js).

## Update - 2026-10-12 (KHO / KHOTP: Rà Soát Phục Hồi Toàn Bộ Cột Bị Thiếu So Với Bản Backup)
- **Khắc phục**: Bổ sung `IO_Shift` và `IO_Status` (kèm badge trạng thái) cho bảng Nhập/Xuất Kho; bổ sung toàn bộ 14 cột kết quả kiểm tra DTC cho bảng Xuất Pack ([KHOTP.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/khotp/KHOTP.tsx), [PrecisionKHOTPColumns.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/khotp/PrecisionKHOTP/PrecisionKHOTPColumns.tsx)).

## Update - 2026-10-08 (KD / YCSX & CHAT: Tự Động updateCDP400, Multi-Select Phòng Ban Tạo Nhóm, Sharelink Gia Nhập Phòng)
- **Thực hiện**: Tự động gọi `updateCDP400` trước khi tra cứu YCSX; hỗ trợ chọn nhiều bộ phận tạo nhóm chat liên phòng ban; tính năng chia sẻ link gia nhập phòng chat và dialog xác nhận tham gia.

## Update - 2026-10-06 (QC / ISO / CALIBRATION: Upload File PDF Kết Quả Hiệu Chuẩn)
- **Thực hiện**: Upload file PDF kết quả hiệu chuẩn, thêm cột File Kết Quả trên bảng AGTable với 2 nút Xem PDF và Tải về trực tiếp ([CALIBRATION.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/qc/iso/CALIBRATION/CALIBRATION.tsx)).

## Pitfalls Đã Xử Lý (Tham Khảo Nhanh)
- `.component_element` khóa `height:100%` → cần `height:auto!important` cho mobile root
- `inset: 0` dùng layout viewport → dùng `100dvh` + `env(safe-area-inset-bottom)` cho drawer footer
- Scanner z-index 1300 bị drawer 10000 che → prop `zIndex` tùy chỉnh
- Flex item `min-content` bóp chữ → `min-width:0; white-space:nowrap`
- Font size mobile input/select >= 14px chống auto-zoom iOS Safari.
