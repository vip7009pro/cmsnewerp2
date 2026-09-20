# ACTIVE_STATE

## Mục tiêu task hiện tại
Rà soát parity 6 component RND / MUA / QLSX đã refactor Stitch so với bản `.backup` và sửa sai khác logic + cải tiến điểm bất hợp lý.

- Đợt 3 (đã xong): `QLVL`, `BOM_AMAZON`, `DESIGN_AMAZON`, `PRODUCT_BARCODE_MANAGER`, `KHOAO`, `KHOSUB`.
- Đợt 1 & 2 (đã xong, module QC/IQC): `INCOMMING`, `DKDTC`, `ADDSPECDTC`, `DTCRESULT`, `TEST_TABLE`, `HOLDING`, `FAILING`, `BLOCK`, `NCR_MANAGER`.

Trạng thái: **HOÀN THÀNH** (audit + fix + build pass). Chi tiết: `FINDINGS_PARITY_RND_MUA_QLSX_MODULES.md`, `FINDINGS_PARITY_QC_DTC_MODULES.md`.

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
- Nếu nghiệp vụ cho phép `BARCODE_STT` dạng chữ: sửa backend `practice1/services/rndService.js` bọc `N'...'` thay vì validate số ở frontend.
- Nếu số dòng BOM/barcode lớn (> 100): gộp thành 1 request batch ở backend thay vì gọi tuần tự từng dòng.
- Chạy lại audit tương tự cho các module QLSX/RND/QC còn lại khi có `.backup` tương ứng (`IQC_REPORT`, `BNK_COMPONENT`, `HOLD_FAIL`).
- (QC, treo lại) `updateIncomingData_web` ghi `REMARK` nhưng chưa map đúng ngữ nghĩa `IQC_TEST_RESULT`/`DTC_RESULT`.

## Ghi chú kỹ thuật
- Build kiểm chứng: `npm run build` (vite production) — đợt 3 `EXIT=0` `built in 1m 3s`; sau fix `err_code` `EXIT=0` `built in 52.53s`; `get_errors` trên các folder đã sửa — 0 lỗi.
- Backend trả `{tk_status, message}` (`NG` = lỗi SQL, `message` là error thật) còn `generalQuery` **throw** khi lỗi mạng. Muốn không báo sai thành công thì phải bắt **cả hai**: nhánh `tk_status === "NG"` **và** `catch`.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác; không dùng tsc làm gate.
- Đợt 3: API parity & `checkBP` parity đều **100%**. Pitfall mới: **state/handler trong hook được export nhưng không được destructure ở controller ⇒ control chết** (BOM_AMAZON `sidebarSearch`). Luôn đối chiếu danh sách destructure với interface `Use*DataReturn`.
- Pitfall khác: `.backup` của DESIGN_AMAZON có block `onResize`/`onResizeStop` là **dead code** (`enableResizing={false}`) — không được nhầm là nghiệp vụ bị mất.
- Pitfall (bảng AG Grid): prop `rowStyle`/`getRowStyle`/`getRowId` của `AgGridReact` **phải là reference ổn định**; nếu tạo object/function literal trong thân component thì mỗi lần parent re-render AG Grid sẽ redraw toàn bộ row ⇒ cell renderer SVG/QR/barcode bị vẽ lại (hiện tượng "nháy"). Build kiểm chứng lần này: `npm run build` `EXIT=0`.

