# FINDINGS — Audit parity Nhân sự (đợt 4)

Ngày: 2026-09-20
Phạm vi: 3 module Nhân sự đã refactor Stitch + 3 tab Đăng ký.

| Module | Bản refactor | Bản gốc |
| --- | --- | --- |
| NS1 Điểm danh nhóm | `src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.tsx` + `PrecisionDiemDanh/` | `DiemDanhNhomCMS.backup.tsx` + `components/AttendanceCell.tsx`, `components/OvertimeCell.tsx` |
| NS2 Điều chuyển Team | `src/pages/nhansu/DieuChuyenTeam/DieuChuyenTeamCMS.tsx` + `PrecisionDieuChuyenTeam/` | `DieuChuyenTeamCMS.backup.tsx` + `components/{TeamCell,ShiftCell,FactoryCell,PositionCell}.tsx` |
| NS2 Phê duyệt nghỉ | `src/pages/nhansu/PheDuyetNghi/PheDuyetNghiCMS.tsx` + `PrecisionPheDuyetNghi/` | `PheDuyetNghiCMS.backup.tsx` |
| NS3 Đăng ký (3 tab) | `DangKy/TabDangKy.tsx` → `PrecisionDangKy/` | `TabDangKy.backup.tsx` + `FormDangKyNghi.backup.tsx`, `FormDangKyTangCa.backup.tsx`, `FormXacNhanChamCong.backup.tsx` |

## Kết luận nhanh

- **API/query parity: 100%** — mọi endpoint (`setdiemdanhnhom`, `dangkytangcanhom`, `setteamnhom`, `setca`, `setnhamay`, `setEMPL_WORK_POSITION`, `setpheduyetnhom`, `dangkynghi2`, `dangkytangcacanhan`, `xacnhanchamcongnhom`, `mydiemdanhnhom`) đều khớp bản gốc.
- **`checkBP` parity: 100%** — gate `checkBP(getUserData(), ["ALL"], ["ALL"], ["ALL"], …)` cho Duyệt/Từ chối/Reset/Xóa được giữ đủ trong `PrecisionPheDuyetCells.tsx` (bản refactor trước đó đã đúng, khác với đợt QC/YCSX).
- **Cell thao tác parity 100%** — `PrecisionAttendanceCell` / `PrecisionOvertimeCell` / `TeamActionCell` / `ShiftActionCell` / `FactoryActionCell` / `PositionSelectCell` port 1:1 logic của bản backup.
- Lỗi thực tế tìm được thuộc nhóm **logic nghiệp vụ bulk**, **phân loại trạng thái duyệt**, **asset sai đường dẫn** và **UI không phản ánh dữ liệu thật sự được gửi**.

## Đã sửa

### 1. NS1 — Điểm danh nhanh ghi đè đơn nghỉ đã đăng ký (HIGH)
`DiemDanhNhomCMS.tsx` → `handleMarkAllPresent`.
- Bản backup (`AttendanceCell.onClick(1, calv)`) **chặn** điểm danh khi `OFF_ID != null && REASON_NAME !== 'Nửa phép'` ("Đã đăng ký nghỉ rồi, không điểm danh được").
- Bulk action chỉ lọc `ON_OFF === null` ⇒ nhân sự đang có đơn nghỉ chờ duyệt/đã duyệt vẫn bị điểm danh ĐI LÀM, ghi đè trạng thái nghỉ.
- Fix: tách `eligibleList` (đủ điều kiện) và `blockedList`; cảnh báo số người bị bỏ qua; chỉ gửi API cho danh sách đủ điều kiện.

### 2. NS1 — Bulk action cập nhật state mù khi API lỗi (MEDIUM)
- Trước: set `ON_OFF = 1` cho **toàn bộ** dòng trước khi gọi API, dùng `Promise.all` ⇒ 1 lỗi là bảng hiển thị sai hoàn toàn (báo lỗi chung chung).
- Fix: dùng `Promise.allSettled`, kiểm tra `tk_status` từng dòng, chỉ cập nhật state cho `EMPL_NO` thành công, báo "Hoàn tất một phần x/y".

### 3. NS2 Điều chuyển — Ảnh thẻ sai thư mục (MEDIUM)
`PrecisionDieuChuyenCells.tsx` → `NameAvatarCellRenderer` dùng `/avatarpic/<EMPL_NO>.jpg` nhưng `public/` **không có** thư mục `avatarpic` (chỉ có `Picture_NS/`). Ảnh luôn lỗi ⇒ chỉ hiện fallback chữ cái.
- Fix: `/Picture_NS/NS_<EMPL_NO>.jpg` (đồng bộ với NS1 `AvatarCellRenderer`).

### 4. NS2 Điều chuyển — Nhãn KPI sai ngữ nghĩa (LOW)
`PrecisionDieuChuyenKpi.tsx`: metric `CALV != null` bị gọi là "ĐANG CHI VIỆN / ĐIỀU ĐỘNG" và `CALV == null` là "QUÂN SỐ BÁM LINE TỔ GỐC" — không phản ánh dữ liệu (chỉ là đã/chưa set ca).
- Fix: "ĐÃ GÁN CA ĐIỀU ĐỘNG" / "CHƯA GÁN CA (TỔ GỐC)" + mô tả đúng.

### 5. NS2 Phê duyệt nghỉ — Phân loại `APPROVAL_STATUS` sai ở KPI (HIGH)
`PheDuyetNghiCMS.tsx` → `stats`.
- Bản gốc phân loại: `0 = Từ chối`, `1 = Đã duyệt`, `2 = Chờ duyệt`, `3 = Đã xóa`.
- Refactor tính `APPROVAL_STATUS === 0 || 2` là `pending`, `3` là `rejected` ⇒ **đơn bị từ chối bị đếm vào "Chờ phê duyệt"** và card "Từ chối / Đã xóa" thiếu số.
- Fix: `pending` = còn lại (2/null), `approved` = 1, `rejected` = 0 hoặc 3.

### 6. NS2 Phê duyệt nghỉ — Pivot sai cùng bản chất (HIGH)
`PrecisionPheDuyetPivotModal.tsx`: cột "Đã xóa/Từ chối" nhận `3` nhưng `0` rơi vào "Chờ duyệt".
- Fix: `0 || 3` → `rejected`, còn lại → `pending`.

### 7. NS2 Phê duyệt nghỉ — Nút RESET không lưu xuống DB (HIGH)
`PheDuyetNghiCMS.tsx` → `handleReset`. Bản backup **cũng** chỉ set state local ⇒ sau khi F5 đơn quay lại trạng thái cũ (bug kế thừa).
- Fix: gọi `setpheduyetnhom` với `pheduyetvalue: 2` (backend UPDATE `APPROVAL_STATUS = 2`), chỉ cập nhật UI khi `tk_status === "OK"`, bắt cả nhánh `catch`.

### 8. NS3 Đăng ký — Nhãn trạng thái "0" hiển thị sai (HIGH)
`PrecisionDangKyCells.tsx` → `ApprovalStatusCellRenderer`: `0 || 2` đều hiển thị "Chờ duyệt" ⇒ đơn **đã bị từ chối** hiện như đang chờ.
- Fix: `0` → "Từ chối" (đỏ), `2`/null → "Chờ duyệt" (hổ phách).

### 9. NS3 Đăng ký — Bộ lọc trạng thái lịch sử nghỉ (MEDIUM)
`PrecisionDangKyHistory.tsx`: "Chờ duyệt" gộp cả `0`, thiếu hẳn bộ lọc "Từ chối".
- Fix: `pending` = 2/null, thêm option `rejected` = 0, `canceled` = 3.

### 10. NS3 Đăng ký — Ô "Ngày tăng ca" không có tác dụng (MEDIUM)
`PrecisionOtForm.tsx`: backend `dangkytangcacanhan` (`practice1/services/nhansuService.js`) **luôn** dùng `moment()` (ngày hôm nay), không nhận tham số ngày ⇒ chọn ngày khác vẫn đăng ký cho hôm nay.
- Fix: khoá ô ngày (disabled) + ghi chú "Đơn tăng ca luôn áp dụng cho ngày hôm nay"; đổi nhãn "Hệ số tính lương (tham khảo)", "Nội dung công việc (ghi chú nội bộ)" vì 2 field này không gửi lên server.

### 11. NS3 Đăng ký — Nghỉ nửa ngày lệch giữa UI và dữ liệu (MEDIUM)
`PrecisionLeaveForm.tsx`: chọn "Nửa sáng/Nửa chiều" chỉ map `REASON_CODE = 2` khi kiểu nghỉ là "Phép năm"; với kiểu khác badge vẫn ghi "0.5 ngày" nhưng DB lưu full-day.
- Fix: nửa ngày ⇒ luôn lưu `REASON_CODE = 2` (Nửa phép), khoá select kiểu nghỉ về "Nửa phép" khi đang chọn nửa ngày + hiện ghi chú giải thích.

## Vòng 2 — xử lý 3 tồn đọng (2026-09-20)

### 12. NS3 — KPI thật thay cho số liệu giả cứng (HIGH)
- Trước: `PrecisionDangKyKpi` nhận 5 default cứng (`10/12` ngày phép, `28/40h` OT, `1` lượt giải trình) từ `PrecisionDangKy.tsx` ⇒ hiển thị như số liệu cá nhân thật.
- Fix: thêm hook `useMyMonthAttendance.ts` gọi `mydiemdanhnhom` với `from_date` = đầu tháng, `to_date` = cuối tháng; tính 8 chỉ số **có thật** trong payload SQL:
  - `presentDays` = đếm `ON_OFF = 1`; `workingHours` = `SUM(WORKING_MINUTES)/60`
  - `otHours` = `SUM(FINAL_OVERTIMES)/60` (phút tăng ca thực tế đã trừ giờ nghỉ & làm tròn 15'), `otDays` = số ngày có `OVERTIME_INFO`
  - `leaveDays` = số ngày có `OFF_ID`/`REASON_NAME`; `pendingLeaveOrders` = `APPROVAL_STATUS = 2`
  - `attConfirmCount` = số ngày có `XACNHAN`; `lateCount` = số ngày `LATE_IN_MINUTES > 0`
- UI: 4 card (Ngày công đi làm / Tăng ca lũy kế / Nghỉ phép chờ duyệt / Giải trình chấm công), có `loading` hiển thị `--`, và banner cảnh báo khi tải lỗi. SCSS `__kpis` đổi sang lưới 4 cột (+ modifier `--pending`).
- KPI tự refresh theo `reloadTrigger` mỗi khi đăng ký nghỉ/OT/chấm công thành công.

### 13. `setdiemdanhnhom` trả chuỗi `"NO_LEADER"` (HIGH)
- Backend `nhansuService.js`: 4 chỗ `res.send("NO_LEADER")` (trong `setdiemdanhnhom`, `setdiemdanhnhom2` ×2, `fixWorkHour`) là **phản hồi duy nhất** trong file còn trả chuỗi thuần.
- Fix backend: trả `{ tk_status: "NG", message: "Không có quyền: chỉ Leader / Sub Leader / Dept Staff / ADMIN mới được điểm danh" }` (đã `node --check` OK).
- Fix frontend (chống tái phát): thêm `src/api/services/responseService.ts` với `isTkOk` / `getTkMessage` / `getErrMessage`, áp dụng cho NS1 (`PrecisionAttendanceCell`, `PrecisionOvertimeCell`, `DiemDanhNhomCMS`), NS2 (`PheDuyetNghiCMS` 4 handler) và `DieuChuyenTeamCMS` (4 handler). Đồng thời các nhánh `catch` nay báo lỗi mạng thật thay vì im lặng `console.error`.

### 14. `PrecisionDiemDanhToolbar` có prop chết (MEDIUM)
- Trước: `onExportExcel`/`onOpenPivot` khai báo nhưng controller không truyền ⇒ 2 nút không render, trong khi EX1/EX2/PIVOT nằm trùng ở grid toolbar.
- Fix: hợp nhất **một chỗ duy nhất** — toolbar nhận `onExportEX1`, `onExportEX2`, `onOpenPivot`, `filteredCount`, `totalCount` (badge hiển thị đúng số dòng); cụm nút trùng ở grid toolbar đã gỡ, grid toolbar chỉ còn ô tìm kiếm + meta "x/y nhân sự".

## Đợt 5 — Quản lý Phòng Ban & Hồ sơ Nhân sự (2026-09-20)

Phạm vi: `UserManager.tsx` vs `UserManager.backup.tsx`, `DeptManager.tsx` vs `DeptManager.backup.tsx`
(+ các subcomponent trong `PrecisionUserManager/`, `PrecisionDeptManager/`).

### 15. Khoá chính bị `readOnly` ⇒ không thể THÊM MỚI (HIGH)

- 3 form `PrecisionDeptMainForm` / `PrecisionDeptSubForm` / `PrecisionDeptPosForm` khoá cứng `MAINDEPTCODE` / `SUBDEPTCODE` / `WORK_POSITION_CODE` bằng `readOnly` + icon 🔒.
- Nhưng backend `practice1/services/nhansuService.js` (`insertmaindept`, `insertsubdept`, `insertworkposition`) **KHÔNG** dùng identity/cột tự tăng: mã do client gửi lên và được ghi thẳng vào `VALUES (...)`. Bản backup cho nhập tay cả 3 mã.
- Hệ quả: nhấn "THÊM MỚI" luôn gửi mã `0` ⇒ lỗi SQL / ghi sai dữ liệu. Toàn bộ chức năng thêm bộ phận / phòng ban / vị trí bị vô hiệu.
- Fix: `readOnly={!!code}` — chỉ khoá khi đang sửa bản ghi đã tồn tại (tránh đổi PK ngoài ý muốn), khi thêm mới thì nhập được mã.

### 16. Chuỗi tải dữ liệu 3 cấp bị cũ sau khi sửa/xoá cấp cha (HIGH)

- `handleLoadMainDept` chỉ tải tiếp cấp con khi `!selectedMainDept.MAINDEPTCODE` ⇒ sau khi **xoá/sửa** một bộ phận chính (mã ≠ 0), `handleLoadMainDept` không tải lại cấp 2/3.
- Kết quả: bảng "Phòng ban trực thuộc" và "Vị trí công đoạn" vẫn còn dữ liệu của bộ phận vừa xoá ⇒ sửa/xoá nhầm bản ghi đã biến mất.
- Đồng thời `handleLoadsubDept` / `loadWorkPosition` luôn `setSelected...(kq[0])`, nên mỗi lần bấm Reload lại mất dòng đang chọn.
- Fix: chuỗi `handleLoadMainDept → handleLoadsubDept → loadWorkPosition` luôn tải đủ 3 cấp; dùng `kq.find(code hiện tại) ?? kq[0]` để **giữ lựa chọn** nếu còn tồn tại, tự chọn bản ghi vừa thêm, tự rơi về dòng đầu khi bản ghi bị xoá, và reset sạch cấp con khi danh sách cha rỗng.

### 17. `handleDeleteInfo` không validate / không xác nhận (LOW)

- Thêm `validateForm()` theo từng cấp (bắt buộc mã + tên + mã cha) trước mọi thao tác Add/Update.
- Bọc `Swal.fire({showCancelButton})` xác nhận trước khi xoá (giữ nguyên `checkBP` khi `company !== "CMS"`).

### 18. Mobile: không xem/cuộn được hết 3 bảng (HIGH — lỗi người dùng báo)

- Nguyên nhân gốc: khối `.component_element & { height:100%; max-height:100%; flex:1 1 0px; min-height:0; overflow:hidden }` có **specificity cao hơn** block `@media (max-width:768px) { height:auto; overflow:visible }` đứng trước nó.
  ⇒ Trên mobile, `.precision-deptmanager` vẫn bị `overflow:hidden` + `max-height:100%` + `flex-basis:0` ⇒ bị cắt cụt (chỉ thấy 2 bảng + header bảng 3) và vì mọi tổ tiên đều `height:100%` nên không có thanh cuộn nào hoạt động.
- Fix (3 lớp):
  1. `PrecisionDeptManager.scss` — lặp lại block mobile **bên trong** `.component_element &` để ghi đè bằng `!important`: `height:auto`, `max-height:none`, `flex:0 0 auto`, `overflow:visible`.
  2. Bỏ `flex:1 1 0px` ở `__triGrid` / `__panel` trên mobile; hạ chiều cao bảng mobile `420px → 320px` cho gọn.
  3. `QuanLyPhongBanNhanSu.scss` — trên mobile bỏ `flex-basis:0` + `min-height:100vh` cho `.tabs-container` / `.tab-content` / `.tab-pane` để trang cao theo nội dung; việc cuộn do `.component_element` (`overflow-y:auto`) đảm nhiệm.
- Áp dụng cùng cách sửa cho `PrecisionUserManager.scss` (cùng lớp lỗi, trước đó chưa có media query nào).

### 19. `UserManager` mất bước nạp face-api models (HIGH)

- Bản backup có `loadModels()` trong `useEffect` mount: `ssdMobilenetv1` + `faceRecognitionNet` + `faceLandmark68Net` từ `/models`.
- Bản refactor gọi thẳng `faceapi.detectSingleFace()` ⇒ face-api luôn báo model chưa load ⇒ **Train Face / Check Face chết 100%**.
- Fix: helper `ensureFaceModels()` cache theo module scope (nạp 1 lần, tự cho phép thử lại nếu lỗi), gọi trong `useEffect` mount và `await` trước mỗi lần detect; bổ sung guard "chọn nhân viên trước" và thông báo lỗi nêu rõ đường dẫn ảnh `/Picture_NS/NS_<EMPL_NO>.jpg` + thư mục `/models`.

### 20. Lỗi API bị nuốt im lặng + `CTR_CD` rỗng khi thêm nhân viên (MEDIUM)

- `f_addEmployee` / `f_updateEmployee` **trả về chuỗi lỗi** (rỗng = thành công) nhưng bản refactor bỏ qua giá trị trả về ⇒ thêm/sửa thất bại vẫn im lặng. Fix: đọc kết quả, báo `Swal` lỗi và chỉ đóng modal khi thành công; `loadEmplInfo` nhận cờ `showNotice` để không bắn 2 popup liên tiếp.
- `createNewUser()` xoá trắng `CTR_CD`, trong khi `insertemployee` ghi `ZTBEMPLINFO.CTR_CD = DATA.CTR_CD` ⇒ nhân viên mới không JOIN được với `ZTBSUBDEPARTMENT`/`ZTBWORKPOSITION`/`ZTBMAINDEPARMENT`. Fix: `CTR_CD: getCtrCd()` khi clear form + fallback `selectedRows.CTR_CD || getCtrCd()` ngay trước khi insert.
- `createNewUser()` cũng mặc định `WORK_POSITION_CODE: 1` cứng → đổi sang vị trí đầu tiên có thật trong `workpositionload`.

### 21. Nút PIVOT là hàng giả (MEDIUM)

- `onOpenPivot` thực chất gọi `SaveExcel(filteredData, "DiemDanh_Pivot_Raw")` — một nút "PIVOT" chỉ xuất Excel với tên file sai ngữ cảnh.
- Fix: tạo `PrecisionUserManager/PrecisionUserPivotModal.tsx` (React thuần, không thêm dependency) — chọn nhóm theo Bộ phận chính / Phòng ban – Tổ / Trạng thái / Chức vụ / Ca, thống kê Tổng – Đang làm – Đã nghỉ – Nghỉ sinh + thanh tỉ lệ, có dòng TỔNG CỘNG.
- Đồng thời sửa nhãn 2 nút Excel cho đúng ngữ nghĩa: `EX1 Đang lọc` (dữ liệu sau filter + ô tìm kiếm) và `EX2 Toàn bộ`.

## Tồn đọng / rủi ro chưa xử lý

1. **`PheDuyetNghiCMS` bulk duyệt**: chưa có chọn nhiều dòng để duyệt/từ chối hàng loạt (bản gốc cũng không có) — chỉ là gợi ý cải tiến.
2. **`PrecisionAttendanceForm.confirmReason`** (lý do giải trình) không gửi lên server, backend chỉ ghi `XACNHAN='GD:0800-1700'`. Đã ghi rõ "(ghi chú nội bộ)".
3. **`PrecisionDiemDanhFooter.tsx` mồ côi** — đã chủ động bỏ khỏi màn hình theo `ROADMAP.md`; giữ file, không phải lỗi.
4. **`PrecisionOtForm.otReason`** (nội dung công việc) cũng không gửi lên server; đã ghi rõ "(ghi chú nội bộ)".
5. **KPI "Giải trình chấm công"** giới hạn `/3 lần quy chế` là hằng số hiển thị (`ATT_CONFIRM_QUOTA`) vì backend chưa có cấu hình quy chế; khi có bảng quy chế thì thay bằng dữ liệu.

## Kiểm chứng

- Vòng 1: `get_errors` trên 10 file đã sửa → **0 lỗi**; `npm run build` **thành công** (`✓ 17013 modules transformed`).
- Vòng 2: `node --check services/nhansuService.js` → **SYNTAX OK**; `get_errors` trên 9 file frontend đã sửa → **0 lỗi**; `npm run build` (vite production) → `✓ 17015 modules transformed`, `✓ built in 1m 14s`.
- Đợt 5: `get_errors` trên 8 file đã sửa/tạo → **0 lỗi**; `npm run build` (vite production) → `EXIT=0` (dist + bản `.gz` phát sinh đầy đủ).
- Build chỉ còn warning `eval` có sẵn từ `@bundled-es-modules/pdfjs-dist` (không liên quan thay đổi này).
