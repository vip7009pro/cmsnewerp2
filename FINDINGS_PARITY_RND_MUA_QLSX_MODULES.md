# FINDINGS PARITY — RND / MUA / QLSX MODULES (đợt 3)

Ngày audit: 2026-09-20
Phạm vi: so sánh 6 component đã refactor Stitch với bản `.backup` tương ứng.
Phương pháp: đọc toàn bộ hook + sub-component của bản refactor, so từng state / handler / API call / cột lưới với `.backup`; đối chiếu backend `practice1` khi cần xác nhận hành vi.

| # | Component | File refactor | File backup |
|---|-----------|---------------|-------------|
| 1 | QLVL | `src/pages/muahang/quanlyvatlieu/QLVL.tsx` + `PrecisionQLVL/` | `QLVL.backup.tsx` |
| 2 | BOM_AMAZON | `src/pages/rnd/bom_amazon/BOM_AMAZON.tsx` + `PrecisionBomAmazon/` | `BOM_AMAZON.backup.tsx` |
| 3 | DESIGN_AMAZON | `src/pages/rnd/design_amazon/DESIGN_AMAZON.tsx` + `PrecisionDesignAmazon/` | `DESIGN_AMAZON.backup.tsx` |
| 4 | PRODUCT_BARCODE_MANAGER | `src/pages/rnd/product_barcode_manager/PRODUCT_BARCODE_MANAGER.tsx` + `PrecisionProductBarcode/` | `PRODUCT_BARCODE_MANAGER.backup.tsx` |
| 5 | KHOAO | `src/pages/qlsx/QLSXPLAN/KHOAO/KHOAO.tsx` + `PrecisionKhoAo/` | `KHOAO.backup.tsx` |
| 6 | KHOSUB | `src/pages/qlsx/QLSXPLAN/KHOAO/KHOSUB.tsx` + `PrecisionKhoSub/` | `KHOSUB.backup.tsx` |

## 0. Kết luận tổng quan

Bản refactor giữ **rất sát** nghiệp vụ gốc. Đã kiểm chứng bằng grep đối chiếu:

- **API parity: 100%** cho cả 6 module — không thiếu bất kỳ `generalQuery` / `uploadQuery` nào của bản gốc (`get_material_table`, `checkMaterialExist`, `addMaterial`, `updateMaterial`, `updateM090FSC`, `updateTDSStatus`, `selectVendorList`, `getFSCList` / `loadcodephoi`, `listAmazon`, `getBOMAMAZON`, `getBOMAMAZON_EMPTY`, `checkExistBOMAMAZON`, `insertAmazonBOM`, `updateAmazonBOM`, `updateAmazonBOMCodeInfo` / `getAMAZON_DESIGN`, `insertAMZDesign`, `checkDesignExistAMZ`, `deleteAMZDesign` / `loadbarcodemanager`, `checkbarcodeExist`, `addBarcode`, `updateBarcode`, `deleteBarcode`, `selectcodeList` / toàn bộ `f_*` của `khsxUtils`).
- **Phân quyền parity: 100%** — `checkBP(["MUA","KETOAN"])` cho Add/Update vật liệu (đặt lại trong `PrecisionQLVLAddModal`), `checkBP(["RND"])` cho Lưu BOM Amazon / Bật-Tắt sửa / Lưu DESIGN, `checkBP(["QLSX"])` cho Xuất Next Kho Main & Kho Sub, `checkBP(["SX"])` cho Xóa rác / Ẩn rác kèm mật mã `quantrisanxuat2023` + whitelist `DTL1906 / THU1402 / NHU1903`, mật mã `okema` cho cập nhật thông tin phụ Amazon.
- **Cột lưới parity** — `field` / `headerName` / `width` của KHOAO, KHOSUB, PRODUCT_BARCODE giữ nguyên so với bản gốc. QLVL đổi headerName sang nhãn tiếng Việt và PRODUCT_BARCODE đổi width (thuần trình bày, không mất cột).
- **DESIGN_AMAZON**: hook `useDesignAmazonCanvas` là bản port trung thực của `renderHandles` / `rotateResizeDrag` / nudge / snap / delete. Đã xác minh `enableResizing={false}` trong backup ⇒ khối `onResize`/`onResizeStop` (dòng 1717–1860) là **dead code**, nên việc refactor bỏ nó **không phải mất nghiệp vụ**. Resize thật đi qua `rotateResizeDrag` và refactor đã port đúng 1:1.

## 1. Lỗi đã sửa

### 1.1 BOM_AMAZON — `sidebarSearch` bị bỏ rơi (ô tìm kiếm chết)

- **Bằng chứng**: `useBomAmazonData` khai báo `sidebarSearch` / `setSidebarSearch` và export ra, nhưng `BOM_AMAZON.tsx` **không** destructure ⇒ state không bao giờ được dùng.
- Trong `PrecisionBomAmazonSidebar`, ô input tab "ĐÃ CÓ BOM" có `onChange` rỗng kèm comment `// Có thể lọc nhanh qua AG-Grid filter hoặc nạp lại` ⇒ **control chết**, gõ không có tác dụng.
- **Đã sửa**: thêm memo `filteredListBomAmazon` (lọc theo `G_CODE` / `G_NAME` / `G_NAME_KD`) trong hook, truyền xuống sidebar qua prop `listBomFiltered`, nối `value`/`onChange` cho input và dùng list đã lọc cho cả badge đếm lẫn AGTable.
- File: `PrecisionBomAmazon/useBomAmazonData.ts`, `PrecisionBomAmazon/bomAmazonTypes.ts`, `PrecisionBomAmazon/PrecisionBomAmazonSidebar.tsx`, `BOM_AMAZON.tsx`.

### 1.2 KHOAO — Xóa Rác / Ẩn Rác không ràng buộc theo tab

- **Bằng chứng**: bản gốc cũng không guard, nhưng `tonkhoaodatafilter.current` được set bởi `onSelectionChange` của **bất kỳ** tab nào. Khi người dùng đang ở tab `LS IN` / `LS OUT` rồi chọn dòng và bấm "Xóa Rác", `handle_xoa_rac` vẫn lặp và gọi `f_delete_IN_KHO_AO(row.IN_KHO_ID)` + `f_delete_OUT_KHO_AO(row.PLAN_ID_INPUT, row.M_LOT_NO)` ⇒ **xóa dữ liệu thật bằng nhầm tab**.
- **Đã sửa**: thêm guard `activeTab !== "TON"` ở đầu `handleXoaRacAction` và `handleAnRacAction`; hook truyền `activeTab`; toolbar `disabled` hai nút này khi không ở tab Tồn Kho Main (kèm tooltip giải thích).
- Tiện thể: `handleTabChange` reset `searchKeyword` cho đồng nhất với KHOSUB (trước đây đổi tab vẫn giữ từ khóa lọc cũ).
- File: `PrecisionKhoAo/khoAoActionHandlers.ts`, `PrecisionKhoAo/useKhoAoData.ts`, `PrecisionKhoAo/PrecisionKhoAoToolbar.tsx`.

### 1.3 PRODUCT_BARCODE_MANAGER — thiếu validate `BARCODE_STT` gây SQL lỗi 500

- **Bằng chứng backend**: `practice1/services/rndService.js` — `checkbarcodeExist`, `addBarcode`, `updateBarcode`, `deleteBarcode` đều nội suy **không bọc nháy**: `AND BARCODE_STT=${DATA.BARCODE_STT}`. Nếu `BARCODE_STT` rỗng ⇒ câu SQL thành `BARCODE_STT=` ⇒ backend trả `NG` / lỗi 500 khó hiểu.
- Bản refactor trước đây chỉ guard `G_CODE` + `BARCODE_RND`.
- **Đã sửa**: thêm guard `BARCODE_STT` không rỗng cho `addBarcode` / `updateBarcode` / `deleteBarcode`, và `disabled` nút Add/Update/Delete trong form kèm tooltip.
- File: `PrecisionProductBarcode/useProductBarcodeData.ts`, `PrecisionProductBarcode/PrecisionProductBarcodeForm.tsx`.

### 1.4 PRODUCT_BARCODE_MANAGER — nút Excel xuất "tất cả" trong khi lưới đang lọc

- **Bằng chứng**: `handleExportExcel` cũ xuất `barcodedatatable` (toàn bộ), trong khi lưới hiển thị `filteredBarcodeData` (đang lọc theo `typeFilter` / `prodFilter` / `quickSearch`). Trái với Nguyên tắc số 5 của SKILL (`EX1` = đang lọc, `EX2` = toàn bộ) và không nhất quán với 5 module còn lại.
- **Đã sửa**: `handleExportExcel(type)` chọn nguồn theo `EX1`/`EX2`, toolbar tách thành 2 nút `EX1 (Đang lọc)` + `EX2 (Tất cả)`.
- File: `PrecisionProductBarcode/useProductBarcodeData.ts`, `barcodeManagerTypes.ts`, `PrecisionProductBarcodeToolbar.tsx`, `PRODUCT_BARCODE_MANAGER.tsx`.

### 1.5 QLVL — lỗi phụ của `updateM090FSC` báo sai kết quả cập nhật

- **Bằng chứng**: `await generalQuery("updateM090FSC", clickedRows)` nằm chung `try` với `updateMaterial`. Nếu bước đồng bộ bảng FSC lỗi mạng/throw, khối `catch` hiển thị "Không thể cập nhật vật liệu" dù `updateMaterial` **đã thành công** ⇒ người dùng tưởng cập nhật thất bại và thao tác lại.
- **Đã sửa**: bọc riêng `updateM090FSC` trong `try/catch` nội bộ, chỉ `console.error`, giữ nguyên luồng thành công.
- File: `QLVL.tsx`.

## 2. Khác biệt có chủ đích, KHÔNG sửa (đã cân nhắc)

| Điểm | Bản backup | Bản refactor | Lý do giữ refactor |
|------|-----------|--------------|--------------------|
| KHOAO/KHOSUB cột `FSC` | `YES` khi `PHANLOAI === "Y"` | `YES` khi `PHANLOAI === "Y"` **hoặc** giá trị cột `FSC` là `Y/YES` | Là superset. Nghiệp vụ thật so sánh `checkFSC === row.FSC` trong `handle_xuatKhoAo`, nên `PHANLOAI` mới là nguồn sai (nhiều khả năng lỗi copy-paste ở bản gốc). |
| KHOAO: mất `nextPermission` state | Dùng state `nextPermission` để chặn Xuất Next | Dùng `activeTab !== "TON"` (trong handler + `disabled` nút) | Tương đương hành vi, an toàn hơn (không phụ thuộc thứ tự click tab). |
| KHOAO/KHOSUB: `nextPlan` tự `.toUpperCase()` khi nhập | Không uppercase | Uppercase ngay khi nhập | Bản gốc đã uppercase trong payload gọi API; uppercase ở input tránh lệch hiển thị. |
| BOM_AMAZON: `editable` | Edit mode cho **mọi** cột (kể cả `G_CODE`, `G_NAME`, `DOITUONG_NO`…) | Chỉ `GIATRI`, `REMARK`, `DOITUONG_NAME2` | Backend `updateAmazonBOM` chỉ nhận `G_CODE_MAU`, `DOITUONG_NO`, `GIATRI`, `REMARK`, `DOITUONG_NAME2` ⇒ sửa các cột khác chỉ đổi UI, không lưu được. |
| BOM_AMAZON: `addBOMAMAZON` | Không báo kết quả | Báo Swal "hoàn tất" sau khi insert/update | Giữ nguyên (chưa kiểm tra `tk_status` từng dòng — xem mục 3). |
| DESIGN_AMAZON: reset history | Nhánh "chưa tồn tại design" không reset `historyPast/Future` | Reset cả 2 nhánh | Nhất quán hơn. |
| `handleListPrinters` | Thân hàm rỗng (code WebUSB bị comment) | Hiện Swal thông tin | Bản gốc là dead code. |
| QLVL `headerName` / BC column `width` | Tên field gốc / width gốc | Nhãn tiếng Việt / width mới | Thuần trình bày; **không** mất `field` hay cột nào. |

### 1.6 BOM_AMAZON + PRODUCT_BARCODE — lỗi một phần / lỗi kết nối bị hiển thị như thành công

**Bằng chứng backend**: `practice1/config/database_mssql.js` — `queryDB` trả `{ tk_status: "NG", message: <error> }` khi SQL lỗi, và `generalQuery` (frontend) **throw** khi lỗi mạng/HTTP.

**Bằng chứng trước khi sửa**:

- `BOM_AMAZON.addBOMAMAZON`: cả vòng `for` insert/update chỉ có `.catch((err) => console.error(err))` — nuốt toàn bộ lỗi; sau vòng luôn chạy `Swal.fire("Thành công", "Đã lưu BOM Amazon hoàn tất!", "success")` ⇒ **20 dòng lỗi vẫn báo thành công toàn bộ**.
- `PRODUCT_BARCODE.addBarcode`: `checkbarcodeExist` bị `.catch` nuốt, `barcodeExist` giữ `false` ⇒ **mất kết nối bị hiểu nhầm là "chưa tồn tại" rồi insert mù** (tạo bản ghi trùng). `addBarcode`/`updateBarcode`/`deleteBarcode` cũng `.catch` chỉ `console.error` ⇒ lỗi mạng không có phản hồi nào cho người dùng.
- `checkExistBOMAMAZON` (hook BOM_AMAZON): `.catch` set `existcode = false` ⇒ cùng lỗi lớp trên, insert trùng.

**Đã sửa** (thống nhất theo mẫu `err_code` đã dùng ở `KHOAO.handle_xuatKhoAo` / `YCSX f_insertYCSX`):

- `addBOMAMAZON`: gom `err_code` theo từng dòng (label `DOITUONG_NO <n>`), đếm `successCount`; bắt cả nhánh `tk_status === "NG"` lẫn `catch` (lỗi kết nối). Sau khi chạy hết, `err_code !== ""` ⇒ Swal **error** `"Lưu BOM chưa hoàn tất"` kèm `Đã lưu x/y dòng` + danh sách dòng lỗi; chỉ khi sạch lỗi mới báo thành công.
- `addBOMAMAZON`: `checkExistBOMAMAZON` bọc `try/catch` — kiểm tra tồn tại lỗi thì **dừng**, không insert mù.
- `checkExistBOMAMAZON`: bỏ `.catch` nuốt lỗi, để lỗi kết nối ném ra cho caller quyết định.
- `addBarcode`: bước check trùng bọc `try/catch` — lỗi thì dừng và báo rõ; nhánh add báo lỗi kèm `message` thật, không còn im lặng.
- `updateBarcode`, `deleteBarcode`: bọc `try/catch`, báo lỗi kèm `message` thật.
- Bỏ 2 Swal `"Thêm BOM AMAZON mới"` / `"Update BOM AMAZON"` bắn giữa luồng (modal bị thay ngay bởi kết quả cuối) — thông tin đã được thể hiện bằng badge trạng thái trên toolbar + Swal kết quả.

**Quyết định "chặn" hay "chạy tiếp"**: chọn **chạy hết các dòng rồi báo cáo tổng hợp** (không dừng ở dòng lỗi đầu tiên) — vì mỗi dòng BOM là một `DOITUONG_NO` độc lập, dừng sớm sẽ để dữ liệu ở trạng thái nửa vời mà không cho biết dòng nào còn lại cũng sẽ lỗi; bù lại báo cáo có `x/y dòng` + chi tiết từng dòng lỗi.

File: `PrecisionBomAmazon/useBomAmazonData.ts`, `PrecisionProductBarcode/useProductBarcodeData.ts`.

## 3. Rủi ro còn tồn (đề xuất xử lý sau, cần quyết định nghiệp vụ)

1. `BARCODE_STT` ở backend nội suy không nháy ⇒ nếu nghiệp vụ cho phép STT dạng chữ (vd `A1`) thì phải sửa backend sang `N'...'`; nếu chỉ số thì nên validate số ở frontend.
2. `KHOSUB` không có nút Xóa rác / Ẩn rác (giống bản gốc — phần này bị comment trong backup). Nếu cần quản trị rác cho kho Sub thì phải bổ sung cả API.
3. `BOM_AMAZON`/`PRODUCT_BARCODE` vẫn là chuỗi request tuần tự từng dòng — nếu số dòng lớn (`> 100`) nên gộp thành 1 request batch ở backend để tránh timeout giữa luồng.

## 4. Kiểm chứng

- `get_errors` trên toàn bộ 5 folder đã sửa: **0 lỗi**.
- `npm run build` (vite production, `g:\NODEJS\WEBCMS ERP2\cmsnewerp2`): **thành công** — lần 1 `EXIT=0`, `✓ built in 1m 3s`; sau khi fix mục 1.6 `EXIT=0`, `✓ built in 52.53s`.
- Lưu ý: repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác — không dùng `tsc` làm gate (xem `/memories/repo/qc-dtc-parity.md`).
