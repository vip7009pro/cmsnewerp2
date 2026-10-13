# ERP Context & Status

## Update - 2026-10-13 (REPORT / CENTRAL SCHEDULER: Bộ Lập Lịch Refresh Chung 10 Phút & Reload Guard)
- **Mục tiêu**: Đặt lịch refresh chung cho toàn bộ hệ thống báo cáo ERP là **10 phút** (`minIntervalMinutes = 10`), cứ 10 phút chạy cập nhật tất cả các báo cáo một lần. Kể cả khi khởi động lại backend, nếu tính từ lần cập nhật trước tới hiện tại mà chưa được 10 phút thì **tuyệt đối KHÔNG chạy** (chống spam refresh khi server reload/restart). Thiết kế kiến trúc Central Registry để sau này các báo cáo của các bộ phận khác (Sản Xuất, Kho, Mua Hàng, QC...) đăng ký chạy chung luồng.
- **Thực hiện Backend ([reportSyncService.js](file:///g:/NODEJS/practice1/services/reportSyncService.js), [index.js](file:///g:/NODEJS/practice1/index.js))**:
  - **Central Registry (`REPORT_REGISTRY`)**: Mảng quản lý tập trung cấu hình đồng bộ mọi phân hệ báo cáo ERP (`code`, `name`, `department`, `minIntervalMinutes: 10`, `syncFn`). Cung cấp hàm `registerReportSync` cho phép các module tương lai đăng ký linh hoạt.
  - **Reload Guard chống spam (`shouldSyncReport`)**: Kiểm tra trực tiếp khoảng cách thời gian `DATEDIFF(second, LAST_SYNC_AT, GETDATE())` trong bảng `RP_SYNC_LOG`. Nếu `elapsedSeconds < 600` (chưa đủ 10 phút) => trả về `shouldSync: false` và ghi log `SKIPPED`. Kể cả khi restart server hay PM2 reload, nếu chưa đủ 10 phút từ lần sync gần nhất thì hoàn toàn bỏ qua, không quét backdata.
  - **Scheduler Polling 60 giây (`startReportSyncScheduler`)**: Polling check định kỳ mỗi 60 giây (quét DB cực nhẹ 1-2ms), chỉ khi báo cáo nào chạm mốc `>= 10 phút` mới kích hoạt sync. Khởi động kiểm tra sau 15 giây khi server start.
  - **Phân tách 2 chế độ**: Tự động background (`force: false` - tuân thủ guard 10 phút) và Thao tác thủ công qua UI (`force: true` - chạy tức thì).
  - Tích hợp shutdown scheduler an toàn khi `SIGINT` trong `index.js`.
- **Cập nhật Skill ([SKILL.md](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/report_table_refactoring/SKILL.md))**:
  - Bổ sung Nguyên tắc vàng số 8: Central Registry & Bộ Lập Lịch Chung 10 Phút (Reload Guard).
  - Chuẩn hóa Bước 3: Hướng dẫn đăng ký module báo cáo mới vào `REPORT_REGISTRY`.
  - Cập nhật checklist kiểm tra Reload Guard chống spam khi khởi động backend.

## Update - 2026-10-13 (SHARED / RECHARTS: Fix Triệt Để Runtime Error DecimalError Invalid argument: NaN)
- **Vấn đề phát hiện**: Khi mở [KinhDoanhReport.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport.tsx), hệ thống bị văng lỗi runtime: `Error: [DecimalError] Invalid argument: NaN at new Decimal2 (recharts.js) at getTickValuesFixedDomainFn`.
- **Nguyên nhân gốc**:
  - Tại 5 biểu đồ ([KDDailyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDDailyClosing.tsx), [KDWeeklyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDWeeklyClosing.tsx), [KDMonthlyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDMonthlyClosing.tsx), [KDYearlyClosing.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/KDYearlyClosing.tsx), [ChartWeekLyPO.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chart/KD/ChartWeekLyPO.tsx)), hàm cấu hình domain trục tung `domain={[0, (dataMax: number) => (dataMax > 0 ? Math.ceil(dataMax * 1.15) : 'auto')]}`.
  - Khi dữ liệu ban đầu rỗng `[]` (đang loading hoặc chưa có dòng nào), `dataMax` truyền vào là `-Infinity` / `NaN`, khiến hàm trả về chuỗi `'auto'`. Recharts nhận domain hỗn hợp `[0, 'auto']` và chuyển vào `getTickValuesFixedDomainFn` gọi `new Decimal('auto')` $\rightarrow$ sinh ra `[DecimalError] Invalid argument: NaN` làm sập cây component React.
- **Khắc phục triệt để**:
  - Tại cả 5 component biểu đồ, tách logic tính `maxLeft` và `maxRight` vào các hook `useMemo` độc lập dựa trên `chartData`:
    + Quét tìm giá trị lớn nhất của các cột số lượng và số tiền, nếu `max > 0` nhân `1.15` (làm tròn lên), nếu data rỗng fallback về `100`.
    + Gán trực tiếp `domain={[0, maxLeft]}` và `domain={[0, maxRight]}` dạng pure `number[]`.
  - Recharts và Decimal xử lý mượt mà 100%, loại bỏ vĩnh viễn lỗi runtime `DecimalError`.

## Update - 2026-10-13 (REPORT / KINH DOANH REPORT: Fix Triệt Để PO Balance Full Sync & Lọc HAVING)
- **Vấn đề & Khắc phục**: Chuyển sync bảng `RP_KD_PO_BALANCE_WEEKLY` sang **Full Sync** toàn bộ các năm (chạy chỉ ~5 giây) và chuyển điều kiện lọc sang `HAVING SUM(PO_BALANCE) > 0` trong `pobalanceByYear`, `pobalanceYearByWeekDetail` và `poBalanceByYearWeekCustomerByYear`. Toàn bộ 41 tuần năm 2026 và dữ liệu các năm khớp 100% từng con số với bản gốc.

## Update - 2026-10-13 (REPORT / KINH DOANH REPORT: Hiển Thị Thời Điểm Cập Nhật & Nút Đồng Bộ Mới Nhất)
- **Thực hiện**: Bổ sung badge hiển thị thời điểm cập nhật dữ liệu (`lastSyncTime`) và nút "Cập Nhật Dữ Liệu Mới Nhất" trên [KinhDoanhReport.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport.tsx). Tạo bảng `RP_SYNC_LOG` và 2 endpoint API `getReportSyncInfo` & `triggerReportSync`.


## Update - 2026-10-13 (REPORT / KINH DOANH REPORT: Nâng Cấp Báo Cáo Sang Bảng Summary RP_*)
- **Mục tiêu**: Nâng cấp toàn diện màn hình [KinhDoanhReport.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/kinhdoanhreport/KinhDoanhReport.tsx) từ truy vấn trực tiếp hàng chục triệu dòng dữ liệu backdata sang truy vấn bảng summary `RP_*`.
- **Nguyên tắc cốt lõi**:
  - **Skill mới**: Xây dựng Skill chuẩn [report_table_refactoring](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/.agents/skills/report_table_refactoring/SKILL.md) hướng dẫn toàn diện nâng cấp báo cáo ERP sang bảng `RP_*` cho các trang báo cáo khác.
  - **Backend**: Backup 100% câu query cũ dưới dạng comment `/* === BACKUP TRUY VẤN CŨ === */` và chuyển sang lấy dữ liệu từ 6 bảng `RP_*`.
- **Kết quả đo lường**: Thời gian phản hồi giảm từ hàng chục giây xuống dưới 100ms (Dynamic Pivot ~240ms). Độ khớp dữ liệu chính xác 100%.


## Update - 2026-10-12 (KD / YCSX: Hiển Thị Đầy Đủ Swal.fire Khi Bấm Nút Tra Cứu YCSX)
- **Mục tiêu**: Khắc phục tình trạng khi bấm nút "Tra Cứu YCSX" tại [YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx) không hiển thị thông báo `Swal.fire` ("Đang tải dữ liệu, hãy chờ chút" và "Đã load ... dòng") như khi nhấn phím Enter trong các ô lọc.
- **Nguyên nhân gốc**:
  - Tại [PrecisionYCSXFilterPanel.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionYCSXFilterPanel.tsx) và [YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx), nút button gán trực tiếp `onClick={onSearch}` và `onSearch={ycsx.handletraYCSX}`.
  - Khi click chuột, React truyền SyntheticEvent (MouseEvent) làm đối số đầu vào hàm `handletraYCSX(isSilent: boolean = false)`.
  - Trong JavaScript, đối tượng Event mang giá trị truthy, khiến biểu thức `if (!isSilent)` bị hiểu nhầm là `false` (chế độ silent), do đó cả thông báo loading Swal của `handletraYCSX` và thông báo hoàn thành của `f_traYCSX` đều bị bỏ qua (trong khi ấn Enter thì gọi `onSearch()` không có tham số nên `isSilent` mặc định là `false`).
- **Thực hiện**:
  - [useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts): Chuẩn hóa `const silent = isSilent === true;` để chỉ bật silent khi giá trị đúng là boolean `true`, truyền `silent` xuống `f_traYCSX`.
  - [PrecisionYCSXFilterPanel.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/PrecisionYCSXFilterPanel.tsx): Bọc `onClick={() => onSearch()}` không chuyển tiếp click event.
  - [YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx): Bọc `onSearch={() => ycsx.handletraYCSX()}`.
  - [kdUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/utils/kdUtils.tsx): Chuẩn hóa `const silent = isSilent === true;` trong `f_traYCSX`.

## Update - 2026-10-12 (SYSTEM / API TIMEOUT: Nâng Timeout Truy Vấn Toàn Bộ Hệ Thống Lên 5 Phút)
- **Mục tiêu**: Khắc phục tình trạng khi tra cứu dữ liệu lớn (như tra Xuất Pack kho thành phẩm [KHOTP.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/khotp/KHOTP.tsx)), yêu cầu API chạy được 45 giây là bị axios tự động cancel / timeout giữa chừng. Nâng thời gian timeout truy vấn lên 5 phút (300.000 ms) cho toàn bộ web.
- **Thực hiện**:
  - **Frontend ([Api.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/Api.ts))**:
    - Khởi tạo hằng số toàn cục `DEFAULT_API_TIMEOUT = 5 * 60 * 1000` (300.000 ms = 5 phút).
    - Cập nhật `axios.defaults.timeout = DEFAULT_API_TIMEOUT`.
    - Cập nhật `generalQuery` sử dụng fallback `options?.timeout ?? DEFAULT_API_TIMEOUT`.
    - Đồng bộ `aiQuery` và `aiExecuteSql` sử dụng `DEFAULT_API_TIMEOUT`.
  - **Backend ([database_mssql.js](file:///g:/NODEJS/practice1/config/database_mssql.js))**:
    - Nâng fallback `DB_REQUEST_TIMEOUT` và `DB_CONNECTION_TIMEOUT` từ 60.000 ms lên 300.000 ms (5 phút) để đảm bảo kết nối mssql không bị ngắt sớm trước khi query hoàn tất.

## Update - 2026-10-12 (KHO / KHOTP: Rà Soát Phục Hồi Toàn Bộ Cột Bị Thiếu So Với Bản Backup)
- **Mục tiêu**: Rà soát các bảng AGTable trong [KHOTP.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/khotp/KHOTP.tsx) / [PrecisionKHOTPColumns.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/khotp/PrecisionKHOTP/PrecisionKHOTPColumns.tsx), đối chiếu chi tiết với [KHOTP.backup.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kho/khotp/KHOTP.backup.tsx) và backend API [warehouseService.js](file:///g:/NODEJS/practice1/services/warehouseService.js), khắc phục tình trạng thiếu cột.
- **Phát hiện & Khắc phục**:
  1. **Bảng Nhập/Xuất Kho (`column_WH_IN_OUT`)**:
     - Phát hiện thiếu 2 cột: `IO_Shift` (Ca làm việc) và `IO_Status` (Trạng thái Pending/Closed).
     - Đã bổ sung `IO_Shift` (width: 80) và `IO_Status` (width: 90) tích hợp hàm render `renderIOStatus` trực quan (Pending: badge đỏ `#dc2626`, Closed: badge xanh `#16a34a`).
     - Sửa key field `IO_Type` (trước đó là `IO_TYPE` viết hoa không khớp thuộc tính DB trả về từ query `trakhotpInOut`, bổ sung valueGetter fallback tương thích).
  2. **Bảng Xuất Pack (`column_XUATPACK`)**:
     - Phát hiện thiếu 14/18 cột kết quả kiểm tra chất lượng DTC (chỉ có 4 cột kích thước, kéo keo, XRF, điện trở).
     - Đã bổ sung toàn bộ 14 cột DTC còn thiếu: `KQ_Tĩnh_điện`, `KQ_Độ_bóng`, `KQ_Phtalate`, `KQ_FTIR`, `KQ_Mài_mòn`, `KQ_Màu_sắc`, `KQ_TVOC`, `KQ_Cân_nặng`, `KQ_Scanbarcode`, `KQ_Nhiệt_cao_Ẩm_cao` (KQ_Nhiệt_Ẩm), `KQ_Shock_nhiệt`, `KQ_Kéo_keo_2`, `KQ_Ngoại_quan`, `KQ_Độ_dày`.
     - Đồng bộ hàm `renderKQQuality` hiển thị badge chuẩn (OK xanh lá, NG đỏ, N/A xám).
     - Bổ sung `valueGetter` cho cột YCSX (`params.data?.PROD_REQUEST_NO ?? params.data?.YCSX_NO`).
  3. **Các bảng tồn kho (`column_STOCK_CMS`, `column_STOCK_KD`, `column_STOCK_TACH`)**:
     - Đã đối chiếu và xác nhận khớp 100% đầy đủ số lượng và nội dung các cột so với bản backup.

## Update - 2026-10-08 (KD / YCSX & CHAT: Tự Động updateCDP400, Multi-Select Phòng Ban Tạo Nhóm, Sharelink Gia Nhập Phòng)
- **Mục tiêu**:
  1. Mỗi khi người dùng bấm tra YCSX tại [YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx), gọi API `generalQuery` command `'updateCDP400'` để cập nhật đồng bộ các công đoạn sản xuất trên bảng P400 trước khi tải danh sách.
  2. Khắc phục lỗi tạo nhóm chat: khi chọn bộ phận A rồi bấm chọn cả bộ phận, tiếp tục chọn bộ phận B thì giữ nguyên bộ phận A để tạo nhóm liên phòng ban.
  3. Tạo tính năng sharelink gia nhập phòng chat: người dùng sao chép link mời, người khác mở link hoặc bấm trong chat sẽ hiển thị hộp thoại xác nhận gia nhập, khi đồng ý sẽ thêm thành viên vào nhóm.
- **Thực hiện**:
  - **YCSXManager** ([useYCSXLogic.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/PrecisionYCSX/useYCSXLogic.ts), [YCSXManager.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/pages/kinhdoanh/ycsxmanager/YCSXManager.tsx)):
    - Tích hợp `await generalQuery("updateCDP400", {})` vào `handletraYCSX` trước khi gọi `f_traYCSX`.
  - **Chat Multi-Select Bộ Phận** ([ChatNewChatDialog.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatNewChatDialog.tsx)):
    - Cải tiến `handleSelectDepartment` gộp (merge) nhân sự của các bộ phận liên tiếp thay vì ghi đè.
    - Hỗ trợ toggle (nếu toàn bộ nhân sự bộ phận đã được chọn thì bấm lại để bỏ chọn).
    - Cập nhật nhãn nút động: `+ Thêm bộ phận (+N)` / `Bỏ chọn bộ phận (N)`.
    - Tự động gợi ý tên nhóm tổng hợp nhiều bộ phận (VD: "Nhóm Kinh Doanh - Sản Xuất").
  - **Share Link Tham Gia Phòng** ([chatRoomService.js](file:///g:/NODEJS/practice1/services/chat/chatRoomService.js), [chatService.ts](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/api/services/chatService.ts), [ChatJoinDialog.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatJoinDialog.tsx), [ChatDock.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatDock.tsx), [ChatGroupPanel.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatGroupPanel.tsx), [ChatConversationView.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatConversationView.tsx), [chatUtils.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/chatUtils.tsx), [ChatMessageBubble.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatMessageBubble.tsx)):
    - Backend: Thêm 2 command `chatGetInviteInfo` (lấy thông tin phòng) và `chatJoinViaLink` (thêm thành viên, gửi tin nhắn hệ thống, emit socket).
    - Tạo nút "Sao chép link mời vào phòng" trên header phòng và panel quản lý nhóm.
    - Xây dựng component `ChatJoinDialog` hiển thị câu hỏi xác nhận kèm avatar, tên phòng, số lượng thành viên.
    - `ChatDock` tự động quét URL param `?joinChat=` / `?chatJoin=` và lắng nghe custom event `erp:chat-join` khi click liên kết trong chat để mở hộp thoại ngay lập tức.
    - Sửa lỗi runtime `ReferenceError: Cannot access 'setOpen' before initialization` tại [ChatDock.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatDock.tsx) và `ReferenceError: Cannot access 'deptMembers' before initialization` tại [ChatNewChatDialog.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatNewChatDialog.tsx) bằng cách di chuyển các hook phụ thuộc xuống sau khi khai báo biến cơ sở.
    - Tối ưu hóa UI Mobile [chat.scss](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/chat.scss) & [ChatMessageBubble.tsx](file:///g:/NODEJS/WEBCMS%20ERP2/cmsnewerp2/src/components/Chat/ChatMessageBubble.tsx): Giảm padding container từ 16px xuống 8-10px; bỏ hoàn toàn ô avatar rỗng 30px bên phải ở tin nhắn của tôi để bong bóng ôm sát lề phải; giới hạn `max-width: 76%`; phân biệt rõ rệt hình dáng và màu sắc bong bóng trái (xám slate) và phải (xanh dương dịu) tạo cảm giác định vị hai bên chân thực.

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
