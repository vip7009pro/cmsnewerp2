# ACTIVE_STATE

## Mục tiêu task hiện tại
Rà soát parity 3 module Nhân sự + 3 tab Đăng ký (đã refactor Stitch) so với bản `.backup` và sửa sai khác logic + cải tiến điểm bất hợp lý.

- Đợt 4 (đã xong): `DiemDanhNhomCMS` (NS1), `DieuChuyenTeamCMS` (NS2), `PheDuyetNghiCMS` (NS2), `TabDangKy` → `PrecisionDangKy` (NS3: Nghỉ phép / Tăng ca / Xác nhận chấm công).
- Đợt 1-3 (đã xong): QC/IQC, RND/MUA/QLSX.

Trạng thái: **HOÀN THÀNH** (audit + fix + build pass). Chi tiết: `FINDINGS_PARITY_NHANSU_MODULES.md`.

## File đã chỉnh sửa (đợt 4 - vòng 2: xử lý 3 tồn đọng)
- `src/pages/nhansu/DangKy/PrecisionDangKy/useMyMonthAttendance.ts` (MỚI) — hook gọi `mydiemdanhnhom` theo tháng, tính 8 chỉ số thật (ngày công, giờ làm, giờ OT từ `FINAL_OVERTIMES`, ngày nghỉ, ngày chờ duyệt, số lần giải trình, số ngày đi muộn).
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionDangKyKpi.tsx` — bỏ 5 default cứng, nhận `stats`, render 4 card KPI thật + banner cảnh báo khi tải lỗi.
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionDangKy.tsx`, `PrecisionDangKy.scss` — nối hook theo `reloadTrigger`; lưới KPI 4 cột + modifier `.kpi-card--pending`.
- `src/api/services/responseService.ts` (MỚI) — `isTkOk` / `getTkMessage` / `getErrMessage` chuẩn hoá mọi dạng phản hồi (`{tk_status,message}`, chuỗi thuần, undefined).
- `practice1/services/nhansuService.js` — 4 chỗ `res.send("NO_LEADER")` → `{tk_status:"NG", message:"Không có quyền: ..."}`.
- `DiemDanhNhom/PrecisionDiemDanh/{PrecisionAttendanceCell,PrecisionOvertimeCell,PrecisionDiemDanhToolbar}.tsx`, `DiemDanhNhomCMS.tsx` — dùng helper mới; toolbar nhận `onExportEX1/onExportEX2/onOpenPivot/filteredCount/totalCount` (trước là prop chết), gỡ cụm nút trùng ở grid toolbar.
- `DieuChuyenTeam/DieuChuyenTeamCMS.tsx`, `PheDuyetNghi/PheDuyetNghiCMS.tsx` — dùng helper, catch báo lỗi mạng thật thay vì `console.error` im lặng.
- `FINDINGS_PARITY_NHANSU_MODULES.md` (mục 12-14 + tồn đọng còn lại), `ROADMAP.md`.

## File đã chỉnh sửa (đợt 4 - vòng 1)
- `src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.tsx` — `handleMarkAllPresent`: chặn điểm danh nhanh với nhân sự đang có đơn nghỉ (`OFF_ID != null && REASON_NAME !== 'Nửa phép'`, đúng gate của `AttendanceCell` backup); dùng `Promise.allSettled`, chỉ ghi state cho dòng thành công, báo "Hoàn tất một phần x/y".
- `src/pages/nhansu/DieuChuyenTeam/PrecisionDieuChuyenTeam/PrecisionDieuChuyenCells.tsx` — sửa đường dẫn avatar `/avatarpic/` → `/Picture_NS/NS_<EMPL_NO>.jpg` (thư mục cũ không tồn tại trong `public/`).
- `src/pages/nhansu/DieuChuyenTeam/PrecisionDieuChuyenTeam/PrecisionDieuChuyenKpi.tsx` — nhãn KPI đúng ngữ nghĩa (đã gán ca / chưa gán ca).
- `src/pages/nhansu/PheDuyetNghi/PheDuyetNghiCMS.tsx` — phân loại lại KPI (`0|3` = từ chối/xóa, `2` = chờ duyệt); `handleReset` gọi `setpheduyetnhom` value 2 thay vì chỉ set state local.
- `src/pages/nhansu/PheDuyetNghi/PrecisionPheDuyetNghi/PrecisionPheDuyetPivotModal.tsx` — cùng fix phân loại trạng thái.
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionDangKyCells.tsx` — `APPROVAL_STATUS = 0` hiển thị "Từ chối" (trước đây là "Chờ duyệt").
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionDangKyHistory.tsx` — bộ lọc trạng thái: pending = 2/null, thêm "Từ chối" = 0, "Đã hủy/Xóa" = 3.
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionOtForm.tsx` — khoá ô "Ngày tăng ca" (backend `dangkytangcacanhan` luôn dùng `moment()`), ghi rõ field không gửi server.
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionLeaveForm.tsx` — nghỉ nửa ngày luôn lưu `REASON_CODE = 2` (Nửa phép), đồng bộ UI và dữ liệu.
- `src/pages/nhansu/DangKy/PrecisionDangKy/PrecisionAttendanceForm.tsx` — nhãn lý do giải trình là ghi chú nội bộ.
- `FINDINGS_PARITY_NHANSU_MODULES.md`, `ROADMAP.md`.

## File đã chỉnh sửa (đợt 3)
- `src/pages/rnd/bom_amazon/PrecisionBomAmazon/useBomAmazonData.ts`, `bomAmazonTypes.ts`, `PrecisionBomAmazonSidebar.tsx`, `BOM_AMAZON.tsx` — nối lại `sidebarSearch` bị bỏ rơi: lọc tab "ĐÃ CÓ BOM" theo `G_CODE`/`G_NAME`/`G_NAME_KD`, sửa ô tìm kiếm chết.
- `src/pages/qlsx/QLSXPLAN/KHOAO/PrecisionKhoAo/khoAoActionHandlers.ts`, `useKhoAoData.ts`, `PrecisionKhoAoToolbar.tsx` — guard `activeTab === "TON"` cho Xóa Rác / Ẩn Rác (trước đây có thể xóa dữ liệu thật khi đang ở tab LS IN / LS OUT); reset `searchKeyword` khi đổi tab.
- `src/pages/rnd/product_barcode_manager/PrecisionProductBarcode/useProductBarcodeData.ts`, `barcodeManagerTypes.ts`, `PrecisionProductBarcodeForm.tsx`, `PrecisionProductBarcodeToolbar.tsx`, `PRODUCT_BARCODE_MANAGER.tsx` — validate `BARCODE_STT` (backend nội suy không nháy ⇒ rỗng là SQL lỗi); tách export Excel thành `EX1` (đang lọc) / `EX2` (toàn bộ).
- `src/pages/muahang/quanlyvatlieu/QLVL.tsx` — bọc riêng `updateM090FSC` trong try/catch để lỗi đồng bộ phụ không báo sai "Không thể cập nhật vật liệu".
- `src/pages/rnd/bom_amazon/PrecisionBomAmazon/useBomAmazonData.ts` — tổng hợp `err_code` theo từng dòng (`DOITUONG_NO`) cho `addBOMAMAZON`, báo `"Lưu BOM chưa hoàn tất x/y dòng"` khi có dòng lỗi; `checkExistBOMAMAZON` không nuốt lỗi kết nối + dừng trước khi insert mù; bỏ 2 Swal bắn giữa luồng.
- `src/pages/rnd/product_barcode_manager/PrecisionProductBarcode/useProductBarcodeData.ts` — `addBarcode` dừng nếu bước check trùng lỗi (không insert mù); `addBarcode`/`updateBarcode`/`deleteBarcode` báo lỗi kèm `message` thật thay vì `console.error` im lặng.
- `FINDINGS_PARITY_RND_MUA_QLSX_MODULES.md`, `ROADMAP.md`.

## Fix nháy toàn bảng barcode khi click dòng (đã xong)
- `src/components/DataTable/AGTable.tsx` — hoist `rowStyle`/`getRowStyle`/`getRowId`/`onRowDragMove`/`onRowDoubleClicked` ra module scope + `useCallback` cho `onSelectionChanged`/`onGridReady`/`tableSelectionChange`, `useMemo` cho `PivotGridDataSource`. Trước đây các prop này tạo mới mỗi render ⇒ AG Grid redraw toàn bộ row.
- `src/pages/rnd/product_barcode_manager/PrecisionProductBarcode/PrecisionProductBarcodeColumns.tsx` — cell renderer `CODE_VISUALIZE` bọc trong `BarcodeVisual` (`React.memo`, props nguyên thuỷ `value`/`type`) để SVG/react-barcode không bị vẽ lại khi cell refresh.
- `PrecisionProductBarcodeTable.tsx` — `useCallback` cho `onRowClick`, hoist `onSelectionChange`/`toolbar` ra module scope.
- `PRODUCT_BARCODE_MANAGER.tsx` — `useCallback` cho `handleSelectRow`/`handleToggleForm`; clone row khi `setSelectedRows({...rowData})`.

## Việc cần làm tiếp theo
- Thêm cấu hình quy chế thật cho hạn mức "3 lần giải trình/tháng" và "40h OT/tháng" (hiện là hằng số hiển thị trong `PrecisionDangKyKpi.tsx`).
- Bổ sung chọn nhiều dòng để duyệt/từ chối hàng loạt ở `PheDuyetNghiCMS` (gợi ý cải tiến).
- (cũ) Nếu số dòng BOM/barcode lớn (> 100): gộp thành 1 request batch ở backend thay vì gọi tuần tự từng dòng.
- (QC, treo lại) `updateIncomingData_web` ghi `REMARK` nhưng chưa map đúng ngữ nghĩa `IQC_TEST_RESULT`/`DTC_RESULT`.

## Ghi chú kỹ thuật
- Đợt 4 — pitfall nghiệp vụ: **`APPROVAL_STATUS = 0` là "Từ chối", KHÔNG phải "Chờ duyệt"** (`1` = đã duyệt, `2` = chờ duyệt, `3` = đã xóa — backend `setpheduyetnhom` đổi value 3 thành `DELETE`). Đã phát hiện 4 chỗ hiểu sai (KPI + Pivot Phê duyệt, nhãn trạng thái + filter ở Lịch sử Đăng ký).
- Đợt 4 — pitfall bulk: **hành động hàng loạt phải giữ đúng gate của cell đơn lẻ** (Điểm danh nhanh từng ghi đè đơn nghỉ đã đăng ký của nhân viên) và không được set state mù trước khi API trả về.
- Đợt 4 — pitfall form: **UI có field mà backend không nhận** (`dangkytangcacanhan` luôn dùng `moment()`, không nhận ngày; `FINAL_OVERTIMES` mới là số phút OT thật đã trừ giờ nghỉ) ⇒ luôn đối chiếu `practice1/services/nhansuService.js` trước khi tin vào tham số trên form.
- Đợt 4 — pitfall phản hồi: backend cũ có thể trả **chuỗi thuần** (`res.send("NO_LEADER")`) ⇒ đọc thẳng `response.data.message` sẽ ra `undefined`. Dùng `isTkOk` / `getTkMessage` / `getErrMessage` từ `src/api/services/responseService.ts`; `generalQuery` **throw** khi lỗi mạng nên phải xử lý cả nhánh `catch`.
- Đợt 4 — pitfall asset: ảnh thẻ nhân sự nằm ở `public/Picture_NS/NS_<EMPL_NO>.jpg`, **không** có `public/avatarpic/`.
- Build kiểm chứng: `npm run build` (vite production) — đợt 3 `EXIT=0` `built in 1m 3s`; sau fix `err_code` `EXIT=0` `built in 52.53s`; đợt 4 vòng 1 `✓ 17013 modules transformed`; vòng 2 `✓ 17015 modules transformed` `✓ built in 1m 14s`; `node --check services/nhansuService.js` = SYNTAX OK; `get_errors` trên các file đã sửa — 0 lỗi.
- Backend trả `{tk_status, message}` (`NG` = lỗi SQL, `message` là error thật) còn `generalQuery` **throw** khi lỗi mạng. Muốn không báo sai thành công thì phải bắt **cả hai**: nhánh `tk_status === "NG"` **và** `catch`.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác; không dùng tsc làm gate.
- Đợt 3: API parity & `checkBP` parity đều **100%**. Pitfall mới: **state/handler trong hook được export nhưng không được destructure ở controller ⇒ control chết** (BOM_AMAZON `sidebarSearch`). Luôn đối chiếu danh sách destructure với interface `Use*DataReturn`.
- Pitfall khác: `.backup` của DESIGN_AMAZON có block `onResize`/`onResizeStop` là **dead code** (`enableResizing={false}`) — không được nhầm là nghiệp vụ bị mất.
- Pitfall (bảng AG Grid): prop `rowStyle`/`getRowStyle`/`getRowId` của `AgGridReact` **phải là reference ổn định**; nếu tạo object/function literal trong thân component thì mỗi lần parent re-render AG Grid sẽ redraw toàn bộ row ⇒ cell renderer SVG/QR/barcode bị vẽ lại (hiện tượng "nháy"). Build kiểm chứng lần này: `npm run build` `EXIT=0`.

