# ACTIVE_STATE

## Mục tiêu task hiện tại
Rà soát parity `UserManager` / `DeptManager` (module Quản lý Phòng Ban & Hồ sơ Nhân sự) so với `.backup`, sửa sai khác logic + cải tiến điểm bất hợp lý, gồm lỗi mobile không xem/cuộn được hết 3 bảng ở `DeptManager`.

Trạng thái: **HOÀN THÀNH** (audit + fix + `npm run build` EXIT=0). Chi tiết: `FINDINGS_PARITY_NHANSU_MODULES.md` mục 15-21.

## File đã chỉnh sửa (đợt 5)
- `PrecisionDeptManager/PrecisionDeptMainForm.tsx`, `PrecisionDeptSubForm.tsx`, `PrecisionDeptPosForm.tsx` — bỏ `readOnly` cứng trên `MAINDEPTCODE`/`SUBDEPTCODE`/`WORK_POSITION_CODE` (chỉ khoá khi sửa bản ghi có sẵn) ⇒ khôi phục chức năng THÊM MỚI.
- `DeptManager.tsx` — chuỗi tải 3 cấp luôn đồng bộ (`handleLoadMainDept → handleLoadsubDept → loadWorkPosition`), giữ dòng đang chọn qua `kq.find(code) ?? kq[0]`; thêm `validateForm()`; thêm xác nhận trước khi xoá.
- `PrecisionDeptManager/PrecisionDeptManager.scss` — lặp block mobile **bên trong** `.component_element &` kèm `!important`; bỏ `flex:1 1 0px` ở `__triGrid`/`__panel`; chiều cao bảng mobile `420px → 320px`.
- `QuanLyPhongBanNhanSu.scss` — mobile bỏ `flex-basis:0`/`min-height:100vh` cho `.tabs-container`/`.tab-content`/`.tab-pane`, nhường cuộn cho `.component_element`.
- `PrecisionUserManager/PrecisionUserManager.scss` — cùng cách sửa mobile; `__gridContainer` mobile cao `60vh`.
- `UserManager.tsx` — thêm `ensureFaceModels()` (cache module-scope, nạp 3 model từ `/models`) + `await` trước khi detect; đọc kết quả trả về của `f_addEmployee`/`f_updateEmployee` để báo lỗi thật; `createNewUser()` giữ `CTR_CD = getCtrCd()` và mặc định vị trí công đoạn theo `workpositionload`; nối pivot modal.
- `PrecisionUserManager/PrecisionUserPivotModal.tsx` (MỚI) — pivot thật theo Bộ phận / Phòng ban – Tổ / Trạng thái / Chức vụ / Ca.
- `PrecisionUserManager/PrecisionUserToolbar.tsx` — nhãn `EX1 Đang lọc` / `EX2 Toàn bộ`.
- `FINDINGS_PARITY_NHANSU_MODULES.md`.

## Việc cần làm tiếp theo
- Mobile: toolbar riêng của `PrecisionDeptMainTable`/`SubTable`/`PosTable` nên thu gọn icon-only để đỡ chiếm chỗ.
- (đợt 4, treo) Cấu hình quy chế thật cho hạn mức "3 lần giải trình/tháng" & "40h OT/tháng" (`PrecisionDangKyKpi.tsx` đang là hằng số).
- (đợt 4, treo) Chọn nhiều dòng để duyệt/từ chối hàng loạt ở `PheDuyetNghiCMS`.
- (QC, treo) `updateIncomingData_web` ghi `REMARK` nhưng chưa map đúng `IQC_TEST_RESULT`/`DTC_RESULT`.

## Ghi chú kỹ thuật
- **Pitfall mobile (Stitch)**: `.component_element & { ... }` có specificity (0,2,0) nên **luôn thắng** block `@media` ở cấp `.precision-xxx` (0,1,0). Muốn mobile có tác dụng phải lặp lại `@media (max-width:768px)` **bên trong** `.component_element &` kèm `!important` cho `height`/`max-height`/`flex`/`overflow`; nếu không container bị `overflow:hidden` + `max-height:100%` + `flex-basis:0` ⇒ cắt cụt nội dung và mất thanh cuộn.
- **Pitfall schema danh mục nhân sự**: `MAINDEPTCODE`, `SUBDEPTCODE`, `WORK_POSITION_CODE` là mã **người dùng nhập**, không phải identity (xác nhận trong `practice1/services/nhansuService.js`) ⇒ không `readOnly` khi thêm mới.
- **Pitfall `insertemployee`**: ghi `ZTBEMPLINFO.CTR_CD = DATA.CTR_CD` (không lấy payload chung) ⇒ form thêm mới phải luôn có `CTR_CD`, nếu rỗng thì nhân viên mới không JOIN được với phòng ban/vị trí.
- **Pitfall face-api**: phải nạp `ssdMobilenetv1` + `faceLandmark68Net` + `faceRecognitionNet` từ `/models` trước `detectSingleFace()`. `f_addEmployee`/`f_updateEmployee` trả **chuỗi lỗi** (rỗng = OK), không throw.
- Đợt 4 — **`APPROVAL_STATUS = 0` là "Từ chối"** (`1` duyệt, `2` chờ, `3` xoá ⇒ backend đổi thành `DELETE`); ảnh thẻ ở `public/Picture_NS/NS_<EMPL_NO>.jpg`, không có `public/avatarpic/`.
- Đợt 4 — backend cũ có thể trả **chuỗi thuần** (`res.send("NO_LEADER")`); `generalQuery` **throw** khi lỗi mạng ⇒ phải bắt cả `tk_status === "NG"` và `catch`. Dùng `isTkOk`/`getTkMessage`/`getErrMessage` từ `src/api/services/responseService.ts`.
- Đợt 4 — **hành động hàng loạt phải giữ đúng gate của cell đơn lẻ** và không set state mù trước khi API trả về. **UI có field mà backend không nhận** (`dangkytangcacanhan` luôn dùng `moment()`; `FINAL_OVERTIMES` mới là số phút OT thật) ⇒ luôn đối chiếu service trước khi tin tham số trên form.
- **Pitfall AG Grid**: `rowStyle`/`getRowStyle`/`getRowId` phải là reference ổn định, nếu không AG Grid redraw toàn bộ row (nháy cell SVG/QR/barcode).
- Repo có sẵn nhiều lỗi `tsc --noEmit` ở module khác ⇒ **không dùng tsc làm gate**, dùng `npm run build` (vite) trong `g:\NODEJS\WEBCMS ERP2\cmsnewerp2`.
- Quy ước tài liệu: findings → `FINDINGS_PARITY_<AREA>_MODULES.md`; tiến độ → `ROADMAP.md`; task hiện tại → `ACTIVE_STATE.md` (≤ 80 dòng).
- Build kiểm chứng: đợt 3 `EXIT=0`; đợt 4 vòng 1 `✓ 17013 modules`, vòng 2 `✓ 17015 modules` (`✓ built in 1m 14s`), `node --check services/nhansuService.js` SYNTAX OK; đợt 5 `npm run build` `EXIT=0`.

