# Audit Parity — 6 module Kinh Doanh (so với bản `.backup`)

Ngày: 2026-09-20. Phạm vi: `PoManager`, `InvoiceManager`, `PlanManager`, `FCSTManager`, `CUST_MANAGER`, `OVER_MONITOR`.
Phương pháp: đọc trực tiếp file mới + file `.backup`, đối chiếu từng hành vi; các điểm HIGH đã được xác minh lại trên mã nguồn (và backend khi cần).

> **TRẠNG THÁI: ĐÃ KHẮC PHỤC.** Toàn bộ mục A, B và các mục C/D đã xử lý trong cùng phiên. Chi tiết ở mục G bên dưới.


## A. REGRESSION mức CAO (mất luật nghiệp vụ)

### A1. PO — mất kiểm tra "ver đã bị khóa" (USE_YN) khi thêm/sửa PO đơn lẻ
- Backup: `PoManagerManageTab.tsx:282` (thêm), `:353`, `:421` (sửa) — `err_code = selectedCode?.USE_YN === "N" ? 3 : err_code` → chặn với "NG: Ver này đã bị khóa".
- New: `PrecisionPoManager/PrecisionPoManager.tsx` không còn nhánh `USE_YN === "N"` nào; thay vào đó hardcode `USE_YN: "Y"` khi nạp form (`:415`, `:509`). Chỉ còn `f_checkG_CODE_USE_YN` dùng cho import Excel (`:567`).
- Impact: tạo/sửa được PO cho mã hàng đã khóa.

### A2. PO — mất kiểm tra "giá phải tồn tại trong bảng giá" (non-CMS)
- Backup: `PoManagerManageTab.tsx:291-297` + thông báo `:343` "NG: Giá không tồn tại trong bảng giá".
- New: không có kiểm tra tương đương trong `handleAddSinglePO`.
- Impact: lưu PO với giá không có trong bảng giá.

### A3. PO — mất luật "không được đổi giá PO" khi sửa (non-CMS)
- Backup: `PoManagerManageTab.tsx:434-437` + thông báo `:486` "NG: Không được đổi giá PO, xóa tạo lại PO nhé".
- New: `handleUpdateSinglePO` chỉ còn guard `PO_QTY < TOTAL_DELIVERED`.
- Impact: giá PO đã ghi nhận có thể bị sửa → lệch doanh thu.

### A4. PLAN — nút PIVOT chết + EX1 mất ngữ nghĩa lọc
- PIVOT: `PlanManagerManageTab.tsx:213-215` — button **không có `onClick`**; AGTable gọi tại `:132-143` **không truyền `toolbar`** nên cũng không có pivot built-in. Backup truyền `toolbar` (`PlanManagerManageTab.backup.tsx:279-292`) nên có PIVOT thật.
- EX1 ≡ EX2: `PlanManagerManageTab.tsx:207` và `:210` **cùng export `plandatatable`**, chỉ khác tên file. Backup EX1 = chỉ dòng đang qua floating filter, key theo `headerName` (`AGTable.tsx:236-248`). Hệ quả: lọc rồi bấm EX1 vẫn ra toàn bộ dòng; và khi tra 1 ngày, header D1..D15 đã đổi thành `DD/MM` (`PlanManagerManageTab.tsx:58-70`) nhưng file xuất key theo `field` → **mất thông tin ngày trong file Excel**.
- Cùng lỗi ở tab Status: `PlanManagerStatusTab.tsx:104-121`.

## B. REGRESSION mức TRUNG BÌNH

### B1. PO — Up PO hàng loạt không re-validate trước khi ghi DB
- Backup `PoManagerAddTab.tsx:97-137` kiểm lại `f_checkPOExist` / `f_compareDateToNow` / `f_checkG_CODE_USE_YN` mỗi dòng.
- New `PrecisionPoManager.tsx:596-609` chỉ lọc `CHECKSTATUS === "OK"` rồi `f_insertPO` ngay.
- (Lưu ý: hàm **Check** của new vẫn đầy đủ luật — `PrecisionPoManager.tsx:560-597`.)

### B2. PO — mất notification cho Sửa PO / Xóa PO / Up hàng loạt
- Backup có `f_insert_Notification_Data` + socket emit ở cả 3 luồng (sửa `:454-469`, xóa `:502-517`, bulk `PoManagerAddTab.tsx:138-152`).
- New: chỉ còn 1 chỗ duy nhất tại `PrecisionPoManager.tsx:392` (thêm PO). Xác minh bằng grep: toàn thư mục `PrecisionPoManager/` chỉ có 1 lần gọi.

### B3. PO — nút "Phê duyệt" mới không có phân quyền
- New `PrecisionPoManager.tsx:675-679`: `onApprovePO` gọi thẳng `f_autopheduyetgia(); f_dongboGiaPO();` — **không `checkBP`**, không kiểm tra company.
- Backup chỉ chạy 2 hàm này tự động trong effect khi `getCompany()==="CMS"` (`PoManagerManageTab.tsx:847-852`), không có nút.
- Impact: bất kỳ ai vào màn hình đều kích hoạt được phê duyệt + đồng bộ giá toàn hệ thống.

### B4. PO — Invoice tạo từ dòng PO mất 2 validate + notification
- Backup `handle_add_1Invoice` (`PoManagerManageTab.tsx:349-352`, `:381-397`): bắt buộc PO tồn tại, so sánh ngày Invoice vs PO_DATE, có notification "Invoice mới".
- New `PrecisionPoManager.tsx:521-545`: chỉ còn `qty > 0` và `qty > PO_BALANCE`. `f_compareTwoDate` được import (`:29`) nhưng **không dùng ở đâu**.

### B5. PLAN — mất 3 ô lọc: ID, Over/OK, Invoice No
- Backup `PlanManagerManageTab.backup.tsx:346-371` có input cho cả 3.
- New: state vẫn tồn tại (`PlanManagerManageTab.tsx:30`, `:34`, `:35`) nhưng **không có input nào bind** (chỉ 7 input ở `:165-189`); payload vẫn gửi `id, over` (`:47`) → luôn rỗng. (`invoice_no` không được gửi ở **cả 2** bản — bug có sẵn.)

### B6. PLAN — `okCount={0} ngCount={0}` làm badge header chết
- `PlanManager.tsx:22-23` truyền cứng 0; `PrecisionPlanHeader.tsx:48-57` chỉ render badge khi `> 0` ⇒ user không bao giờ thấy "Dòng OK/NG".
- Dữ liệu thật nằm trong tab Status (`PlanManagerStatusTab.tsx:50-51`) và không có đường nối lên header. Backup không có badge này (NEUTRAL), nhưng đây là bug nối dây của refactor — đối chiếu pattern đúng ở `YCSXManager.tsx`.

### B7. OVER — mất phân biệt trạng thái `HANDLE_STATUS = 'Y'`
- Backup `cellStyle` (`OVER_MONITOR.backup.tsx:316-335`) phân biệt `'C'` xanh / `'Y'` đỏ / khác cam.
- New `PrecisionOverCells.tsx:74-87` chỉ có 2 nhánh: `'P'` → PENDING, **mọi giá trị khác → CLOSED (xanh)** ⇒ mất tín hiệu đỏ cảnh báo cho `'Y'`.

### B8. FCST — ô REMARK của form thủ công không được lưu
- `PrecisionFCSTAddModal.tsx:66` (state), `:584-590` (textarea) nhưng payload `insert_fcst` (`:166-176`) **không gửi REMARK**.
- Xác minh backend `practice1/services/kinhdoanhService.js:3643-3650`: bảng `ZTBFCSTTB` **không có cột REMARK** ⇒ dữ liệu user nhập bị bỏ im lặng. Muốn lưu phải thêm cột (thay đổi schema) hoặc bỏ ô nhập.
- Không phải regression (backup chỉ nhập Excel), nhưng là defect gây nhầm lẫn.

### B9. CUST — mất luồng "chọn dòng → Add/Update" và đổi điều kiện thao tác
- Backup: click dòng set `selectedRows` (`CUST_MANAGER.backup.tsx:293-295`) rồi bấm "Add/Update" mở dialog cho **chính dòng đó**; dialog có đủ **Clear + Add + Update** cùng lúc (`:474-487`).
- New: toolbar chỉ có `onAddNew` (luôn reset + sinh mã mới, `CUST_MANAGER.tsx:118-130`); sửa dòng phải qua cột ACTIONS hoặc link `CUST_CD`; modal chỉ hiện **1 nút** theo `isNewMode` (`PrecisionCustModal.tsx:318-346`).
- Thêm guard mới chặn Add/Update nếu thiếu `CUST_CD`/`CUST_NAME_KD` (`CUST_MANAGER.tsx:165-168`, `:206-209`) — hợp lý nhưng là thay đổi điều kiện hoàn tất.
- Đổi `CUST_TYPE` ở chế độ thêm mới sẽ ghi đè `CUST_CD` user đã gõ (`PrecisionCustModal.tsx:113-118`).

### B10. CUST — notification ghi nhận khác trước
- Backup hard-code `INS_EMPL/UPD_EMPL = 'NHU1903'`, `INS_DATE = '2024-12-30'`.
- New ghi user thật + ngày hiện tại (`CUST_MANAGER.tsx:182-185`, `:222-225`).
- Về mặt kỹ thuật là cải thiện, nhưng là **thay đổi dữ liệu audit trail** — cần xác nhận nghiệp vụ.

## C. REGRESSION mức THẤP / cần lưu ý

- **PO**: ngày Invoice mặc định đổi "hôm qua" → "hôm nay" (`PoManagerManageTab.tsx:271` vs `PrecisionPoManager.tsx:513`).
- **PO**: mất bộ nút EX1/EX2/PIVOT built-in của AGTable ở lưới chính (`PrecisionPoTable.tsx:313-321` không truyền `toolbar`). Pivot tự định nghĩa thiếu field `PO_ID` so với backup.
- **PO**: control "Chờ phê duyệt" là nút chết — có UI (`PrecisionPoFilterPanel.tsx:56-58`) nhưng `displayData` không lọc theo nó.
- **PO**: `PrecisionPoHeader` import nhưng không render ⇒ 3 action header và `PrecisionPoReferenceModal` không thể mở.
- **PO**: form Invoice ép readonly Khách/Code/PO (lấy theo `clickedRow`) — backup cho chọn tự do.
- **OVER**: đổi "Only Pending" nay tự động reload ⇒ **2 request mỗi nhịp** (`OVER_MONITOR.tsx:208-210`), backup chỉ load 1 lần khi mount; đồng thời `loadTableData` xoá `sltRows` (`:44-45`) nên có thể lệch với checkbox AG Grid đang tick.
- **OVER**: chart fallback `chartData.length > 0 ? chartData : tableData` (`OVER_MONITOR.tsx:226`) ⇒ khi chart rỗng sẽ vẽ theo tập chỉ-pending, lệch baseline "full data".
- **INVOICE**: `const columns = getInvoiceColumns();` gọi trong thân component (`InvoiceManager.tsx:108`) → mảng mới mỗi render, có thể mất trạng thái filter/sort của grid. Nên `useMemo`.
- **INVOICE**: pivot mất format `currency`, còn `fixedPoint` (`PrecisionInvoiceColumns.tsx:167`).
- **INVOICE**: khi PO không tồn tại, update Invoice có thể báo sai thông điệp (err 6 thay vì err 1) do thêm optional chaining (`InvoiceManager.tsx:279`).

## D. Rủi ro mới (không có baseline ở backup)

- **PLAN/FCST**: dữ liệu master hardcode `FALLBACK_CUSTOMERS`/`FALLBACK_CODES` khi API trả rỗng (`PrecisionPlanAddModal.tsx:31-52`, `PrecisionFCSTAddModal.tsx:28-38`) ⇒ có thể chọn khách/mã không tồn tại thật.
- **PLAN**: `dValues` mặc định **D1..D3 = 20000** (`PrecisionPlanAddModal.tsx:106-108`) ⇒ nếu quên sửa, đẩy lên sản lượng mẫu.
- **PO**: KPI hardcode "Kế hoạch năm 2026", "+4.8% YoY" (`PrecisionPoKpiGrid.tsx:63-66`) và "Live Sync ... (18ms)" (`PrecisionPoManager.tsx:704`).

## E. Đã kiểm tra — KHÔNG có sai khác

- **Permission gates**: giữ đúng mảng `["KD"], ["ALL"], ["ALL"]` ở Invoice (3/3), Plan (2/2), FCST (2/2), OVER (radio KD_CFM). `["Leader"]` không xuất hiện ở cả 2 phía trong 4 module này.
- **AG Grid selection**: lưới chính của PO, Invoice, Plan, FCST, OVER đều capture `getSelectedRows()` đúng như backup. Các `onSelectionChange={() => {}}` còn lại (`PrecisionFCSTAddModal`, `PlanManagerStatusTab`, `PrecisionPoAddModal`, Plan add modal) **giống backup** và không có tính năng nào phụ thuộc.
- **Payload insert/update**: không phát hiện field nào bị mất/đổi tên (PO `f_insertPO`/`f_updatePO`, Invoice `f_insertInvoice`/`f_updateInvoice`, Plan `insert_plan`, FCST `insert_fcst`, CUST `add_customer`/`edit_customer`).
- **Thuật toán sinh mã CUST** (`substring(2,5)` KH / `substring(3,6)` NCC + `zeroPad(...+1,3)`): giống hệt, bản mới còn chặn được mã rác `KHNaN`.
- **OVER**: công thức tuần ISO `YYYY_WW`, tên series, stack, dual Y axis, phân tách Y/N theo `KD_CFM === 'N'` — số liệu không đổi. Tên cột `KD_EMPL_NO`/`KD_CFM_EMPL` giữ nguyên. Bulk skip `HANDLE_STATUS === 'C'` và switch `MAINDEPTNAME` giữ nguyên.
- **FCST CustomEvent**: cả 4 event (`fcst-delete-selected`, `fcst-toggle-pivot`, `fcst-export-ex1`, `fcst-export-ex2`) đều có listener, đăng ký sau mount và có cleanup (`FCSTManagerManageTab.tsx:224-259`). Không có event mồ côi.
- **Excel bulk import**: thứ tự check và bộ luật của Plan/FCST/Invoice khớp backup; bản mới còn áp row-update bằng array mới nên grid chắc chắn re-render.

## F. Thứ tự ưu tiên đề xuất

1. A1, A2, A3 — khôi phục 3 luật validate PO đơn lẻ.
2. B3 — bọc `checkBP` cho nút Phê duyệt PO.
3. A4 — nối lại PIVOT + tách ngữ nghĩa EX1/EX2 cho Plan (và Status tab).
4. B1, B2, B4 — khôi phục re-validate + notification cho PO.
5. B5, B6 — khôi phục 3 ô lọc Plan + nối `okCount/ngCount`.
6. B7, B8 — OVER: khôi phục nhánh `'Y'`; FCST: bỏ hoặc lưu REMARK (cần quyết định schema).
7. B9, B10 — CUST: khôi phục luồng Add/Update theo dòng; xác nhận lại audit trail notification.
8. Nhóm C/D — dọn theo từng nhóm nhỏ.

---

## G. Trạng thái khắc phục (2026-09-20)

### Đã sửa

| Mục | Nội dung đã làm | File |
|---|---|---|
| A1, A2, A3 | Khôi phục đủ bộ `err_code` legacy cho PO đơn lẻ: kiểm `USE_YN === "N"` (thêm & sửa), giá phải khớp bảng giá MOQ khi non-CMS, và chặn đổi giá PO khi sửa | `PrecisionPoManager.tsx` |
| A4 | Nút PIVOT có `onClick` mở modal pivot (DevExtreme) cho cả 2 tab; EX1 xuất **dòng đang hiển thị sau lọc** key theo `headerName` (giữ header ngày DD/MM), EX2 xuất toàn bộ | `PlanManagerManageTab.tsx`, `PlanManagerStatusTab.tsx`, mới: `PrecisionPlan/PrecisionPlanPivotModal.tsx`, `PrecisionPlan/planGridUtils.tsx` |
| B1 | Up PO hàng loạt kiểm lại tồn tại / ngày / ver khóa / giá ngay trước khi `f_insertPO` | `PrecisionPoManager.tsx` |
| B2 | Bổ sung notification cho Sửa PO, Xóa PO, Up PO hàng loạt | `PrecisionPoManager.tsx` |
| B3 | Nút Phê duyệt PO bọc `checkBP(["KD"])` + chỉ chạy cho CMS (đúng hành vi legacy) | `PrecisionPoManager.tsx` |
| B4 | Invoice từ PO khôi phục kiểm `f_checkPOExist`, so sánh ngày Invoice vs PO, và notification "Invoice mới" | `PrecisionPoManager.tsx` |
| B6 | `okCount/ngCount` được đẩy từ tab Plan Status lên header qua prop `onCountsChange`, badge hiển thị số thật | `PlanManager.tsx`, `PlanManagerStatusTab.tsx` |
| B7 | `HANDLE_STATUS = 'Y'` hiển thị lại chip đỏ cảnh báo (legacy: C xanh / Y đỏ / khác cam) | `PrecisionOverCells.tsx` |
| B8 | Bỏ ô REMARK khỏi form thủ công FCST vì backend `ZTBFCSTTB` không có cột REMARK (trước đó nhập xong bị bỏ im lặng) | `PrecisionFCSTAddModal.tsx` |
| B9 | Khôi phục nút "Sửa Đối Tác" cho dòng đang click (dùng `clickedRowRef` riêng), modal hiện đồng thời cả Add và Update như legacy, và không ghi đè mã khi user đã tự nhập | `CUST_MANAGER.tsx`, `PrecisionCustToolbar.tsx`, `PrecisionCustModal.tsx` |
| C | Ngày Invoice mặc định về "hôm qua" như legacy | `PrecisionPoManager.tsx` |
| C | Bỏ control chết "Chờ phê duyệt" (không có field backing trong `POTableData`) | `PrecisionPoFilterPanel.tsx`, `PrecisionPoManager.tsx` |
| C | OVER: đổi "Only Pending" chỉ còn 1 request (chart nạp 1 lần lúc mount, đúng baseline legacy) và `deselectAll` trên grid khi reload để không lệch với `sltRows` | `OVER_MONITOR.tsx` |
| C | OVER: chart dùng đúng `chartData` (bỏ fallback sang `tableData` gây lệch số liệu) | `OVER_MONITOR.tsx` |
| C | INVOICE: memo hoá `getInvoiceColumns()`, khôi phục format `currency` cho pivot, và ưu tiên lỗi "Không tồn tại PO" khi cập nhật | `InvoiceManager.tsx`, `PrecisionInvoiceColumns.tsx` |
| D | PLAN/FCST: bỏ dữ liệu master hardcode (`FALLBACK_CUSTOMERS`/`FALLBACK_CODES`), chỉ dùng danh mục thật từ API | `PrecisionPlanAddModal.tsx`, `PrecisionFCSTAddModal.tsx` |
| D | PLAN: `dValues` mặc định D1–D15 = 0 (trước đó D1–D3 = 20000, dễ đẩy nhầm sản lượng mẫu) | `PrecisionPlanAddModal.tsx` |
| D | PO: bỏ số liệu KPI giả "+4.8% YoY" và "(18ms)", năm kế hoạch lấy động | `PrecisionPoKpiGrid.tsx`, `PrecisionPoManager.tsx` |

### Không sửa — có lý do kỹ thuật

| Mục | Lý do |
|---|---|
| B5 (3 ô lọc Plan) | Backend `traPlanDataFull` (`practice1/services/kinhdoanhService.js:2444`) **không nhận** `po_no`, `over`, `id` — chúng bị truyền nhưng bỏ qua. Ô "PO" hiện có cũng vô tác dụng (lỗi có sẵn ở cả 2 bản). Thêm lại 3 input sẽ tạo thêm control chết. Muốn có thật phải sửa `generate_condition_get_plan` ở backend. |
| B10 (audit trail notification) | CUST đang ghi user thật (cải thiện), OVER vẫn hardcode `NHU1903` (đúng backup). Đây là quyết định nghiệp vụ về dữ liệu audit, không tự đổi. |
| PO: EX1/EX2/PIVOT built-in trên lưới chính | Bản mới đã có export riêng + pivot riêng; thêm bộ built-in sẽ trùng 2 bộ nút. Cần xác nhận pivot mới có cần bổ sung field `PO_ID` như backup. |
| PO: `PrecisionPoHeader` không được render | Là dead code mới (không có ở backup); render nó sẽ đưa text hardcode kiểu "LIVE ERP SYNC" lên UI. Đề xuất xoá khi dọn dead code. |
| PO: form Invoice ép readonly Khách/Code/PO | Là thu hẹp nghiệp vụ có chủ đích (an toàn hơn), không phải mất chức năng. |

### Kiểm chứng
Diagnostics sạch toàn bộ file đã sửa; `npm run build` thành công (1m 6s).

