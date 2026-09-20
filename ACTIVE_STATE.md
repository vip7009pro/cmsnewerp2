# ACTIVE_STATE

## Mục tiêu task hiện tại
Nén gọn màn hình mobile `PrecisionAccountInfo` (Navbar → Tài khoản) để trên 1 viewport thấy đủ: Thông tin cơ bản + Chấm công hôm nay + Biểu đồ công tháng.

Trạng thái: **HOÀN THÀNH** (`npm run build` EXIT=0) + đã kiểm chứng trực quan bằng preview tĩnh rộng 390px.

## File đã chỉnh sửa (đợt 7)
- `AccountInfo/components/PrecisionHeroProfile.tsx` — 4 ô định danh (Mã nhân sự / Mã ERP / Thâm niên / Nhóm điểm danh) dồn về 1 dòng trên mobile; bỏ nút `Ảnh thẻ` (đã có click avatar); nút `Mật khẩu` → icon `lock_reset` (`__pwIconBtn`) nằm cuối dòng sub department ⇒ bỏ hẳn `profileToolbar` trên mobile.
- `AccountInfo/components/PrecisionLiveClock.tsx` — header mobile gộp icon + tiêu đề + ngày về đúng 1 dòng; **bỏ hẳn `shiftProgressBox` (thanh tiến độ giờ chuẩn) trên mobile**, chỉ còn ở desktop.
- `AccountInfo/components/PrecisionAttendanceTimeline.tsx` — mobile: tiêu đề `Công Tháng Này` + segmented `Cột/Đường` + nút reload + nút Excel dồn về **1 dòng** (thay inline style bằng class `__chartToggle` / `__chartToggleBtn`); legend rút gọn nhãn (`Giờ chuẩn 8h`, `OT >8h`, `Hôm nay`) để nằm **1 dòng**.
- `AccountInfo/PrecisionAccountInfo.scss` — mobile: `__metaGrid` = `repeat(4, minmax(0,1fr))`, nhãn meta 8px (clamp 2 dòng), card padding `20px → 12px`, `__cardTitle` nowrap+ellipsis, header clock `nowrap`, `__chartHeaderActions` nowrap + `__btnAction` vuông 28px, `__chartLegendStrip` column + `__legendGroup` nowrap, thêm `__deptText` / `__pwIconBtn` / `__chartToggle` / `__chartToggleBtn`.

## Mục tiêu task hiện tại (đợt 6)
Tối ưu mobile cho `LichSu_New`: mobile chỉ hiển thị filterbar, timeline chart và AGTable; đảm bảo trang cuộn dọc và bảng có chiều cao render ổn định.

Trạng thái: **HOÀN THÀNH** (`npm run build` ✓ 17020 modules). Chi tiết: `ROADMAP.md`.

## File đã chỉnh sửa
- `src/pages/nhansu/LichSu/LichSu_New.tsx` — conditional rendering theo `matchMedia("(max-width: 768px)")`, ẩn header/KPI trên mobile.
- `src/pages/nhansu/LichSu/PrecisionLichSu/PrecisionLichSu.scss` — bật mobile page scroll, cố định vùng AGTable 420px; filter bar mobile: 2 ô ngày + checkbox (3 cột) rồi Search full-width; ép header biểu đồ về một dòng (`flex-wrap: nowrap` + `nowrap`/ellipsis cho title/unit).
- `src/pages/nhansu/LichSu/PrecisionLichSu/PrecisionLichSuToolbar.tsx` — bỏ nút `Load Data` (trùng `onSearch` với nút Search); nhận `isMobile` và ẩn cụm EX1/EX2/PIVOT trên mobile (đã có ở toolbar dưới bảng).
- `src/pages/nhansu/LichSu/PrecisionLichSu/PrecisionLichSuChart.tsx` — nhận `isMobile`; mobile dùng tiêu đề gọn `TIMELINE T9/2026` + `· Giờ thực tế/ngày`, nút Refresh chỉ còn icon.

## Việc cần làm tiếp theo
- Kiểm thử trực quan trên thiết bị mobile thực tế, đặc biệt chiều cao tab container và thao tác cuộn ngang AGTable.

## Mục tiêu task hiện tại
Mobile experience cho `AccountInfo` / `PrecisionAccountInfo` (Navbar → Tài khoản): giảm padding sâu để tăng diện tích hiển thị + conditional rendering theo viewport; trên mobile chỉ hiển thị Avatar/thông tin cơ bản, giờ chấm công vào-ra, biểu đồ công trong tháng và Admin tool.

Trạng thái: **HOÀN THÀNH** (`npm run build` ✓ 17020 modules, EXIT=0). Chi tiết: `ROADMAP.md` — Đợt 6.

## File đã chỉnh sửa (đợt 6)
- `components/Navbar/AccountInfo/useIsMobile.ts` (MỚI) — hook `matchMedia("(max-width:768px)")` + listener `change`, dùng chung cho cả cụm.
- `components/Navbar/AccountInfo/PrecisionAccountInfo.tsx` — gắn modifier `precision-hub--mobile`; mobile ẩn `PrecisionDossierRecord` + `PrecisionKpiGrid`, truyền `isMobile` xuống component con.
- `components/Navbar/AccountInfo/components/PrecisionAttendanceChart.tsx` (MỚI) — tách canvas bar/line khỏi Timeline; mobile bỏ cuộn ngang, mặc định biểu đồ đường.
- `components/Navbar/AccountInfo/components/PrecisionAttendanceTimeline.tsx` — nhận `isMobile`, rút gọn tiêu đề/legend/nút (icon-only); giữ nguyên logic Excel + tính tổng giờ.
- `components/Navbar/AccountInfo/components/PrecisionHeroProfile.tsx`, `PrecisionLiveClock.tsx` — nhận `isMobile`, rút gọn nhãn và ẩn khối trang trí.
- `components/Navbar/AccountInfo/components/PrecisionAdminTools.tsx` — nhóm control `flexWrap: wrap` để không tràn ngang.
- `components/Navbar/AccountInfo/PrecisionAccountInfo.scss` — block `&--mobile` giảm padding/mật độ (hub `10px`, card `20→14px`, avatar `104→72px`, safe-area bottom); sau đó tinh chỉnh `__profileHeader` thành **CSS Grid** (`avatar | name` / `avatar | dept` / `meta meta`) kèm `__profileDetails { display: contents }` để avatar không còn chiếm riêng 1 dòng.

## Việc cần làm tiếp theo
- (đợt 6) Kiểm thử thực tế trên thiết bị: xác nhận `precision-hub--mobile` không che mất vùng cuộn của `.component_element` và Admin tool nhập được trên màn 360px.
- Mobile: toolbar riêng của `PrecisionDeptMainTable`/`SubTable`/`PosTable` nên thu gọn icon-only để đỡ chiếm chỗ.
- (đợt 4, treo) Cấu hình quy chế thật cho hạn mức "3 lần giải trình/tháng" & "40h OT/tháng" (`PrecisionDangKyKpi.tsx` đang là hằng số).
- (đợt 4, treo) Chọn nhiều dòng để duyệt/từ chối hàng loạt ở `PheDuyetNghiCMS`.
- (QC, treo) `updateIncomingData_web` ghi `REMARK` nhưng chưa map đúng `IQC_TEST_RESULT`/`DTC_RESULT`.

## Ghi chú kỹ thuật
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

