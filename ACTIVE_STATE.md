# ACTIVE_STATE

## Mục tiêu task hiện tại (đợt 10)
Tối ưu giao diện mobile cho `PlanManager` (Kinh doanh → Quản lý Plan, `/kinhdoanh/planmanager`) bằng **viewport conditional rendering**:
1. Bộ lọc đang là dải input inline → chuyển sang **dạng FLOAT** như `PrecisionPoManager`.
2. Nút "Thêm Plan" bị đẩy khỏi màn hình trên mobile → sửa cho luôn hiển thị.
3. Modal **Thêm Plan**: header/info bị bóp thành nhiều dòng, đẩy toàn bộ nội dung xuống → sửa cho gọn 1–2 dòng.

Trạng thái: **HOÀN THÀNH** — `npm run build` EXIT=0, get_errors 0 lỗi, đã đo layout trên dev server 3001 ở 393px và 1440px.

## File đã chỉnh sửa (đợt 10)
- `planmanager/PlanManager.tsx` — thêm `isMobile` (`matchMedia` + listener `change`); truyền xuống `PrecisionPlanHeader` và `PlanManagerManageTab`.
- `PrecisionPlan/PrecisionPlanHeader.tsx` — nhận `isMobile`; mobile đổi nhãn sub-tab `Trạng thái kiểm tra Plan (Plan Status)` → **`Plan Status`** (nhãn dài chính là nguyên nhân đẩy nút Thêm Plan ra khỏi màn hình).
- `PlanManagerManageTab.tsx` — nhận `isMobile`; thêm state `filterOpen` (effect đóng khi chuyển sang mobile); render `precision-plan__filterBackdrop` + header panel (`__toolbarHead`/`__toolbarTitle`/`__toolbarClose` với `FiX`); toolbar bộ lọc chỉ render khi `!isMobile || filterOpen`; thêm nút **BỘ LỌC** (`__gridBtn--filter`, class `--active` khi đang mở) vào `__gridActions`; tự đóng panel sau khi tra cứu thành công.
- `PrecisionPlan/PrecisionPlanAddModal.tsx` — thêm `isMobile`; mobile rút gọn tiêu đề (`Thêm Kế Hoạch`), **ẩn hẳn `__subtitle`**, đổi nhãn mode `Nhập Thủ Công`→`Thủ Công` / `Import File Excel`→`Excel`, rút gọn dòng info banner; giữ text đầy đủ ở `title` (tooltip).
- `PrecisionPlan/PrecisionPlan.scss` — block `@media (max-width:768px)` ở cuối `.precision-plan` (header/filter/grid toolbar) + block mobile trong `.pp-modal` (header 1 hàng, nút X absolute) + block mobile trong `.pp-manual__info/__infoLeft/__infoRight`; keyframes `pp-fade-in`.

## Việc cần làm tiếp theo
- Kiểm thử thiết bị thật: bộ lọc float có bị bàn phím che khi nhập `input[type=date]` không; thao tác Pivot modal trên màn 320px.
- Mobile: `PlanManagerStatusTab` + `PrecisionPlanAddModal` chưa được tối ưu (2 cột form / modal nhiều field).
- Mobile: `PrecisionPOandStockFull`, `PrecisionQuotation`, `PrecisionYCSX` cũng để filter panel chiếm cột trái → áp lại pattern float này.
- Mobile: `.stitch-inv__footer`, `.po-grid-footer`, `.precision-plan__footer` còn 2 nhóm trái/phải, nên rút gọn khi < 360px.

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
- **Pitfall AG Grid**: `rowStyle`/`getRowStyle`/`getRowId` phải là reference ổn định, nếu không AG Grid redraw toàn bộ row (nháy cell SVG/QR/barcode).
- **Pitfall header mobile**: `PrecisionHeader.tsx` cũ render brand + omnibar + action trên một hàng flex `space-between` với `flex-shrink:0` ⇒ tràn ngang, nút ngôn ngữ/thông báo/user pill bị đẩy khỏi viewport. Đã sửa bằng conditional rendering theo `isMobile` (`matchMedia max-width:768px`): mobile chỉ còn brand + 2 nút (toggle search, overflow) và gom toàn bộ hành động vào `PrecisionHeaderMobileMenu.tsx`; ô search dùng chung biến `searchBoxNode`, mobile render trong `__mobileSearch` (`position:absolute; top:100%`) nên không tăng chiều cao 48px. Backup: `PrecisionHeader.backup.tsx`.
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác ⇒ **không dùng tsc làm gate**, dùng `npm run build` (vite) trong `g:\NODEJS\WEBCMS ERP2\cmsnewerp2`.
- Quy ước tài liệu: findings → `FINDINGS_PARITY_<AREA>_MODULES.md`; tiến độ → `ROADMAP.md`; task hiện tại → `ACTIVE_STATE.md` (≤ 80 dòng).
- Build kiểm chứng: đợt 3 `EXIT=0`; đợt 4 vòng 1 `✓ 17013 modules`, vòng 2 `✓ 17015 modules` (`✓ built in 1m 14s`), `node --check services/nhansuService.js` SYNTAX OK; đợt 5 `npm run build` `EXIT=0`.

