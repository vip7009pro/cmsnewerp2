# ACTIVE_STATE

## Mục tiêu task hiện tại
Tối ưu giao diện mobile cho `PrecisionPoManager` (Kinh doanh → Quản lý PO, route `/kinhdoanh/pomanager-v2`) bằng **viewport conditional rendering**:
1. 6 widget KPI quá to → **siêu compact 2 hàng × 3 cột**, mỗi ô 2 dòng (hàng 1 = số lượng, hàng 2 = số tiền).
2. Bộ lọc đơn hàng đang chiếm cột trái, đẩy bảng PO data sang phải → chuyển sang **dạng FLOAT** phủ trên bảng, ẩn/hiện bằng nút trên toolbar.

Trạng thái: **HOÀN THÀNH** — `npm run build` EXIT=0, get_errors 0 lỗi, đã đo layout trên dev server 3001 ở 393px và 1440px.

## File đã chỉnh sửa (đợt 8)
- `pomanager/PrecisionPoManager/PrecisionPoManager.tsx` — thêm `isMobile` (`matchMedia("(max-width:768px)")` + listener `change`); `filterCollapsed` khởi tạo theo `innerWidth <= 768` + effect đồng bộ khi viewport đổi (mobile mặc định ĐÓNG bộ lọc để bảng full width); render `po-filter-backdrop` trên mobile để bấm nền đóng bộ lọc; truyền `compact`/`isMobile` xuống 3 component con.
- `components/PrecisionPoKpiGrid.tsx` — prop `compact`; nhánh compact render 2 hàng × 3 cột, mỗi ô 2 dòng; tiền dùng `maximumFractionDigits: 0`; `title` giữ đủ ngữ nghĩa.
- `components/PrecisionPoFilterPanel.tsx` — nhận `isMobile`; nút header đổi `MdChevronLeft` → `MdClose`.
- `components/PrecisionPoToolbar.tsx` — nhận `isMobile`; nút phụ thêm class `is-icon-only` + không render `<span>` nhãn trên mobile (giữ `title`); ẩn divider giữa nhóm action.
- `PrecisionPoManager.scss` — thêm `.po-kpi-grid--compact` (đặt NGOÀI media query) và block `@media (max-width:768px)` ở cuối `.precision-po-manager`.

## Việc cần làm tiếp theo
- Kiểm thử thiết bị thật: bộ lọc float có bị bàn phím che khi nhập `input[type=date]` không; thao tác Pivot modal trên màn 320px.
- Mobile: `PrecisionPOandStockFull`, `PrecisionQuotation`, `PrecisionYCSX` cũng để filter panel chiếm cột trái → áp lại pattern float này.
- Mobile: `.po-grid-footer` còn 2 nhóm trái/phải, nên rút gọn khi < 360px.

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

