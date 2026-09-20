# Audit Parity — 5 module QC/DTC (so với bản `.backup`)

Ngày: 2026-09-20. Phạm vi: `INCOMMING`, `DKDTC`, `ADDSPECDTC`, `DTCRESULT`, `TEST_TABLE`.
Phương pháp: đọc trực tiếp file mới + file `.backup`, đối chiếu từng hành vi; các điểm nghi vấn được xác minh lại trên backend (`practice1/services/qcService.js`) trước khi kết luận.

> **TRẠNG THÁI: ĐÃ KHẮC PHỤC** toàn bộ mục A và B trong cùng phiên. Mục C ghi nhận các điểm đã kiểm tra nhưng giữ nguyên có chủ đích.

## A. REGRESSION (mất luật nghiệp vụ — đã sửa)

### A1. INCOMMING — mất gate quyền sửa kết quả trực tiếp trên lưới
- Backup `INCOMMING.backup.tsx:600-612` (`handleUpdateData`): `if (userData?.SUBDEPTNAME?.includes("IQC")) {...} else Swal.fire("Bạn không có quyền thực hiện")`.
- New `PrecisionINCOMMING/useIncomingData.ts:505` (`updateDataTable`) **không có gate nào**; checkbox `TOTAL_RESULT` / `IQC_TEST_RESULT` / `DTC_RESULT` (`PrecisionIncomingColumns.tsx` → `onToggleField`) ghi thẳng xuống DB cho mọi bộ phận.
- Impact: người ngoài bộ phận IQC vẫn đổi được kết luận kiểm tra của lô NVL.
- Fix: khôi phục gate tại `useIncomingData.ts:506-509`.

### A2. DTCRESULT — thiếu guard "ID TEST trống" và bỏ validate khi Up hàng loạt
- Backup `DTCRESULT.backup.tsx:397` (`checkInput`): `(dtc_id !== "" || uphangloat) && checkresult === true` → chặn lưu khi thiếu ID TEST, và **luôn** yêu cầu RESULT hợp lệ.
- New `PrecisionDTCRESULT/useDTCResultData.ts` (`insertDTCResult`): chỉ có `if (!checkresult && !uphangloat)` → khi bật Up hàng loạt thì bỏ qua toàn bộ validate; đồng thời không còn kiểm tra `dtc_id` → lưu được với `DTC_ID = ""`.
- Fix: luôn validate RESULT (thông báo riêng cho chế độ Excel) + bắt buộc `dtc_id` khi không bật Up hàng loạt (`useDTCResultData.ts:300-320`).

### A3. DTCRESULT — khối "Nạp file Excel XRF" hiện sai thời điểm và mất guard XRF
- Backup: input file Excel chỉ render khi `testname === '3'` (`DTCRESULT.backup.tsx:629`), và khi chọn file còn kiểm `testcode_tenthat !== "XRF"` → chặn (`:635-643`).
- New `PrecisionDTCRESULT/PrecisionDTCResultControl.tsx`: `isXRF = testname === "3" || testcode_tenthat === "XRF"`. Vì `testcode_tenthat` khởi tạo `"XRF"`, khối Excel **hiện ngay khi vào màn hình** dù hạng mục mặc định là 1003; guard XRF khi đọc file cũng bị bỏ.
- Fix: `isXRF = testname === "3"` (`PrecisionDTCResultControl.tsx:57`) + khôi phục guard trong `readUploadFile` (`useDTCResultData.ts:213-218`).

### A4. INCOMMING — nút LƯU SAVE gửi payload thiếu `LOT_VENDOR` → backend lỗi 500
- Backend `practice1/services/qcService.js:2772` (`insertIQC1table`) chạy `DATA.LOT_VENDOR.indexOf("SLITTING")` — bắt buộc phải có `LOT_VENDOR`.
- Nhưng `loadIQC1table` (cùng file) chỉ trả `IQC1_TABLE.LOT_VENDOR AS LOT_VENDOR_IQC` — **không có** field `LOT_VENDOR`.
- New hook trước fix gửi nguyên cả row (`generalQuery("insertIQC1table", iqc1datatable[i])`) → mọi dòng load từ server đều `undefined` → TypeError phía server → thất bại toàn bộ.
- Fix: gửi payload tường minh, fallback `LOT_VENDOR ?? LOT_VENDOR_IQC ?? ""` (`useIncomingData.ts:309-334`).

## B. ĐIỂM BẤT HỢP LÝ ĐÃ CẢI TIẾN

### B1. INCOMMING — Update hàng loạt đẩy `QC_PASS='N'` cho cả dòng chưa có kết luận (PD)
- `useIncomingData.ts` (`updateIncomingData`): sau `updateIncomingData_web` luôn gọi `updateQCPASSI222` với `VALUE: row.TOTAL_RESULT === "OK" ? "Y" : "N"`.
- Backend `updateQCPASSI222` (`qcService.js:2651`) khi `VALUE='N'` còn set `USE_YN='B'` → lô đang PD (chưa đánh giá) bị **khóa liệu oan**.
- Fix: chỉ đồng bộ I222 khi kết luận là `OK`/`NG`; vẫn giữ sinh Holding khi `NG`.

### B2. ADDSPECDTC — thiếu guard khi thêm điểm đo + status bar đếm sai
- `useADDSPECData.handleAddNewPoint`: khi `testname === "0"` (ALL) vẫn tạo điểm đo với `TEST_CODE = "0"` (vô nghĩa) → thêm guard yêu cầu chọn hạng mục test.
- `ADDSPECDTC.tsx` status bar hiển thị `selectedRowsData.current.length` — đây là `ref`, không gây re-render → số "Đã chọn" luôn đứng ở giá trị cũ → thêm state `selectedCount` / `setSelectedCount` và cập nhật trong `onSelectionChange`.

### B3. DTCRESULT — `unpivotJsonArray` bản backup crash khi upload Excel ở chế độ thường (đã tốt sẵn)
- Backup `DTCRESULT.backup.tsx:91`: `preDTC_ID = temp_data[0].DTC_ID` chạy vô điều kiện → khi `uphangloat = false` thì `temp_data = []` → TypeError, luồng nạp Excel 1 lô luôn hỏng.
- New `PrecisionDTCRESULT/dtcResultUtils.ts` đã guard `if (uphangloat && temp_data.length > 0)` và tra `CENTER_VALUE/UPPER_TOR/LOWER_TOR` trực tiếp từ `defaultResultArray` → giữ nguyên, không cần sửa.

## C. ĐÃ KIỂM TRA VÀ GIỮ NGUYÊN (không phải lỗi)

- `DKDTC` `registerDTC`: new có thêm early-return khi chưa chọn hạng mục test (backup sẽ tạo IQC1 rỗng rồi báo thành công) và `handleToggleTestItem` không còn crash khi hạng mục không có trong `addedSpec` (`selected_test.length > 0`) → new tốt hơn.
- `DKDTC` `getLastDTC_ID` fallback `1` (backup `0`) → tránh đăng ký `DTC_ID = 0`.
- `DKDTC` `handleInputChange`: `length >= 8 → checkLabelID` (backup chỉ `=== 8`) → không mất nhánh nghiệp vụ.
- `DKDTC` mirror đúng backup: skip hạng mục đã đăng ký khi `checkNVL` (`isM_LOT_NO_AND_TEST_CODE_EXIST`), `G_CODE = "7A07540A"` / `M_CODE = "B0000035"` khi IQC, `PROD_REQUEST_NO = "1IG0008"`, `M_LOT_NO = "2101011325"` khi SP.
- `ADDSPECDTC` mirror đúng backup: `handleInsertSpec`/`handleUpdateSpec` early-return khi `testname === "0"`; nhánh IQC nhân bản theo mọi `M_CODE` cùng `M_NAME`; `CENTER_VALUE = WIDTH_CD` khi `testname === "1"`; Copy XRF gate theo `getCompany() === "CMS" && testname === "3"`; cột đầu có `checkboxSelection` + `headerCheckboxSelection` (không mất chức năng Update Selected).
- `INCOMMING` worker column set: bản worker vẫn giữ đúng các cột tương tác như backup; upload checksheet đã đi qua `checkBP(["QC"],["ALL"],["ALL"])` trong hook.
- `TEST_TABLE`: luồng load list → chọn dòng → load point list → add item/point tương đương backup; hook chọn sẵn dòng đầu tiên chỉ là cải tiến UX.
- Endpoint backend được dùng bởi các màn này đều tồn tại (đã kiểm tra `practice1/services/qcService.js`): `insertIQC1table`, `updateIncomingChecksheet`, `update_iqc_ncr_id`, `updateIncomingData_web`, `updateQCPASSI222`, `updateIQC1Table`, `loadIQC1table`, `checkMNAMEfromLotI222`, `getMaxHoldingID`.

## D. XÁC MINH

- `npx tsc --noEmit -p tsconfig.json` lọc theo 5 module + 5 file controller: **0 lỗi** (repo có sẵn lỗi type ở các module khác, không liên quan).
- `npm run build` (vite build production): **thành công**.
- `node --check practice1/services/qcService.js`: **SYNTAX OK**.

## E. BACKEND ĐÃ XỬ LÝ (cùng phiên)

### E1. `insertIQC1table` (`practice1/services/qcService.js:2772`) — chống crash khi thiếu `LOT_VENDOR`
- Trước: `let LOT_VENDOR = DATA.LOT_VENDOR;` rồi gọi `LOT_VENDOR.indexOf("SLITTING")` → TypeError → HTTP 500 khi payload thiếu field.
- Sau: `let LOT_VENDOR = (DATA.LOT_VENDOR ?? "").toString();` → an toàn với cả `undefined` / `null` / number.

### E2. `loadIQC1table` (`practice1/services/qcService.js:2726`) — trả thêm cột `LOT_VENDOR`
- Thêm `IQC1_TABLE.LOT_VENDOR` vào danh sách cột của CTE `IQCTB` (giữ nguyên alias `LOT_VENDOR_IQC` cho cột cũ, không phá vỡ phía FE).
- Hệ quả: FE nhận được `LOT_VENDOR` gốc từ DB khi tra dữ liệu → LƯU SAVE ghi lại đúng giá trị gốc, không còn phụ thuộc fallback `LOT_VENDOR ?? LOT_VENDOR_IQC`.

---

# Audit Parity — Đợt 2: 4 module IQC (`HOLDING`, `FAILING`, `BLOCK`, `NCR_MANAGER`)

Ngày: 2026-09-20. Phạm vi: `PrecisionHOLDING/`, `PrecisionFAILING/`, `PrecisionBLOCK/`, `PrecisionNCR/`.
Phương pháp: đọc trực tiếp hook + sub-component mới, đối chiếu từng hành vi với `<MODULE>.backup.tsx`; các điểm nghi vấn được xác minh lại trên backend (`practice1/services/qcService.js`) trước khi kết luận.

> **TRẠNG THÁI: ĐÃ KHẮC PHỤC** toàn bộ mục F1–F4, B5–B7, H1, N1.

## F. REGRESSION (mất luật nghiệp vụ — đã sửa)

### F1. FAILING — mất phân quyền `checkBP` ở nghiệp vụ Xuất kho liệu QC Fail
- Backup `FAILING.backup.tsx` (nút **Xuất**): `checkBP(userData, ["QC"], ["ALL"], ["ALL"], updateQCFailTable)`.
- New: `FAILING.tsx` truyền thẳng `onOutputFail={updateQCFailTable}` (cả toolbar lẫn sidebar) và hook `useFailingData.ts` **không import `checkBP`** → bất kỳ nhân viên nào vào được route cũng xuất được liệu fail.
- Fix: tách hàm lõi `executeUpdateQCFailTable()` và bọc lại bằng `updateQCFailTable()` có gate `checkBP(userData, ["QC"], ["ALL"], ["ALL"], ...)` — khớp đúng backup.

### F2. FAILING — mất thao tác Enter để thêm dòng kèm luật "PQC chưa lập lỗi"
- Backup `FAILING.backup.tsx` (`handleKeyDown`, gắn vào input LOT): khi bấm **Enter** → nếu `checkInput()` thì yêu cầu `pqc3Id !== 0` (nếu chỉ thị chưa có PQC3 → chặn với thông báo *"Số chỉ thị này PQC chưa lập lỗi, không thêm được"*), rồi chống trùng LOT và `addRow()`.
- New: input LOT không còn `onKeyDown`; toàn bộ nhánh kiểm tra `pqc3Id` **biến mất** → có thể thêm dòng fail cho chỉ thị chưa được PQC lập lỗi.
- Fix: bổ sung `handleLotKeyDown` trong `useFailingData.ts` (đủ 3 nhánh như backup), nối qua prop `onLotKeyDown` → `PrecisionFailingSidebar` → `PrecisionFailingFormIn`.

### F3. FAILING — `checkPlanID` không xoá `G_NAME` khi mã chỉ thị chưa đủ 7 ký tự
- Backup: `if (length >= 7) {checkPlanID; checkPQC3_ID} else { setGName("") }` → tránh việc `g_name` cũ còn sót lại và bị ghi vào payload `G_NAME`.
- New: chỉ `if (val.length >= 7) checkPlanID(val)` → `G_NAME` cũ tồn tại khi người dùng sửa lại mã chỉ thị.
- Fix: khôi phục nhánh `setGName("")` trong `checkPlanID`.

### F4. BLOCK — Excel export ghi sai cột `PLSP` bằng `USE_YN`
- `useBlockData.ts` (`handleExportExcel`) map `PLSP: row.USE_YN` trong khi cột `PLSP` trên lưới lấy từ field `PLSP` (backend `loadBlockingData` trả `PHANLOAI AS PLSP` / `'NVL' AS PLSP`).
- Hệ quả: file Excel cột PLSP chứa Y/N thay vì NVL/BTP/SP.
- Fix: map `PLSP: row.PLSP ?? ""`, đồng thời bổ sung `PLSP?: string` vào `BLOCK_DATA` (`src/pages/qc/interfaces/qcInterface.ts`) vì interface trước đó thiếu field này.

## B. ĐIỂM BẤT HỢP LÝ ĐÃ CẢI TIẾN (đợt 2)

### B5. BLOCK — `UPDATE NCR_ID` không chặn `NCR_ID = 0`
- `updateNCRIDBlocking` gọi `f_updateNCRIDForHolding/Failing(row.BLOCK_ID, ncrId)` cho mọi dòng đã chọn; nếu người dùng quên nhập `NCR_ID` (state mặc định `0`) thì **xoá trắng** NCR_ID hiện có của lô.
- HOLDING đã có guard tương ứng (`NCR ID phải khác 0`); BLOCK thì không.
- Fix: thêm guard `if (!ncrId || ncrId === 0) return Swal warning`.

### B6. BLOCK — thiếu cột `USE_YN` so với backup
- Backup `column_blocking_table` có `{ field: "USE_YN" }`; bản mới bỏ sót dù `USE_YN` vẫn được dùng để quyết định nhánh cập nhật I222 khi SET PASS/FAIL.
- Fix: thêm lại cột `USE_YN` (badge active/inactive) vào `PrecisionBLOCKColumns.tsx`.

### B7. HOLDING — `Update Reason` có thể xoá trắng lý do lỗi
- `updateReason` lấy `REASON` của dòng chọn đầu tiên rồi ghi đè cho *tất cả* dòng đã chọn. Nếu người dùng chưa sửa ô REASON (rỗng/undefined) thì toàn bộ lý do lỗi bị ghi thành chuỗi rỗng.
- Fix: chặn sớm khi `reasonToUpdate` rỗng, yêu cầu nhập REASON trước (cột REASON đã được bật `editable: true` trên lưới).

## N. CẢI TIẾN NHỎ (đợt 2)

### N1. NCR_MANAGER — nút "Làm mới bộ lọc" không reset khoảng ngày
- `PrecisionNCRSidebar.handleResetFilters` chỉ xoá `vendor / m_name / m_code / cmsLOT / vendorLot`, để lại `fromdate`/`todate` đã đổi → người dùng tưởng đã về mặc định nhưng truy vấn vẫn bị giới hạn ngày.
- Fix: reset thêm `fromdate`/`todate` về `moment().format("YYYY-MM-DD")`.

## C2. ĐÃ KIỂM TRA VÀ GIỮ NGUYÊN (đợt 2 — không phải lỗi)

- **HOLDING**: `setQCPASS`/`updateNCRIDHolding` — gate `SUBDEPTNAME === "IQC"` từ nút bấm backup đã được chuyển vào hook (tốt hơn, không thể bypass qua toolbar); nhánh `updateQCPASSI222_M_LOT_NO` chỉ chạy khi `USE_YN_I222 !== "X"` được giữ nguyên; bổ sung tra lại dữ liệu sau khi SET/UPDATE là cải tiến.
- **FAILING**: nút **Add** bản mới giữ đúng bộ kiểm tra `f_isM_LOT_NO_in_P500 || f_isM_LOT_NO_in_IN_KHO_SX || f_isM_LOT_NO_in_O302` + thông báo *"LOT này không dùng cho chỉ thị này"* như backup; `saveFailingData` giữ nguyên luồng `f_resetIN_KHO_SX_IQC2` + `updateLOT_SX_STATUS` cho hàng BTP; `updateQCFailTable` giữ nguyên validate `g_name/empl_name/empl_name2` và luồng `f_nhapkhoao` khi vật liệu là liệu chính trong BOM.
- **BLOCK**: `setQCPASS` giữ nguyên `f_updateStockM090()` sau khi cập nhật; `setClose` giữ nguyên gate MUA/IQC/NHU1903; nhánh FAILING dùng `PLAN_ID` còn HOLDING dùng `BLOCK_ID` đúng như backup.
- **NCR_MANAGER**: `addRow` sinh `NCR_ID` bằng `Math.max(...)+1`, `NCR_NO = getCompany()+"1-"+YYYYMMDD`, `DEFECT_IMAGE='P'`, `PROCESS_STATUS='P'`, `COUNTERMEASURE='N'` — khớp backup; upload ảnh lỗi (`.png`) và đối sách (`.pdf/.pptx/.docx/.xlsx`) đều giữ gate `checkBP(["QC"], ["Leader","Dept Staff","Sub Leader"], ["ALL"])`; `SET COMPLETED/PENDING` giữ gate `checkBP(["QC"], ["Leader","Dept Staff","Sub Leader"], ["ALL"])`.
- **NCR_MANAGER**: `PrecisionNCRRightPanel` coi `DEFECT_IMAGE = "P"` là *chưa có ảnh* (thay vì hiện LINK như backup) → hợp lý vì file PNG chưa tồn tại; giữ nguyên.

## D2. XÁC MINH (đợt 2)

- `get_errors` trên toàn bộ 9 file đã sửa: **0 lỗi**.
- `npm run build` (vite build production) trong `cmsnewerp2`: **thành công**, `dist/index.html` được ghi mới.
