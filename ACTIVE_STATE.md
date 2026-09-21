# ACTIVE_STATE

## Mục tiêu task hiện tại (đợt 14)
R&D → **Quản lý barcode sản phẩm** (`/rnd/productbarcodemanager`):
1. List chọn **MÃ SẢN PHẨM** đổi từ `<select>` sang **AutoComplete** — gõ mã/tên để search, nhấn **Enter chọn luôn option đầu tiên** của list sau lọc.
2. **Fix ô "XEM TRƯỚC MÃ QUÉT TRỰC TIẾP"**: mã vạch/QR không hiện trong khung mà "dạt" ra góc trên-trái component.
Trạng thái: **HOÀN THÀNH** — `npm run build` OK (`✓ built in 1m 27s`), `get_errors` 0 lỗi, đã kiểm chứng trên UI thật (Enter → chọn option đầu; nút X → clear G_CODE; preview 1D/QR/MATRIX đều nằm trong khung).

## File đã chỉnh sửa (đợt 14)
- `product_barcode_manager/PrecisionProductBarcode/ProductCodeAutocomplete.tsx` — **(mới)** component AutoComplete mã SP: `createFilterOptions({ matchFrom: "any", limit: 200 })` (search cả mã lẫn tên), `autoHighlight` (option đầu luôn highlight ⇒ Enter chọn luôn), `openOnFocus`/`selectOnFocus`/`handleHomeEndKeys`, `slotProps.popper.className = productCodeAutocomplete-popper`.
- `PrecisionProductBarcodeForm.tsx` — thay `<select>` bằng `<ProductCodeAutocomplete>`; `handleSelectCode` set `selectedCode` + `G_CODE`/`G_NAME` (clear ⇒ `""`).
- `PrecisionProductBarcode.scss` — style compact `.productCodeAutocomplete` (cao 28px khớp input trong form) + block **GLOBAL** `.productCodeAutocomplete-popper` (popper render qua Portal nên nằm ngoài `.precision-barcode`); selector `input[type="text"], select` đổi thành `> input[type="text"], > select` để không đè style lên input do MUI render.
- `PrecisionProductBarcodeForm.tsx` — **(preview)** gom 3 literal DATA trùng lặp thành `PREVIEW_BASE` + `useMemo previewData` (SIZE_W 60x10mm cho 1D, 10x10mm cho QR/MATRIX); bọc mã vạch trong `<div className="visStage">` có `aspectRatio` theo mm.
- `PrecisionProductBarcode.scss` — **(preview)** `.visBox` thêm `position: relative` + `min-height: 108px`; thêm `.visStage` (`position:relative`, `--stretch` width 100% cho 1D, `--square` 96px cho QR/Matrix) và ép `.amz_barcode/.amz_qrcode/.amz_datamatrix` về `position: relative` + `width/height: 100%` (`svg`, `img` cũng 100%).

## Đợt 13 (đã xong)
Sửa 3 lỗi QLSX/YCSX do user báo:
1. In **Chỉ Thị / Chỉ Thị Combo**: tài khoản khác `NHU1903` báo lỗi "Command 'updateLossKT_ZTB_DM_HISTORY' not supported".
2. **QUICKPLAN2_backup**: cột `IS_SETTING` trong bảng Plan tạm không tick/bỏ tick được.
3. **YCSXManager → In Bản Vẽ**: logo QC PASS góc dưới-trái bị đẩy sang trang 2 khi in A4.

Trạng thái: **HOÀN THÀNH** — `npm run build` (vite) `✓ built in 1m 58s`, `get_errors` 0 lỗi.

## File đã chỉnh sửa (đợt 13)
- `QLSXPLAN/utils/khsxUtils.tsx` — `f_updateLossKT_ZTB_DM_HISTORY`: đổi command sang tên ĐÚNG của backend `updateDMLOSSKT_ZTB_DM_HISTORY` (nguồn lỗi popup đỏ); bước sync phụ trợ chỉ `console.warn` + trả `boolean`, không chặn luồng in.
- `PrecisionPlanDataTb/usePlanDataTbData.ts`, `usePlanDataTbOldData.ts`, `PLAN_DATATB.backup.tsx`, `Machine/MACHINE.tsx` — bỏ nhánh hard-code `if (userData?.EMPL_NO !== "NHU1903")` trong handler in Chỉ Thị/Combo (nguyên nhân "chỉ NHU1903 in được"), snapshot `[...qlsxplandatafilter.current]` trước `handle_UpdatePlan()` để bản in không bị rỗng sau khi grid reload.
- `QUICKPLAN/PrecisionQuickPlan/useQuickPlanData.ts` — thêm `handleToggleIsSetting` (đảo Y/N + ghi `localStorage["temp_plan_table"]` + clear selection) và export ra ngoài.
- `QUICKPLAN/PrecisionQuickPlan/PrecisionQuickPlanTableSection.tsx` — nhận prop `onToggleIsSetting` và truyền vào `getColumnQuickPlanDataTable({ onToggleIsSetting })` (trước đây gọi không tham số nên checkbox `checked` không có handler).
- `QUICKPLAN/QUICKPLAN2_backup.tsx` — destructure + truyền `onToggleIsSetting`.
- `ycsxmanager/PrecisionYCSX/PrecisionYCSXPrintModals.tsx` — `pageStyle` riêng cho bản vẽ: `@page { size: A4 landscape; margin: 0 }` + reset margin `html, body`.
- `ycsxmanager/DrawComponent/DrawComponent.scss` — `.drawcomponent` khai báo `297x208mm` + `overflow:hidden` + `break-inside:avoid`; `.draw { display:block }`; logo trái neo `bottom:4mm`.

## File đã chỉnh sửa (đợt 12 — mobile Amazon)
- `PrecisionYCSX/PrecisionAmzTab.tsx` — thêm `isMobile`; `isFilterHidden` khởi tạo theo `innerWidth <= 768` + effect; **ẩn khối `__kpiGrid` (4 card) trên mobile**; render `precision-ycsx__filterBackdrop`; nút đóng `__filterClose` trong `__filterHeader`; toolbar gắn modifier `__gridToolbar--compact` + nút toggle có class `__toolBtn--filterToggle`; **ẩn nhóm input `Offset X/Y` trên mobile** để toolbar scroll gọn hơn.
- `PrecisionYCSX/PrecisionAmzAddModal.tsx` — thêm `isMobile`; rút gọn tiêu đề (`NHẬP DỮ LIỆU AMZ`) + ẩn `p` subtitle; **chuyển inline style sang dạng mobile** (container `maxWidth/width/height`, `modal-body padding: 10`, grid `1.2fr 1.2fr 2fr` → `repeat(2,…)`, box thông tin `gridColumn: span 2`, banner upload xếp dọc, nhóm nút wrap, `modal-agtable-wrapper minHeight 380 → 220`) + rút gọn text (`Đã nạp`, `Kiểm tra trùng`, `Upload`, `XEM TRƯỚC AMZ`) + ẩn hint footer trên mobile.
- `PrecisionYCSX/PrecisionAmzTab.tsx` — (vòng 2) nút **EX1/EX2** trước đây là `<FiDownload /> EX1` (**text node trần**, không bọc `<span>`) nên rule `.compact .toolBtn > span { display:none }` không match ⇒ bị nhồi icon + chữ vào ô 30px, nhìn như nút "đen trắng, ríu rít". Đã bọc nhãn trong `<span>`, thêm accent `--emerald` và class `--keepLabel` để mobile **giữ nhãn ngắn** (EX1 53×30, EX2 55×30) thay vì icon-only.
- `PrecisionYCSX/PrecisionYCSX.scss` — thêm ngoại lệ `.precision-ycsx__toolBtn--keepLabel` trong block compact (4 class > 3 class của rule ẩn nhãn) + tăng `gap` của `__gridToolbarLeft/Right` từ 4px → 6px trên mobile.
- `PrecisionYCSX/PrecisionYCSX.scss` — **không cần thêm gì cho filter/modal**: block mobile đợt 11 cho `.precision-ycsx__filterPanel` (float) / `__filterClose` / `__gridToolbar--compact` / `.precision-ycsx-modal-container` được tái sử dụng vì `PrecisionAmzTab` dùng chung root `.precision-ycsx`.

## Việc cần làm tiếp theo
- Kiểm thử thiết bị thật: bộ lọc float có bị bàn phím che khi nhập `input[type=date]` không; thao tác Pivot/Print dialog trên màn 320px.
- **Dọn dead code**: `ycsxmanager/TraAMZ/TraAMZ.tsx` + `TraAMZ.scss` và `YCSXManager.backup.tsx`, `PlanManager*.backup.tsx` — chỉ còn được import bởi nhau, không route nào dùng ⇒ nên xoá.
- Mobile: `PrecisionYCSXEditModal`, `PrecisionYCSXPrintModals`, dialog in tem AMZ (MUI Dialog) chưa được tối ưu.
- Mobile: `PrecisionPOandStockFull`, `PrecisionQuotation` cũng để filter panel chiếm cột trái → áp lại pattern float này.

## Ghi chú kỹ thuật (đợt 10 — PlanManager mobile)
- **Nguyên nhân nút "Thêm Plan" biến mất**: `&__tabs` là flex item có `min-width: auto` mặc định; tab `white-space: nowrap` dài ⇒ min-content của tabs > bề rộng màn hình ⇒ `.precision-plan__header` (dù `flex-wrap: wrap`) bị tràn ngang và `.precision-plan` (`overflow: hidden`) cắt mất `&__headerRight`. **Fix 2 lớp**: (a) rút gọn nhãn tab bằng conditional rendering, (b) `&__tabs { flex:1 1 auto; min-width:0; overflow-x:auto }` + `&__headerRight { flex:0 0 auto; margin-left:auto }` ⇒ dù nhãn có dài thì tabs tự scroll, nút không bao giờ bị đẩy ra ngoài.
- **Panel float nên co theo nội dung** (`top:0; left:0; right:0; bottom:auto; max-height:100%`) thay vì `inset:0`: nếu phủ kín thì backdrop bị che (không bấm được) và phần dưới trống trơn. Đo được: panel 468px, backdrop 725px ⇒ còn **257px backdrop bấm được**. Vẫn phải có nút đóng X trong header cho chắc.
- Bộ lọc mobile dùng `flex-direction: column; align-items: stretch` + `.precision-plan__filterGroup { width:100% }`, nhãn `min-width:74px`, input `flex:1 1 auto` (phải override `width` của `--date`/`--text`); ẩn `__filterSep`; nút Tra Cứu full width 34px.
- Grid toolbar mobile: `&__gridToolbar`/`&__gridToolbarLeft` `flex-wrap: nowrap` + `overflow-x:auto` + nút `flex:0 0 auto`; **ẩn `&__gridMeta`** (số dòng đã có ở footer AG Grid) ⇒ 5 nút vừa trọn 1 hàng, không cần scroll.
- Lưu ý: `PrecisionPlan.scss` **không có token `$pp-radius-md`** (chỉ có `$pp-radius: 4px`) ⇒ dùng literal khi cần bo góc lớn hơn.
- **Modal `.pp-modal` không có media query nào** ⇒ mobile bị flex bóp nát: `.pp-modal__headerLeft` (flex item cạnh `__headerRight` 315px) co còn **88px** ⇒ title **8 dòng** + subtitle **9 dòng** (header cao **316px**), và nút X bị đẩy ra ngoài modal (`x=423` > modal right 377). `.pp-manual__info` cũng bị `__infoRight { white-space: nowrap }` bóp `__infoLeft` thành **18 dòng** (info cao **329px**). Sau fix: header **52px**, info **50px**, body **không cần scroll**, nút X nằm trong modal.
- Fix header modal mobile: `&__header { position: relative; flex-wrap: nowrap; padding: 10px 46px 10px 12px }` + `&__headerLeft { flex:1 1 auto; min-width:0 }` + `&__title { nowrap + ellipsis }` + `&__closeBtn { position:absolute; top:8px; right:8px }` (đưa X ra khỏi luồng để không chiếm dòng) + ẩn `__subtitle`.
- Fix info banner mobile: `flex-direction: column; align-items: stretch` + `__infoLeft { min-width:0; nowrap; ellipsis }`.
- **Pitfall**: `min-width: 0` là bắt buộc cho mọi flex item chứa text dài trong khối `display:flex` — nếu không, item sẽ co tới min-content (từng chữ) và text vỡ thành hàng chục dòng.

- **PITFALL quan trọng — nhãn nút là TEXT NODE trần thì CSS không ẩn được**: `<FiDownload /> EX1` (không bọc `<span>`) ⇒ rule `.compact .toolBtn > span { display:none }` không match ⇒ ô 30px bị nhồi cả icon lẫn chữ. **Luôn bọc nhãn trong `<span>`.**
- **Đổi chiến lược toolbar mobile (đợt 12 vòng 3)**: thay vì ép icon-only 30px, dùng `--keepLabel` + **nhãn NGẮN theo `isMobile`** (`label(short,full)` helper). Đo @393: 16 nút 1 hàng, tổng `scrollWidth 1188` (scroll ngang ~3 màn), mọi nút đủ chỗ chữ không tràn. Desktop giữ nguyên nhãn dài + 4 nút lock icon-only (`iconOnlyCount: 4`).
- **Pitfall**: `--keepLabel` phải có specificity CAO HƠN rule ẩn nhãn (4 class > 3 class) — chỉ thêm `!important` sẽ làm desktop cũng hiện nhãn sai.

## Ghi chú kỹ thuật (đợt 11 — YCSXManager mobile)
- Đo trước khi sửa @393×850: KPI chiếm **287px** (4 hàng × 1 cột); `__filterPanel` 220px tĩnh ⇒ `__content` chỉ còn **173px**; toolbar cao **352px** với nút xếp **10 hàng**; header `scrollWidth` 483 > 393 ⇒ nút `+ THÊM DỮ LIỆU AMZ` bị cắt.
- **`!important` ở base ⇒ override mobile cũng phải `!important`**: `__filterPanel`, `__content`, `__gridContainer`, `__mainBody`, `__tableContainer` khai báo gần như mọi thuộc tính kèm `!important` ⇒ block mobile phải dùng `!important` mới thắng.
- **Ẩn nhãn nút bằng CSS chỉ an toàn khi MỌI nút đều có icon**: nút `SET PENDING` trước đây chỉ có `<span>` ⇒ phải thêm `FiClock`, nếu không nút thành trống. Cách làm ít xâm lấn: gắn 1 modifier `__gridToolbar--compact` lên toolbar rồi CSS `.compact .toolBtn { width:30px; padding:0; > span { display:none } }`.
- **Inline style không thể bị CSS class đè** ⇒ với modal YCSX phải sửa ngay trong TSX: `style={{ maxWidth: isMobile ? "100%" : 1100, … }}`, `padding: isMobile ? 10 : 16`, `gridTemplateColumns: isMobile ? "repeat(2, minmax(0,1fr))" : …`.
- Panel float: dùng `top/left/right: 0; bottom: auto; max-height: 100%` (co theo nội dung) ⇒ backdrop còn **84px bấm được**; kèm nút X trong header.
- **Công cụ**: `page.setViewportSize()` có lúc **không còn tác dụng** giữa phiên (viewport bị kẹp theo pane thật của VS Code, tụt về 245px) ⇒ luôn đọc lại `innerWidth` trước khi kết luận layout bị bóp.

## Ghi chú kỹ thuật (đợt 9 — InvoiceManager mobile)
- **Bộ lọc float phủ trọn workspace** (`&__sidebar { position:absolute; inset:0 }`) ⇒ KHÔNG còn chỗ bấm backdrop để đóng (backdrop bị panel che hoàn toàn) ⇒ **bắt buộc có nút đóng riêng trong header panel**. Khác với `PrecisionPoManager` (panel có sẵn `MdClose`).
- **Phải khai báo lại `&__sidebar--collapsed` trong block mobile**: rule mobile `&__sidebar` cùng specificity (0,2,0) nhưng nằm SAU `&__sidebar--collapsed` của desktop ⇒ nếu không khai báo lại, trạng thái collapse sẽ bị đè và panel luôn mở.
- **Toolbar 1 hàng scroll ngang**: `&__toolbar-left { flex-wrap: nowrap; overflow-x: auto; min-width: 0; flex: 1 1 auto }` + `.stitch-inv__btn { flex: 0 0 auto; white-space: nowrap }`; ẩn `.stitch-inv__toolbar-right` (chỉ báo "Sẵn sàng") và ẩn scrollbar (`scrollbar-width:none`) cho gọn. Đo được: 8 nút `scrollWidth 825` vs `clientWidth 377` ở 393px, tất cả nằm 1 hàng.
- **KPI bar tách khỏi bộ lọc**: trên mobile panel bộ lọc là overlay nên widget bên trong sẽ bị ẩn theo ⇒ phải tách ra KPI bar cấp trang (ngoài `__workspace`) để luôn nhìn thấy.
- Đo ở 393px: KPI bar 393×51, 2 chip 185.5px/hàng, giá trị thực tế lớn (`445,810 EA`, `$11,331,644 USD`) **không bị clip**.

## Ghi chú kỹ thuật (đợt 8 — PrecisionPoManager mobile)
- **Vì sao `.po-kpi-grid--compact` đặt NGOÀI media query**: base viết `.precision-po-manager .po-kpi-grid .kpi-card` (0,3,0); block compact viết `.precision-po-manager .po-kpi-grid--compact .kpi-card` cũng (0,3,0) nhưng **sau** trong file ⇒ thắng, không cần `!important` và không phụ thuộc media query.
- **Phải override `max-height` của `.po-main-workspace`**: base đặt `max-height: calc(100% - 95px)` (giả định KPI grid 1 hàng ~95px). Mobile có KPI compact + gap ≈ 104px > 95px ⇒ giữ nguyên sẽ cắt ~9px đáy (mất footer). Mobile đặt `height:auto; max-height:none`.
- **Bộ lọc float**: `.po-main-workspace` giữ `display:flex` + thêm `position:relative`; panel `position:absolute; inset:0; z-index:40`, backdrop `z-index:35`. Bảng vẫn là flex item duy nhất trong luồng ⇒ full width, `height:100%` vẫn phân giải được (main size của flex column là definite).
- **Đo layout không cần backend**: trên dev server 3001, `await import("/src/pages/.../X.scss")` rồi `document.body.innerHTML = markup thật` → đo `getBoundingClientRect`/`getComputedStyle`. Phải `await document.fonts.ready` trước khi đo.
- **PITFALL nút icon-only mobile**: chỉ thêm class `.is-icon-only { width:30px; padding:0 }` là **không đủ** — nhãn `<span>` vẫn render nên chữ tràn khỏi nút (`scrollWidth > clientWidth`), icon bị co còn 0 ⇒ nút nhìn như "đen trắng". Phải **ẩn nhãn bằng conditional rendering ở TSX** (`{!isMobile && <span>…</span>}`) + rule bảo hiểm `.is-icon-only span { display:none }`, và tô accent theo hành động (`btn-action-edit` / `-invoice` / `-danger` / `-success` / `-pivot` / `-excel`).
- **Route thật của trang PO**: menu `Quản lý PO KD1` → `/kinhdoanh/pomanager` vẫn render `.precision-po-manager` (tab "Quản lý PO") ⇒ kiểm chứng được trên UI thật; `pomanager-v2` chỉ là alias route phụ.

## Ghi chú kỹ thuật tích luỹ
- **Đợt 6 — AccountInfo mobile**: `AccountInfo.tsx` chỉ là proxy → `PrecisionAccountInfo`; class SCSS là `precision-hub__*` (không phải `accountinfo`). Override mobile dùng modifier `.precision-hub--mobile` (specificity 0,2,0) nên thắng base (0,1,0) mà **không cần** `!important`; `__profileToolbar` có margin âm nên khi đổi padding card phải đổi margin tương ứng (`-20px → -14px`).
- **Pattern mobile chuẩn của repo**: `isMobile` lấy từ `window.matchMedia("(max-width: 768px)")` + listener `change`, rồi **conditional rendering** (không chỉ ẩn bằng CSS) — xem `PrecisionHeader.tsx`, `UserManager.tsx`, nay có hook chung `AccountInfo/useIsMobile.ts`.
- **Pitfall mobile (Stitch)**: `.component_element & { ... }` có specificity (0,2,0) nên **luôn thắng** block `@media` ở cấp `.precision-xxx` (0,1,0). Muốn mobile có tác dụng phải lặp lại `@media (max-width:768px)` **bên trong** `.component_element &` kèm `!important` cho `height`/`max-height`/`flex`/`overflow`; nếu không container bị `overflow:hidden` + `max-height:100%` + `flex-basis:0` ⇒ cắt cụt nội dung và mất thanh cuộn.
- **Pitfall schema danh mục nhân sự**: `MAINDEPTCODE`, `SUBDEPTCODE`, `WORK_POSITION_CODE` là mã **người dùng nhập**, không phải identity (xác nhận trong `practice1/services/nhansuService.js`) ⇒ không `readOnly` khi thêm mới.
- **Pitfall `insertemployee`**: ghi `ZTBEMPLINFO.CTR_CD = DATA.CTR_CD` (không lấy payload chung) ⇒ form thêm mới phải luôn có `CTR_CD`, nếu rỗng thì nhân viên mới không JOIN được với phòng ban/vị trí.
- **Pitfall face-api**: phải nạp `ssdMobilenetv1` + `faceLandmark68Net` + `faceRecognitionNet` từ `/models` trước `detectSingleFace()`. `f_addEmployee`/`f_updateEmployee` trả **chuỗi lỗi** (rỗng = OK), không throw.
- Đợt 4 — **`APPROVAL_STATUS = 0` là "Từ chối"** (`1` duyệt, `2` chờ, `3` xoá ⇒ backend đổi thành `DELETE`); ảnh thẻ ở `public/Picture_NS/NS_<EMPL_NO>.jpg`, không có `public/avatarpic/`.
- Đợt 4 — backend cũ có thể trả **chuỗi thuần** (`res.send("NO_LEADER")`); `generalQuery` **throw** khi lỗi mạng ⇒ phải bắt cả `tk_status === "NG"` và `catch`. Dùng `isTkOk`/`getTkMessage`/`getErrMessage` từ `src/api/services/responseService.ts`.
- Đợt 4 — **hành động hàng loạt phải giữ đúng gate của cell đơn lẻ** và không set state mù trước khi API trả về. **UI có field mà backend không nhận** (`dangkytangcacanhan` luôn dùng `moment()`; `FINAL_OVERTIMES` mới là số phút OT thật) ⇒ luôn đối chiếu service trước khi tin tham số trên form.
- **Đợt 14 — MUI `renderOption` không được spread props trực tiếp**: React 18.3 đã cảnh báo `A props object containing a "key" prop is being spread into JSX`; phải `const { key, ...optionProps } = props; return <li key={key} {...optionProps}>`.
- **Đợt 14 — popper của `Autocomplete` render qua Portal (append vào body)** ⇒ CSS scoped theo `.precision-xxx` **không** với tới; phải khai báo class riêng ở cấp global (kèm `slotProps.popper.className`).
- **Đợt 14 — SCSS dạng `.formItem input[type="text"]` sẽ bắt cả `<input>` bên trong `TextField` của MUI** (gây double border / sai chiều cao) ⇒ luôn scope bằng con trực tiếp `> input[type="text"]`.
- **Đợt 14 — `BARCODE/QRCODE/DATAMATRIX` (design_amazon) render `position:absolute; top/left: POS_X/POS_Y mm` + size mm** (thiết kế cho canvas tem in). Đặt thẳng vào khung xem trước ⇒ `offsetParent` là `.component_element` nên mã "dạt" ra góc trên-trái component, khung preview trống. Fix: khung cha `position:relative` + ép con về `position:relative; width/height:100%` và set tỉ lệ khung theo đúng mm của tem. `DATAMATRIX` render `<img>` (svg data-url) chứ không phải `<svg>` ⇒ phải override cả `img`.
- **Pitfall AG Grid**: `rowStyle`/`getRowStyle`/`getRowId` phải là reference ổn định, nếu không AG Grid redraw toàn bộ row (nháy cell SVG/QR/barcode).
- **Pitfall header mobile**: `PrecisionHeader.tsx` cũ render brand + omnibar + action trên một hàng flex `space-between` với `flex-shrink:0` ⇒ tràn ngang, nút ngôn ngữ/thông báo/user pill bị đẩy khỏi viewport. Đã sửa bằng conditional rendering theo `isMobile` (`matchMedia max-width:768px`): mobile chỉ còn brand + 2 nút (toggle search, overflow) và gom toàn bộ hành động vào `PrecisionHeaderMobileMenu.tsx`; ô search dùng chung biến `searchBoxNode`, mobile render trong `__mobileSearch` (`position:absolute; top:100%`) nên không tăng chiều cao 48px. Backup: `PrecisionHeader.backup.tsx`.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác ⇒ **không dùng tsc làm gate**, dùng `npm run build` (vite) trong `g:\NODEJS\WEBCMS ERP2\cmsnewerp2`.
- Quy ước tài liệu: findings → `FINDINGS_PARITY_<AREA>_MODULES.md`; tiến độ → `ROADMAP.md`; task hiện tại → `ACTIVE_STATE.md` (≤ 80 dòng).
- Build kiểm chứng: đợt 3 `EXIT=0`; đợt 4 vòng 1 `✓ 17013 modules`, vòng 2 `✓ 17015 modules` (`✓ built in 1m 14s`), `node --check services/nhansuService.js` SYNTAX OK; đợt 5 `npm run build` `EXIT=0`; đợt 13 `✓ built in 1m 58s`.
- **Đợt 13 — route thật của QLSXPLAN**: `QLSXPLAN.tsx` chỉ render bản refactor khi `EMPL_NO === "NHU1903z"` (có chữ `z`, không ai khớp) ⇒ QUICK PLAN chạy `QUICKPLAN2_backup.tsx`, PLAN TABLE chạy `PLAN_DATATB_backup.tsx` + `usePlanDataTbOldData.ts`. Sửa bug phải sửa ở các file này.
- **Đợt 13 — tên command phải khớp `dbCommandHandlers`**: `practice1/services/dbService.js` tra `commandHandlers[command]`; tên command = tên hàm export trong `services/*.js`. Frontend gọi sai tên ⇒ `Command '...' not supported`. `generalQuery` tự inject `CTR_CD`/`COMPANY` nên không cần truyền tay.
- **Đợt 13 — in ấn**: `react-to-print` default pageStyle = `@page { margin: 0 }`. Nếu nội dung in là khối full-bleed cố định (ví dụ `297x208mm`) thì KHÔNG được set `@page { margin: 6mm }` (vùng in còn 198mm < 208mm ⇒ phần tử absolute bị đẩy trọn sang trang sau).

