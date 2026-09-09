# ERP Chat & Semantic Engine - Task Context & Status

## Update - 2026-09-09 (Precision LichSu NS5: Stitch Redesign, Responsive Desktop/Mobile, 4 KPIs, Recharts Timeline, AGTable & Pivot Modal)

### Completed
- **Runtime Hotfix - Excel Service Export**:
  - Fixed runtime syntax error `does not provide an export named 'exportToExcel'` by changing import in `LichSu_New.tsx` to `SaveExcel` from `excelService.ts`, and exported backwards-compatible alias `export const exportToExcel = SaveExcel;` in `excelService.ts`.
- **Full Preservation of Legacy Implementation with Backup**:
  - Created `src/pages/nhansu/LichSu/LichSu_New.backup.tsx` preserving 100% of the legacy 1226-line implementation, API query commands (`mydiemdanhnhom`), formula calculations (`calcMinutesByRate`, `tinhLuong`), state handlers, and SweetAlert2 alerts.
- **Stitch High-Density Enterprise Redesign (`LichSu_New.tsx` & `PrecisionLichSu/`)**:
  - Replaced legacy neon and plain card styles with clean neutral Google Stitch design system tokens (slate `#f8fafc`, pure white cards `#ffffff`, subtle borders `#e2e8f0`, micro shadows `0 1px 2px rgba(15, 23, 42, 0.04)`).
  - Dedicated modular SCSS architecture `PrecisionLichSu.scss` with comprehensive Media Queries ensuring flawless responsiveness across Desktop, Tablet, and Mobile screens (enforcing Rule 6 of `SKILL.md`).
  - Multi-Tab Mode Guarantee: Enforced `width: 100%; max-width: 100%; height: 100%; max-height: 100%; flex: 1; min-height: 0;` on `.precision-lichsu` and `.component_element &`.
- **Subcomponents & Clean Architecture (All files < 300 lines)**:
  1. *Sub-Header Banner (`PrecisionLichSuHeader.tsx` - 64 lines)*:
     - Title: `01. NHÂN SỰ & HÀNH CHÍNH • NS5 - LỊCH SỬ ĐI LÀM & CHẤM CÔNG CÁ NHÂN`.
     - User Identity Chip: Avatar initial letter, Full name, Employee code (`CMS_ID` / `EMPL_NO`), Department.
     - Telemetry status: `ZKTECO: 100% SYNC` and `HRM ACTIVE` with pulsating green status dots.
  2. *Operational Toolbar (`PrecisionLichSuToolbar.tsx` - 126 lines)*:
     - Date range filter: `From Date` and `To Date` inputs.
     - `Default` checkbox: Auto selects from first day of month to today for table, and end of month for chart.
     - Action buttons: "Search" (Royal Blue), "Load Data" (Emerald), "EX1 (Đang lọc)", "EX2 (Tất cả)", and "PIVOT (Phân tích)".
  3. *Real-time 4 KPI Cards (`PrecisionLichSuKpi.tsx` - 107 lines)*:
     - Card 1: Tổng ngày làm việc (Đếm `ON_OFF === 1`, icon `event_available`).
     - Card 2: Tổng giờ tích lũy (Giờ thực tế từ `WORKING_MINUTES / 60` hoặc timeline, icon `schedule`).
     - Card 3: Tăng ca OT (Tổng giờ OT `FINAL_OVERTIMES / 60`, icon `more_time`).
     - Card 4: Nghỉ phép / Nghỉ tuần (Đếm `ON_OFF === 0` hoặc Chủ nhật, icon `free_cancellation`).
  4. *Attendance Timeline Chart (`PrecisionLichSuChart.tsx` - 172 lines)*:
     - Clean Recharts LineChart displaying real-time daily worked hours (`diffMinutes - 60`).
     - Green line for past days (`hoursPast`), red dashed line for future/today (`hoursFuture`).
     - Red highlight for Sunday ticks on X-Axis.
     - Modern Stitch rounded tooltip card and quick "Refresh" button.
  5. *High-Density AG-Grid Interactive Action Cells (`PrecisionLichSuCells.tsx` - 124 lines)*:
     - `DateCellRenderer`: JetBrains Mono bold date.
     - `WeekdayCellRenderer`: Red bold Sunday, royal blue weekdays.
     - `OnOffCellRenderer`: Compact status badges ("Đi làm", "Nghỉ làm", "Chưa điểm danh").
     - `CheckTimeCellRenderer` & `FixedTimeCellRenderer`: Monospace time values for `CHECK1`, `CHECK2`, `CHECK3`, `IN_TIME`, `OUT_TIME`.
     - `MinuteDiffCellRenderer`: Color-coded early in, late in, early out, and OT minutes.
     - `ApprovalStatusCellRenderer`: Badges for "Phê duyệt", "Từ chối", "Chờ duyệt".
     - `EmplBadgeCellRenderer`: JetBrains Mono badge chip for `EMPL_NO` and `NS_ID`.
  6. *Multidimensional Pivot Modal (`PrecisionLichSuPivotModal.tsx` - 124 lines)*:
     - Interactive matrix summary by Day of the Week (Monday to Sunday) calculating total days, worked days, late counts, early out counts, regular hours, and OT hours.
  7. *AGTable Standardization & Clean Controller (`LichSu_New.tsx` - 233 lines)*:
     - Default green toolbar completely removed (`.agtable .toolbar { display: none !important; }`).
     - Quick Search input placed on `gridToolbar` along with compact `EX1`, `EX2`, and `PIVOT` buttons.
- **Validation**:
  - TypeScript compiler (`tsc --noEmit`) verified 0 errors across the entire `src/pages/nhansu/LichSu/` directory.

## Update - 2026-09-09 (Precision PheDuyetNghi: Stitch Redesign, Full-Width Multi-Tab, 4 KPIs, Interactive Cells & Pivot Modal)

### Completed
- **Full Preservation of Legacy Implementation with Backup**:
  - Created `src/pages/nhansu/PheDuyetNghi/PheDuyetNghiCMS.backup.tsx` preserving 100% of the legacy 401-line implementation, API endpoints (`pheduyetnghi`, `setpheduyetnhom`), SweetAlert2 alerts, and permissions.
- **Stitch High-Density Enterprise Redesign (`PheDuyetNghiCMS.tsx` & `PrecisionPheDuyetNghi/`)**:
  - Replaced legacy basic layout with clean neutral Google Stitch tokens (slate `#f8fafc`, pure white cards `#ffffff`, subtle borders `#e2e8f0`, micro-shadows `0 1px 2px rgba(15, 23, 42, 0.04)`).
  - Dedicated modular SCSS architecture `PrecisionPheDuyetNghi.scss` without Tailwind runtime dependencies.
  - Multi-Tab Mode Guarantee: Enforced `width: 100%; max-width: 100%; height: 100%; max-height: 100%; flex: 1; min-height: 0;` on `.precision-pheduyet` and `.component_element &`.
- **Subcomponents & Clean Architecture (All files < 300 lines)**:
  1. *Sub-Header Banner (`PrecisionPheDuyetHeader.tsx` - 57 lines)*:
     - Module title: `01. NHÂN SỰ & HÀNH CHÍNH • NS4 - TRUNG TÂM PHÊ DUYỆT ĐƠN NGHỈ PHÉP`.
     - Real-time telemetry pills: `SOCKET REALTIME SYNC` and `MES & HRM SYNC ACTIVE`.
  2. *Real-time 4 KPI Cards (`PrecisionPheDuyetKpi.tsx` - 79 lines)*:
     - Card 1: Tổng số đơn đăng ký trong kỳ (`TOTAL_COUNT` với icon `assignment_turned_in`).
     - Card 2: Chờ phê duyệt cấp tốc (`PENDING_COUNT` với icon `pending_actions`, amber badge).
     - Card 3: Đã phê duyệt chính thức (`APPROVED_COUNT` với icon `task_alt`, emerald badge).
     - Card 4: Đã từ chối / Hủy đơn (`REJECTED_COUNT` với icon `cancel`, rose badge).
  3. *Operational Toolbar (`PrecisionPheDuyetToolbar.tsx` - 110 lines)*:
     - Date range picker (Từ ngày - Đến ngày).
     - Filter checkbox: "Chỉ hiện đơn chờ duyệt (Only Pending)" giúp quản lý tập trung xử lý tồn đọng.
     - Action buttons: "Tra cứu dữ liệu" (`search`), "Phê duyệt hàng loạt" (`done_all`), "Từ chối chọn" (`close`).
  4. *High-Density AG-Grid Interactive Action Cells (`PrecisionPheDuyetCells.tsx` - 128 lines)*:
     - `PheDuyetActionCell`: Nút phê duyệt nhanh:
       - Nếu đơn chưa duyệt: nút xanh lá "Duyệt" và nút đỏ "Từ chối".
       - Nếu đơn đã duyệt/từ chối: nút xám "Reset" đưa về chờ duyệt.
       - Nút xóa đơn kèm SweetAlert2 confirmation dialog cảnh báo trước khi xóa.
     - `PheDuyetEmployeeCell`: Avatar 24x24px, Họ tên in đậm, mã nhân viên JetBrains Mono badge.
     - `PheDuyetMonoBadge`: Chip JetBrains Mono chuyên biệt cho mã đơn (`OFF_ID`).
     - `PheDuyetReasonBadge`: Badge màu phân loại kiểu nghỉ (Phép năm: xanh lam, Nửa phép: tím, Nghỉ ốm: cam, Việc riêng: hổ phách, Không lương: xám).
  5. *Multidimensional Pivot Modal (`PrecisionPheDuyetPivotModal.tsx` - 142 lines)*:
     - Thống kê chéo số lượng đơn theo: Loại nghỉ phép (Phép năm, ốm, việc riêng...), Tình trạng duyệt (Chờ, Đã duyệt, Hủy), và Phòng ban / Bộ phận.
  6. *AGTable Standardization & Export Actions*:
     - Toolbar xanh lá mặc định của AGTable được ẩn hoàn toàn (`.agtable .toolbar { display: none !important; }`).
     - Bổ sung ô tìm kiếm tức thời `Quick Search` ngay trên đầu bảng AGTable (`gridToolbar`).
     - Bổ sung các nút: `EX1 (Đang lọc)`, `EX2 (Tất cả)`, `PIVOT (Phân tích)` lên thanh `gridToolbar` với chiều cao compact 26px.
- **Validation**:
  - Vite dev server biên dịch thành công HTTP 200 cho toàn bộ 7 file của module `PheDuyetNghi`.

## Update - 2026-09-09 (Precision TabDangKy NS3: Stitch Redesign, Full-Width Multi-Tab, 3 KPI Micro-Cards, Modular Sub-Tabs Forms & AGTable History)

### Completed
- **Full Preservation of Legacy Implementation with 4 Backups**:
  - Created `src/pages/nhansu/DangKy/TabDangKy.backup.tsx` (preserving original tabs wrapper).
  - Created `src/pages/nhansu/DangKy/FormDangKyNghi.backup.tsx` (preserving original leave registration form).
  - Created `src/pages/nhansu/DangKy/FormDangKyTangCa.backup.tsx` (preserving original overtime registration form).
  - Created `src/pages/nhansu/DangKy/FormXacNhanChamCong.backup.tsx` (preserving original attendance confirmation form).
  - Preserved 100% of API query commands: `dangkynghi2`, `dangkytangcacanhan`, `xacnhanchamcongnhom`, realtime socket notification pipeline `f_insert_Notification_Data` + `socket.emit("notification_panel")`, and SweetAlert2 alerts.
- **Stitch High-Density Enterprise Redesign (`TabDangKy.tsx` & `PrecisionDangKy/`)**:
  - Replaced legacy neon gradient background (`#afd3d1`, `#2ffc73`, large buttons `#21a73e`, `#3633f7`) with clean neutral Stitch tokens (slate `#f8fafc`, pure white cards `#ffffff`, subtle borders `#e2e8f0`, micro-shadows `0 1px 2px rgba(15, 23, 42, 0.04)`).
  - Dedicated modular SCSS architecture `PrecisionDangKy.scss` with zero Tailwind runtime dependency.
  - Multi-Tab Mode Guarantee: Enforced `width: 100%; max-width: 100%; height: 100%; max-height: 100%; flex: 1; min-height: 0;` on `.precision-dangky` and `.component_element &`.
- **Subcomponents & Clean Architecture (All files < 300 lines)**:
  1. *Sub-Header Banner (`PrecisionDangKyHeader.tsx` - 57 lines)*:
     - Module title: `01. NHÂN SỰ & HÀNH CHÍNH • NS3 - CỔNG ĐĂNG KÝ NGHỈ PHÉP, TĂNG CA & CHẤM CÔNG`.
     - User Badge: Avatar initial, full name, position/department, employee code (`EMPL_NO`).
     - Telemetry status: `HRM SYNC ACTIVE` with pulsating green dot.
  2. *Real-time 3 KPI Cards (`PrecisionDangKyKpi.tsx` - 77 lines)*:
     - Card 1: Quỹ phép năm (Số ngày còn / 12 ngày định mức, blue progress bar).
     - Card 2: OT Lũy kế tháng (Số giờ OT / 40h định mức, amber progress bar).
     - Card 3: Giải trình công (Số lần cần duyệt, status badge).
  3. *Sub-Tabs Interactive Forms (`PrecisionDangKyForms.tsx` - 72 lines)*:
     - 3-tab pill switcher: "Nghỉ phép" (`calendar_add_on`), "Tăng ca (OT)" (`schedule`), "Chấm công" (`fingerprint`).
     - Includes CMS Vina automatic approval regulation notice card.
  4. *Leave Registration Form (`PrecisionLeaveForm.tsx` - 207 lines)*:
     - Micro duration selector pills (Cả ngày 8h, Nửa sáng 4h, Nửa chiều 4h) with auto calculated days.
     - Leave type dropdown, work shift allocation, from date - to date, handover remark, and clear/submit buttons.
  5. *Overtime Registration Form (`PrecisionOtForm.tsx` - 191 lines)*:
     - Shift pay coefficients (150%, 200%, 210%, 300%), start time (1700), finish time (2000), auto OT hours calculation, work description.
  6. *Attendance Confirmation Form (`PrecisionAttendanceForm.tsx` - 153 lines)*:
     - Missing punch types (`GD`: check-in, `GS`: check-out, `CA`: both), incident date, actual working time, specific explanation.
  7. *Leave Audit History Ledger (`PrecisionDangKyHistory.tsx` - 303 lines)*:
     - AGTable integrated with `mydiemdanhnhom` API querying **All-Time** history (`2010-01-01` to end of next year).
     - **Strict Leave Filtering**: Excludes all normal days without leave applications (`item.REASON_NAME === null && item.OFF_ID === null`); displays exclusively active leave requests.
     - Sorted in descending order (latest leave dates on top).
     - High-density columns: STT (`id`), Mã đơn (`OFF_ID` via `LeaveCodeCellRenderer`), Ngày nghỉ (`LeaveDateCellRenderer`), Thứ (`WeekdayCellRenderer` with bold red Sundays), Kiểu nghỉ (`LeaveTypeBadgeCellRenderer`), Ca nghỉ (`LeaveShiftCellRenderer`), Lý do/Bàn giao (`DetailReasonCellRenderer`), Ngày làm đơn (`RequestDateCellRenderer`), and Trạng thái duyệt (`ApprovalStatusCellRenderer`).
     - Green toolbar completely hidden (`.agtable .toolbar { display: none !important; }`).
     - Export buttons `EX1 (Đang lọc)` and `EX2 (Tất cả)` alongside Reload button placed on top quick filter toolbar (`gridToolbar`).
     - Auto reload trigger (`reloadTrigger`) upon successful form submission.
- **Validation**:
  - Vite dev server returned `HTTP 200` for all new and updated files.

## Update - 2026-09-09 (Precision DieuChuyenTeam: Stitch Redesign, Full-Width Multi-Tab, 4 KPIs & Interactive Cells)

### Completed
- **Full Preservation of Legacy Implementation with Backup**:
  - Created `src/pages/nhansu/DieuChuyenTeam/DieuChuyenTeamCMS.backup.tsx` preserving 100% of the legacy 222-line implementation, API queries, socket emissions, and state handlers.
- **Stitch High-Density Enterprise Redesign (`DieuChuyenTeamCMS.tsx`)**:
  - Replaced legacy neon gradient background (`linear-gradient(0deg, #afd3d1, #a4ec51)` / `#d49ef8`) with clean, neutral Stitch design system tokens (slate `#f8fafc`, pure white cards `#ffffff`, subtle borders `#e2e8f0`, micro shadows `0 1px 2px rgba(15, 23, 42, 0.04)`).
  - Built dedicated SCSS architecture `src/pages/nhansu/DieuChuyenTeam/PrecisionDieuChuyenTeam/PrecisionDieuChuyenTeam.scss` with zero direct Tailwind dependency.
- **Full-Width Stretch in Multi-Tab Mode Guarantee**:
  - Enforced `width: 100%; max-width: 100%; box-sizing: border-box;` on container `.precision-dieuchuyen` and `.component_element &`.
  - Configured flex column full height down to `.precision-dieuchuyen__gridContainer`, `.precision-dieuchuyen__gridBody`, `.agtable`, `.ag-theme-quartz`, and `.ag-root-wrapper` (`min-height: 200px`, `height: 100% !important`).
  - No horizontal compression or wasted margins in both Single Tab and Multi-Tab modes.
- **AGTable Standardization**:
  - Completely eliminated the legacy green `.toolbar` of AGTable (`.agtable { .toolbar { display: none !important; } }`).
  - Relocated compact 26px action buttons `EX1 (Đang lọc)`, `EX2 (Tất cả)`, and `PIVOT` directly to the table's quick filter toolbar (`gridToolbar`).
- **Subcomponents & Features Implemented**:
  1. *Sub-Header Banner (`PrecisionDieuChuyenHeader.tsx`)*:
     - Title `01. NHÂN SỰ & HÀNH CHÍNH > NS2 - ĐIỀU CHUYỂN TEAM & CHI VIỆN SẢN XUẤT`.
     - Live sync pills: `SOCKET REALTIME SYNC` and `MES & HRM SYNC ACTIVE`.
     - Action buttons: "Xuất Excel (EX1)", "Hoàn tác", "Lưu phân bổ ca".
  2. *Operational Toolbar (`PrecisionDieuChuyenToolbar.tsx`)*:
     - Factory Selector (Nhà máy 1, Nhà máy 2, Tất cả).
     - Team / Shift Selector (`WORK_SHIFT_CODE`: 5: Tất cả, 0: TEAM 1 + HC, 1: TEAM 2 + HC, 2: TEAM 1, 3: TEAM 2, 4: HC).
     - Attendance Date indicator (Hôm nay, DD/MM/YYYY).
     - Fast data reload button from system API.
  3. *Real-time 4 KPI Cards (`PrecisionDieuChuyenKpi.tsx`)*:
     - Card 1 (Biên chế tổ): Total personnel with 100% present status and blue `groups` icon.
     - Card 2 (Đang chi viện / điều động): Personnel assigned with special shift/transfer and amber `swap_horiz` icon.
     - Card 3 (Quân số bám line): Personnel staying at original team/plant and emerald `verified_user` icon.
     - Card 4 (Tiến độ phân công vị trí): Count and percentage of workers assigned with job positions and indigo `assignment_turned_in` icon.
  4. *High-Density AG-Grid Interactive Action Cells (`PrecisionDieuChuyenCells.tsx`)*:
     - `CodeCellRenderer`: Blue mono badge chip (`EMPL_NO`) + ERP ID subtitle (`CMS_ID`).
     - `NameAvatarCellRenderer`: 28x28px avatar with status dot, bold full name, and job/subdept subtitle.
     - `TeamActionCell`: Interactive micro-buttons to shift between Hành chính, TEAM 1, TEAM 2.
     - `ShiftActionCell`: Micro-buttons to assign Ca HC, Ca ngày, Ca đêm, or active shift chip with instant Reset.
     - `FactoryActionCell`: Micro-buttons to switch between Nhà máy 1 and Nhà máy 2.
     - `PositionSelectCell`: Compact 24px select dropdown mapping `workpositionload` with SweetAlert2 confirmation.
  5. *Multidimensional Pivot Modal (`PrecisionDieuChuyenPivotModal.tsx`)*:
     - Interactive summary matrix by Team, Work Shift (HC, Ngày, Đêm), and Factory distribution.
- **Table Column Optimization (User Feedback)**:
  - Added dedicated `NS_ID` (`CMS_ID`) column with JetBrains Mono badge renderer (`NsIdCellRenderer`).
  - Removed redundant `APPLY_DATE` (Ngày áp dụng) column, maximizing viewable space for operational transfer columns.
- **Validation**:
  - Vite dev server returned HTTP 200 for all 7 new and updated files (`DieuChuyenTeamCMS.tsx`, `PrecisionDieuChuyenTeam.scss`, `PrecisionDieuChuyenHeader.tsx`, `PrecisionDieuChuyenToolbar.tsx`, `PrecisionDieuChuyenKpi.tsx`, `PrecisionDieuChuyenCells.tsx`, `PrecisionDieuChuyenPivotModal.tsx`).

## Update - 2026-09-09 (Create Automated Stitch UI Refactor Skill)

### Completed
- **Established Stitch UI Refactoring Skill (`refactor_ui_after_stitch`)**:
  - Authored comprehensive workflow skill at `.agents/skills/refactor_ui_after_stitch.md` and `.agents/skills/refactor_ui_after_stitch/SKILL.md`.
  - Enshrined the 5 non-negotiable rules:
    1. 100% Logic preservation with mandatory `[ComponentName].backup.tsx` creation before any edit.
    2. Multi-tab mode guarantee (`width: 100%` edge-to-edge, full-height viewport anchoring without vertical collapse).
    3. AGTable standardization: eliminate default green toolbar (`display: none !important`), move `EX1`, `EX2`, and `PIVOT` up to the quick filter toolbar (`gridToolbar`).
    4. Dedicated SCSS per module (zero direct Tailwind dependency).
    5. Strict modular architecture (no monolithic files > 500 lines).
  - Outlined the end-to-end 5-step automation engine and 10-point checklist for subsequent component modernization requests.

## Update - 2026-09-09 (Remove Status Footer Bar from DiemDanhNhomCMS)

### Completed
- **Removed Status Footer Bar (`PrecisionDiemDanhFooter`)**:
  - Removed `<PrecisionDiemDanhFooter totalCount={diemdanhnhomtable.length} />` and its corresponding import from `src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.tsx`.
  - Maximized vertical screen real estate for the AGTable grid, allowing data rows to expand seamlessly to the bottom edge.
- **Validation**:
  - Node HTTP check returned `HTTP 200` for `DiemDanhNhomCMS.tsx`.

## Update - 2026-09-09 (Hide AGTable Toolbar & Move EX1, EX2, PIVOT to Quick Filter Bar)

### Completed
- **Eliminated AGTable Green Default Toolbar**:
  - Identified root cause: `DiemDanhNhomCMS.tsx` passed `toolbar={<></>}` to `<AGTable />`. Because `<></> !== undefined`, AGTable automatically rendered the legacy green `.toolbar` with default IconButton controls (`EX1`, `EX2`, `PIVOT`).
  - Removed `toolbar` prop completely from `<AGTable />`.
  - Added strict global CSS rule in `PrecisionDiemDanh.scss`: `.agtable { .toolbar { display: none !important; } }` ensuring the green toolbar never displays.
- **Relocated Data Export & Pivot Actions to Quick Filter Bar (`precision-diemdanh__gridToolbar`)**:
  - Structured `.precision-diemdanh__gridToolbarLeft` housing the 26px `searchBox` alongside `.precision-diemdanh__gridActions`.
  - Created 3 compact, high-density buttons (26px height, font 11px bold, micro shadows, smooth hover transitions):
    1. `EX1 (Đang lọc)`: Exports currently filtered/displayed rows (`filteredTableData`) to `NS1_DiemDanh_DangLoc_YYYYMMDD_HHmmss.xlsx`.
    2. `EX2 (Tất cả)`: Exports all rows in current shift (`diemdanhnhomtable`) to `NS1_DiemDanh_TatCa_YYYYMMDD_HHmmss.xlsx`.
    3. `PIVOT`: Opens modern multidimensional analysis modal (`PrecisionPivotModal`).
- **Streamlined Operation Toolbar (`PrecisionDiemDanhToolbar.tsx`)**:
  - Made `onExportExcel` and `onOpenPivot` optional props.
  - Kept top toolbar focused strictly on Factory, Shift, Date, Bulk Attendance ("Điểm danh nhanh tất cả"), and Refresh.
- **Validation**:
  - Node HTTP check returned `HTTP 200` for both `DiemDanhNhomCMS.tsx` and `PrecisionDiemDanh.scss`.

## Update - 2026-09-09 (Precision DiemDanhNhom: Stitch Redesign, Full-Width Multi-Tab, Realtime KPIs & Cells)

### Completed
- **Full Preservation of Legacy Implementation with Backup**:
  - Created `src/pages/nhansu/DiemDanhNhom/DiemDanhNhomCMS.backup.tsx` preserving 100% of the legacy 200-line implementation.
- **Stitch High-Density Enterprise Redesign (`DiemDanhNhomCMS.tsx`)**:
  - Replaced legacy neon gradient background (`linear-gradient(0deg, #afd3d1, #a4ec51)` / `#f18de1`) with clean, neutral Stitch design system tokens (slate `#f8fafc`, pure white cards `#ffffff`, subtle borders `#e2e8f0`, micro shadows `0 1px 2px rgba(15, 23, 42, 0.04)`).
  - Built dedicated SCSS architecture `src/pages/nhansu/DiemDanhNhom/PrecisionDiemDanh/PrecisionDiemDanh.scss` with zero Tailwind dependency, guaranteeing instant styling injection.
- **Full-Width Stretch in Multi-Tab Mode Guarantee**:
  - Enforced `width: 100%; max-width: 100%; box-sizing: border-box;` on container `.precision-diemdanh` and `.component_element &`.
  - Configured flex column full height down to `.precision-diemdanh__gridContainer`, `.precision-diemdanh__gridBody`, `.agtable`, `.ag-theme-quartz`, and `.ag-root-wrapper` (`min-height: 200px`, `height: 100% !important`).
  - No horizontal compression or wasted margins in both Single Tab and Multi-Tab modes.
- **Subcomponents & Features Implemented**:
  1. *Sub-Header Title Bar (`PrecisionDiemDanhHeader.tsx`)*:
     - Module title `01. NHÂN SỰ & HÀNH CHÍNH • NS1 - Điểm danh quân số ca làm việc` with `how_to_reg` icon box.
     - Live sync pill: `Đồng bộ dữ liệu chấm công: Bình thường` with pulsating green status dot.
  2. *Operation Toolbar (`PrecisionDiemDanhToolbar.tsx`)*:
     - Factory Selector (Nhà máy 1, Nhà máy 2, Tất cả).
     - Work Shift Selector (`WORK_SHIFT_CODE`: 5: Tất cả, 0: TEAM 1 + HC, 1: TEAM 2 + HC, 2: TEAM 1, 3: TEAM 2, 4: HC).
     - Attendance Date indicator (Hôm nay, DD/MM/YYYY).
     - Fast action buttons:
       - "Điểm danh nhanh tất cả": One-click bulk attendance with SweetAlert2 confirmation, automatically marking all unmarked workers present and calling `setdiemdanhnhom`.
       - "Xuất Excel (EX1)": Full `.xlsx` export using SheetJS `XLSX`.
       - "Pivot phân tích": Launches interactive multidimensional summary modal.
       - "Làm mới": Real-time data reload from API.
  3. *Real-time 3 KPI Cards (`PrecisionDiemDanhKpi.tsx`)*:
     - Card 1 (Biên chế tổ): Total personnel with live unmarked counter and blue `groups` icon.
     - Card 2 (Đi làm thực tế): Real-time present count, % rate, animated progress bar, emerald `check_circle` icon.
     - Card 3 (Vắng mặt / Nghỉ phép): Absent count, % rate, detailed breakdown (nghỉ ốm BHXH, việc riêng có phép), rose `person_off` icon.
  4. *High-Density AG-Grid Cells*:
     - `EmpCodeCellRenderer`: Blue mono badge chip (`DTH1204`) + ERP ID subtitle (`CMS376`).
     - `FullNameCellRenderer`: Bold typography with dynamic color-coding (green = present, red = absent) + team/subdept subtitle.
     - `AvatarCellRenderer`: 32x32px square rounded portrait with status indicator dot and fallback initials.
     - `PrecisionAttendanceCell.tsx`: Interactive micro-buttons (Làm Ngày, Làm Đêm, Nghỉ, 50%) and compact status badges with Reset.
     - `PrecisionOvertimeCell.tsx`: Interactive OT buttons (KTC, 0500-0800, 1700-2000...) and amber OT badge with Reset.
     - `PhoneCellRenderer`: Monospace telephone with call icon.
     - `JobCellRenderer`: Role badge (Leader chip blue, Worker chip gray) + factory location.
     - `FingerprintCellRenderer`: Fingerprint scanner chip or "Chưa quẹt".
  5. *Realtime Status Footer (`PrecisionDiemDanhFooter.tsx`)*:
     - Live headcount counter, `Socket Realtime Active` with pulsating indicator, fingerprint gateway status (100% OK), SYS_TIME ticking clock, and `CMS_ERP_V2700`.
  6. *Multidimensional Pivot Modal (`PrecisionPivotModal.tsx`)*:
     - Interactive summary tables by Work Shift (Team 1, Team 2, HC) and by Job Position (Leader, Worker...), calculating total, present, absent, and attendance percentage chips.
- **Validation**:
  - Vite dev server returned HTTP 200 for all new and updated files (`PrecisionDiemDanh.scss`, `PrecisionAttendanceCell.tsx`, `PrecisionOvertimeCell.tsx`, `PrecisionDiemDanhHeader.tsx`, `PrecisionDiemDanhToolbar.tsx`, `PrecisionDiemDanhKpi.tsx`, `PrecisionPivotModal.tsx`, `PrecisionDiemDanhFooter.tsx`, `DiemDanhNhomCMS.tsx`, `DiemDanhNhomCMS.backup.tsx`).

## Update - 2026-09-09 (Fix: Menu Auto-Focus on Open & Restored Navbar Omnibar Quick Search Dropdown Filter)

### Completed
- **Fixed Menu Cursor Auto-Focus on Open**:
  - **Identified Root Causes**:
    1. In `src/components/Navbar/PrecisionHeader/PrecisionHeader.tsx`, `autoFocusSearch={false}` was hardcoded when rendering `<NavMenuNew />`, completely disabling cursor auto-focus upon opening the menu via the hamburger button or `Ctrl + Space`.
    2. In `src/components/NavMenu/NavMenuNew.tsx`, `searchInputRef.current?.focus()` fired immediately in a synchronous `useEffect`, which could be swallowed by browser focus transitions on the triggered button.
  - **Comprehensive Fix**:
    1. Updated `NavMenuNew.tsx`: added a 50ms `setTimeout` and `.select()` in `autoFocusSearch` effect, ensuring the input receives focus and selects existing text reliably on mount.
    2. Updated `PrecisionHeader.tsx`: added `effectiveAutoFocusSearch` which evaluates to `true` whenever the menu is opened via the Menu button or `Ctrl + Space`, and `false` when opened via Omnibar search focus.
- **Restored Navbar Omnibar Quick Search Dropdown & Real-Time Filtering**:
  - **Identified Root Causes**:
    1. *Double Dispatch Bug in `onFocus`*: In `PrecisionHeader.tsx`, `onFocus` called `propOnSearchFocus?.()` (which dispatched `toggleSidebar("2")` in `Home.tsx`), and then immediately checked `if (!isMenuOpen) dispatch(toggleSidebar("2"))`. Because Redux state changes are batched, `isMenuOpen` was still false in the current render pass, causing a double-toggle (`false -> true -> false`) that instantly closed the menu before it could open.
    2. *Missing Search Alignment & Bounds Props*: `PrecisionHeaderProps` was missing `menuAutoFocusSearch`, `menuAlignedToSearch`, and `onMenuSearchFocus`. The menu bounds (`left` and `width` relative to the header) were never measured, and the CSS variables `--precision-menu-left` and `--precision-menu-width` along with `.precision-header__menuPanel--search` were never applied.
    3. *Missing Dropdown Click Trigger*: Clicking an already focused search input when the menu had been closed did not re-open the dropdown.
    4. *Blur Premature Reset*: `handleNavSearchBlur` in `Home.tsx` was resetting `menuOpenSource` to null on blur, breaking submenu clicks.
  - **Comprehensive Fix**:
    1. In `PrecisionHeader.tsx`:
       - Added props `onMenuSearchFocus`, `menuAutoFocusSearch`, `menuAlignedToSearch` to `PrecisionHeaderProps`.
       - Added `searchMenuBounds` state (`left`, `width`) and `updateSearchMenuBounds` callback measuring `searchAnchorRef` relative to `headerRef`.
       - Implemented `useLayoutEffect` to dynamically recalculate menu alignment bounds on resize, open, and query changes.
       - Eliminated double dispatch: `onFocus` now only calls `propOnSearchFocus?.()` if provided, and only dispatches `toggleSidebar("2")` if the prop is omitted.
       - Added `onClick` handler on search input to re-open the dropdown if closed.
       - Rendered `.precision-header__menuPanel--search` with `--precision-menu-left` and `--precision-menu-width` inline styles.
    2. In `Home.tsx`:
       - Passed `onMenuSearchFocus={handleMenuSearchFocus}`, `menuAutoFocusSearch={menuOpenSource !== "navbar"}`, and `menuAlignedToSearch={menuOpenSource === "navbar"}` to `<PrecisionHeader />`.
       - Updated `handleNavSearchBlur` to only reset `menuOpenSource` when `sidebarStatus` is false, preventing click events on dropdown items from being lost.
    3. In `NavBarNew.tsx`:
       - Forwarded `onMenuSearchFocus`, `menuAutoFocusSearch`, and `menuAlignedToSearch` to `PrecisionHeader` for complete backward compatibility.
- **Validation**:
  - Vite compilation check returned HTTP 200 for all edited modules (`PrecisionHeader.tsx`, `NavMenuNew.tsx`, `Home.tsx`, `NavBarNew.tsx`).

## Update - 2026-09-09 (Fix: AG-Grid PO Table Collapsed Height = 0 & Parent Viewport Anchoring)

### Completed
- **Fixed Root Causes of Collapsed AGTable in Multi-Tab Mode**:
  - **Identified Root Cause 1 (Parent Viewport Unbounded)**: In `src/pages/home/home.scss`, `.component_element` had `position: absolute; top: 34px; left: 0; right: 0;` without `bottom: 0;` or a definite height. As an absolute element, its height resolved to auto, breaking percentage calculations for all children.
  - **Identified Root Cause 2 (`po-grid-body` Block Container)**: In `src/pages/kinhdoanh/pomanager/PrecisionPoManager/components/PrecisionPoTable.tsx`, AGTable was wrapped in `<div className="po-grid-body">`. In `PrecisionPoManager.scss`, this container had `flex: 1; min-height: 0;` but lacked `display: flex; flex-direction: column;` and `height: 100%`. The child `.agtable` with `height: 100%` collapsed to `height: auto`.
  - **Identified Root Cause 3 (AG-Grid Quartz Viewport 0px)**: Inside `AGTable.tsx`, `<AgGridReact>` runs inside `.ag-theme-quartz`. Because parent height was auto, AgGrid's internal ResizeObserver measured `clientHeight = 0px`, rendering 0 rows and 0 header, pulling `.bottombar` ("Total: 0 rows") directly underneath the toolbar and leaving an empty space below.
- **Comprehensive Solution**:
  1. **`src/pages/home/home.scss`**: Updated `.component_element` with `bottom: 0; height: calc(100vh - 82px); max-height: calc(100vh - 82px); overflow: hidden;` and configured `> *` with `height: 100%; max-height: 100%; flex: 1; min-height: 0;`.
  2. **`src/pages/kinhdoanh/pomanager/PrecisionPoManager/PrecisionPoManager.scss`**:
     - Configured `.component_element &` with `height: 100%; max-height: 100%; flex: 1; min-height: 0;`.
     - Set `.po-main-workspace` with `height: calc(100% - 95px); max-height: calc(100% - 95px); flex: 1; min-height: 0;`.
     - Set `.po-table-container` with `height: 100%; max-height: 100%; display: flex; flex-direction: column; overflow: hidden;`.
     - Configured `.po-grid-body` with `display: flex; flex-direction: column; flex: 1 1 auto; min-height: 250px; height: 100%; width: 100%; overflow: hidden;`.
     - Deeply enforced flex column and full height down to `.agtable`, `.ag-theme-quartz` (`min-height: 200px`), and `.ag-root-wrapper` (`height: 100% !important; min-height: 200px;`).
     - Ensured `.bottombar` and `.po-grid-footer` have `flex-shrink: 0;`.
  3. **`src/components/DataTable/AGTable.scss`**: Added `min-height: 0; display: flex; flex-direction: column; height: 100%; width: 100%;` to `.ag-theme-quartz`.
  4. **`PrecisionPoTable.tsx`**: Added explicit SCSS import `import "../PrecisionPoManager.scss";`.
- **Validation**:
  - Vite HMR check returned HTTP 200 for all updated files (`home.scss`, `PrecisionPoManager.scss`, `AGTable.scss`, `PrecisionPoTable.tsx`).
  - AG-Grid now reliably expands 100% vertically between the toolbar and footer, with headers and rows fully visible and anchored to the viewport bottom.

## Update - 2026-09-09 (Production Rollout: Precision Header, PO Manager, Account Info & Stitch Multi-Tab Bar Overhaul)

### Completed
- **Replaced PO Manager in Production with Full Backup**:
  - Created `src/pages/kinhdoanh/pomanager/PoManager.backup.tsx` preserving 100% of the legacy 2-tab implementation (`PoManagerManageTab` & `PoManagerAddTab`).
  - Updated `src/pages/kinhdoanh/pomanager/PoManager.tsx` to render `PrecisionPoManager` directly.
  - Automatically propagated new modern PO Manager to `/kinhdoanh/pomanager`, `KD1` in `CMS_MENU`, `PVN_MENU`, `NHATHAN_MENU`, and `lazyPages.ts`.
  - Added `.component_element & { height: calc(100vh - 82px); max-height: calc(100vh - 82px); }` in `PrecisionPoManager.scss` ensuring sticky bottom viewport expansion inside Multi-tab mode without nested scrolling.
- **Replaced User Account Info in Production with Full Backup**:
  - Created `src/components/Navbar/AccountInfo/AccountInfo.backup.tsx` preserving 100% of the legacy 907-line implementation.
  - Updated `src/components/Navbar/AccountInfo/AccountInfo.tsx` to render `PrecisionAccountInfo` and re-export `LinearProgressWithLabel` for backward compatibility with `PLAN_STATUS_COMPONENTS.tsx` and `BulletinBoard.tsx`.
  - Automatically propagated new modern Account Info to `/accountinfo`, `NS0` in all company menus, and default empty-tab workspace.
  - Updated `PrecisionHeader.tsx` user profile menu item to navigate directly to official `/accountinfo`.
- **Replaced Headerbar in Production with Full Backup**:
  - Created `src/components/Navbar/NavBarNew.backup.tsx` preserving 100% of legacy navbar code.
  - Updated `src/components/Navbar/NavBarNew.tsx` to safely proxy all props to `PrecisionHeader`.
  - Updated `src/pages/home/Home.tsx` to render `PrecisionHeader` directly with high-precision Omnibar (`Ctrl + K`), ERP department overlay panel (`Ctrl + Space`), 35+ theme gradients, VN/EN/KR switcher, realtime notification popover, and profile pill.
- **Modern High-Density Multi-Tab Bar Overhaul (`Home.tsx` & `home.scss`)**:
  - Replaced legacy neon gradient background (`style={{ backgroundImage: ... }}`) with a clean neutral Stitch aesthetic: height 34px, background `#f8fafc` (slate-50), subtle border `#e2e8f0`, micro shadow `0 1px 2px rgba(15, 23, 42, 0.03)`.
  - Inactive tabs: translucent slate `#f1f5f9`, slate-500 typography, subtle hover `#e2e8f0`.
  - Active tab: pure white `#ffffff`, slate-900 bold font, border `#cbd5e1`, card shadow, and vibrant blue indicator dot (`#2563eb`).
  - Added JetBrains Mono numeric index badge (`1`, `2`, `3`) on each tab.
  - Added micro close button with hover effect (`#fee2e2` / `#ef4444`).
  - Added right-hand toolbar on tab bar: live tab counter (`X tabs`) and quick "Đóng tất cả" (Close all tabs) action button.
  - Aligned `.component_element` `top: 34px` perfectly with the new tab bar height.
- **Fixed Multi-Tab Component Full-Width Stretch**:
  - Identified root cause: `.component_element` in `home.scss` had `display: flex; justify-content: center;`, which caused child components without explicit `width: 100%` to shrink to intrinsic content width and center horizontally with ~250px wasted space on both sides.
  - Comprehensive fix:
    - Updated `.component_element` in `home.scss`: changed to `display: flex; flex-direction: column; align-items: stretch;` and added `.component_element > * { width: 100%; max-width: 100%; box-sizing: border-box; }`.
    - Added `width: 100%; max-width: 100%; flex: 1;` directly to `.precision-po-manager` and `.component_element &` in `PrecisionPoManager.scss`.
    - All workspace components in Multi-tab mode now span 100% full width edge-to-edge as expected.
- **Validation**:
  - Vite compilation check passed with HTTP 200 on all modified modules (`Home.tsx`, `PoManager.tsx`, `AccountInfo.tsx`, `NavBarNew.tsx`, `home.scss`, `PrecisionPoManager.scss`).


### Completed
- **Eliminated Secondary Header Banner**:
  - Removed `<PrecisionPoHeader ... />` completely from `PrecisionPoManager.tsx` as requested ("KD1 • Quản Lý Đơn Hàng (PO Manager) LIVE ERP SYNC...").
  - The page now begins immediately with the 6 real-time KPI Micro-Cards, maximizing vertical screen real estate for high-productivity enterprise workflows.
- **Dedicated SCSS Architecture for Enterprise Modals (`PrecisionPoModals.scss`)**:
  - **Root Cause Identified**: The project does NOT enable Tailwind CSS (`src/index.css` comments out `@import "tailwindcss"`). Previously, modal elements used Tailwind utility classes, resulting in unstyled browser defaults (transparent backdrop without card container, raw unpadded HTML inputs, unstyled buttons).
  - **Comprehensive SCSS Implementation**: Created `src/pages/kinhdoanh/pomanager/PrecisionPoManager/PrecisionPoModals.scss` (729 lines) and imported it into `PrecisionPoManager.scss` (`@import "./PrecisionPoModals.scss";`), `PrecisionPoAddModal.tsx`, and `PrecisionPoInvoiceModal.tsx`.
  - **Full Styling for All 4 Stitch Modals**:
    1. *Modal 1: Thêm Đơn Hàng Thủ Công (Single PO)*: White card (`#ffffff`, border-radius 12px, subtle shadow), Blue header with icon box, interactive 2-column grid (`form-grid-2`), high-density inputs with focus states, `input-badge-wrap` with EA unit badge, `input-prefix-wrap` with `$`, dynamic "Tổng Thành Tiền Dự Kiến (Est. Total)" callout card with live USD & VND conversion, and action buttons (`btn-white`, `btn-ghost`, `btn-submit-blue`).
    2. *Modal 2: Nhập File Excel Hàng Loạt (Bulk Upload)*: Wide container (`card-wide`), Emerald accent header & subtab, clean file picker bar, check & upload buttons, AGTable preview grid, and status summary badge strip (Tổng số dòng, Hợp lệ, Lỗi).
    3. *Modal 3: Chỉnh Sửa Đơn Hàng PO (Edit Mode)*: Amber accent header with `#PO-xxxxx` chip badge, readonly customer & G-Code inputs, editable PO Date, Delivery Date, PO No, Qty, Unit Price ($), BEP ($), and Remark textarea, live recalculation card, audit footnote card (`Sửa PO ID: xxxxx, Live ERP`), and blue submit button (`Cập Nhật PO (F9)`).
    4. *Modal 4: Tạo Invoice Giao Hàng Mới (New INV)*: Teal accent theme with `INV-YYYYMMDD-01` badge, PO Balance live counter pill (`Tồn PO: xx,xxx EA`), Shipping Notice info banner, and Emerald submit button (`Thêm Invoice (F8)`).
- **Fixed Customer & Code Autocomplete in New PO Modal**:
  - **Identified Root Causes**:
    1. *Popper Z-Index Conflict*: MUI `Autocomplete` popper renders by default into `document.body` with `z-index: 1300`. Because `.precision-modal-backdrop` uses `z-index: 10000`, the options dropdown was rendering completely behind the modal backdrop, invisible to the user.
    2. *Focus Trigger*: Autocomplete lacked `openOnFocus`, meaning clicking inside the input box didn't open the popup unless the user specifically targeted the small dropdown arrow.
    3. *Data Availability*: Network latency or unauthenticated preview session could leave `customerList` and `codeList` empty when opening the modal.
  - **Comprehensive Fix**:
    - Added global `.MuiAutocomplete-popper { z-index: 12000 !important; }` in `PrecisionPoModals.scss` with clean styling, subtle border, shadow, and scrollable listbox.
    - Configured `slotProps={{ popper: { sx: { zIndex: 12000 } } }}`, `openOnFocus={true}`, `autoHighlight={true}`, `clearOnEscape={true}`, and safe `getOptionLabel` / `isOptionEqualToValue` in `PrecisionPoAddModal.tsx`.
    - Integrated multi-field search `filterCustomerOptions` and `filterCodeOptions` (allowing search by code, short name, and full company name).
    - Added smart enterprise fallbacks (`FALLBACK_CUSTOMERS` & `FALLBACK_CODES`) ensuring instant list display even during preview/offline sessions, automatically overridden by real ERP database records.
- **Full-Height Sticky Bottom Viewport Stretch (Bảng PO & Bộ Lọc Dính Đáy Màn Hình)**:
  - **Identified Root Causes**:
    1. `.po-grid-body` was hardcoded to a static `height: 560px`, leaving a large empty gap (~100-150px) at the bottom on modern displays (1080p, 2K).
    2. `.po-main-workspace` used `align-items: flex-start`, preventing both `.po-filter-panel` and `.po-table-container` from expanding to fill 100% of the available vertical space.
    3. `PrecisionPreviewPage.tsx` used `minHeight: "100vh"` with outer scroll on viewport.
  - **Comprehensive Fix**:
    - **`PrecisionPreviewPage.tsx`**: Updated container to `height: "100vh"`, `maxHeight: "100vh"`, `overflow: "hidden"`, passing `flex: 1, minHeight: 0, overflow: "hidden"` to `PrecisionPoManager`.
    - **`PrecisionPoManager.scss`**: Configured `.precision-po-manager` with `height: calc(100vh - 48px); max-height: calc(100vh - 48px); box-sizing: border-box; padding: 10px 14px 8px 14px; overflow: hidden;`.
    - **`po-main-workspace`**: Set `align-items: stretch; flex: 1; min-height: 0; overflow: hidden;` so both left (filter panel) and right (table container) columns stretch synchronously down to the viewport bottom.
    - **Filter Panel Bottom Stretch & Pinned Actions**: Restructured `PrecisionPoFilterPanel.tsx` with `.filter-scrollable-content` (`flex: 1; min-height: 0; overflow-y: auto;`) and `.filter-actions` (`flex-shrink: 0;`) pinned neatly at the bottom edge.
    - **AGTable Full-Height Expansion**: Removed `height: 560px` in `.po-grid-body`, replaced with `flex: 1; min-height: 0; width: 100%;`. AG-Grid automatically expands to fill 100% vertical viewport space, and the footer sits cleanly at the bottom edge with 0 wasted pixels.
- **Fixed Filter Panel Lost Style Issue (`PrecisionPoFilterPanel.tsx`)**:
  - **Identified Root Causes**:
    1. During previous scrollable layout refactoring in `PrecisionPoFilterPanel.tsx`, the closing tag `</div>` for `.filter-scrollable-content` was accidentally omitted before `.filter-actions`.
    2. This caused a JSX compilation error (`JSX element 'div' has no corresponding closing tag`), blocking Vite HMR and causing the component to fail parsing/rendering with proper styles.
  - **Comprehensive Fix**:
    - Fixed tag hierarchy in `PrecisionPoFilterPanel.tsx`: added the closing `</div>` for `.filter-scrollable-content` directly before `.filter-actions`.
    - Added direct import of `../PrecisionPoManager.scss` into `PrecisionPoFilterPanel.tsx` ensuring independent, bulletproof CSS bundle injection.
    - Verified TypeScript diagnostics (0 parse errors) and Vite HTTP 200 response for both component and stylesheet.

## Update - 2026-09-08 (Precision Header & Precision AccountInfo Stitch Redesign)

### Completed
- **Created New Master Bar Header (`PrecisionHeader.tsx` & `PrecisionHeader.scss`)**:
  - Implemented exact Stitch design system from `DESIGN.md`: 48px height, `backdrop-filter: blur(12px)`, subtle slate border (`#e2e8f0`).
  - Integrated brand identity with CMS VINA typography, `v2700` chip, server telemetry pill with live pulsating green status dot.
  - Built high-precision Omnibar Search with `Ctrl + K` / `Ctrl + Space` auto-focus, clear button, and search triggers.
  - Implemented theme palette picker, language switcher pill (`VN / EN / KR`), realtime notification center with badge, and user profile pill with avatar and dropdown menu.
- **Full Logic Synchronization for Precision Header (`PrecisionHeader.tsx`)**:
  - Integrated `NavMenuNew` overlay panel directly inside `PrecisionHeader`: clicking the hamburger menu or focusing/typing in the Omnibar search box now automatically opens the full ERP department flyout menu with real-time query filtering.
  - Implemented `openFirstSearchResult()` on Enter key press: matches query with `navMenus` and instantly opens the tab (in Multi-Tab mode) or navigates to the route (in Single-Tab mode).
  - Expanded Theme Switcher to include the full `COMPANY_THEME_OPTIONS` spectrum (all 35+ gradient themes from `CMS_THEME_OPTIONS`, `PVN_THEME_OPTIONS`, `NHATHAN_THEME_OPTIONS`) with direct Redux `switchTheme` and localStorage persistence.
  - Added click-outside and `Escape` listeners to dismiss the menu overlay automatically.
  - Added full keyboard shortcuts (`Ctrl + K` to focus search, `Ctrl + Space` to toggle menu).
- **Full Logic Synchronization for Precision AccountInfo (`PrecisionAccountInfo.tsx`)**:
  - Connected `getsentence(..., lang)` across all subcomponents: titles, KPI labels, personal metadata keys dynamically update when switching between Vietnamese, English, and Korean.
  - Aligned exact KPI progress calculations with `AccountInfo.tsx`: `workday / days`, `overtimeday / workday`, `countxacnhan / workday`, etc.
  - Implemented Dual Chart Views in `PrecisionAttendanceTimeline.tsx`: interactive toggle between the Stitch High-Density Vector Bar Chart and the Recharts Line Chart (with `hoursPast`, `hoursFuture`, and red Sunday indicators on X-axis).
  - Added "Xem bản chụp hồ sơ gốc" document archive collapsible viewer in `PrecisionDossierRecord.tsx`.
  - Maintained 5-second live polling for `checkMYCHAMCONG`, avatar upload with `uploadQuery`, password change via `changepassword`, and full admin tools for `NHU1903`.

## Update - 2026-09-08 (Web ERP UI System Specification for Google Stitch)

### Completed
- **Created Comprehensive Web ERP UI Specification Document (`SYSTEM_UI_SPECIFICATION_FOR_STITCH.md`)**:
  - Outlined overall system profile, tech stack (React 18, MUI v5, AG-Grid Quartz, DevExtreme Pivot, Recharts), target users (management vs shopfloor workers).
  - Detailed the master layout architecture: Top Navbar (`NavBarNew`), Navigation Menu (`NavMenuNew` - overlay vs sidebar), Multi-tab system (`CustomTabs`), and Notification panel.
  - Formulated the 5 core page layout archetypes: Split Master (Search panel + AG-Grid), Dual Dashboard & Reports (KPIs + Pie charts + 3:2 split tables), Workshop Visual Card Grid (VOC History with scan buffer & 300px defect photos), Forms/Modals (`CustomDialog`), and Personal/Attendance Hub (`AccountInfo`).
  - Summarized all 10 business departments & modules (Kinh Doanh, QLSX, SX, QC, R&D, Mua Hàng, Kho, Nhân Sự, Bảng Tin & AI Tools).
  - Highlighted current aesthetic pain points (vintage gradients, heavy shadows, lack of unified design tokens, dark mode absence) and provided structured prompt directives for Google Stitch redesign (Modern High-Density Enterprise SaaS aesthetic, neutral slate canvas, compact 28-32px rows, micro-spacing).

## Update - 2026-07-24 (Auto-dismiss Swal Alert in VOC History Scanner)

### Completed
- **Auto-dismiss Swal Alert (3s) for Scanner in VOC History**:
  - Updated `commitSearch` in `src/pages/qc/oqc/VOC_HISTORY.tsx`: added `timer: 3000` and `timerProgressBar: true` to `Swal.fire` when `G_NAME_KD` is not found for scanned `PROCESS_LOT_NO`, when API returns an error, or when scan query returns no matching records in machine scan mode.
  - Allows scanner users without mouse/keyboard to have alerts automatically close after 3 seconds without blocking subsequent scans.

## Update - 2026-07-23 (Dedicated Standalone Screen for IQC Workers)

### Completed
- **Dedicated Standalone Screen & Route Locking for IQC Workers**:
  - Created `IqcWorkerDtcPage` in `mobile_flutter/lib/features/qc/presentation/iqc_worker_dtc_page.dart`: a single standalone screen containing ONLY `DkDtcTab`, without left navigation menu (AppDrawer) and without tab bars.
  - Added a Logout button (`Icons.logout`) to the AppBar in `IqcWorkerDtcPage` for quick sign out.
  - Updated `mobile_flutter/lib/app/router.dart`: users with `subDeptName` containing `'IQC'` are directed strictly to `IqcWorkerDtcPage()` on `/home`, and any navigation attempt to other routes is automatically redirected back to `/home`. Non-IQC users continue to navigate to `HomePage`.
  - Registered listener `_onEmplCtrlChanged` on `_requestEmplCtrl` in `dk_dtc_tab.dart` so that whenever `REQUEST_EMPL_NO` is auto-filled or changed, `_checkEmplName` runs automatically to fetch `WORK_POSITION_CODE` (`REQUEST_DEPT_CODE`) and employee name.
  - Integrated `insertIQC1table` command in `dk_dtc_tab.dart`: immediately after successful DTC registration for Nguyên Vật Liệu (`_checkNvl == true`), `_insertIncomingData(nextId)` is executed automatically using the newly created `DTC_ID` (`nextId`).
  - Added strict validations on client & server (`qcService.js`) for `DTC_ID`, `M_CODE`, `G_CODE`, and `REQUEST_DEPT_CODE`.

## Update - 2026-07-23 (Scanner PROCESS_LOT_NO to G_NAME_KD Lookup in OQC VOC History)

### Completed
- **Scanner PROCESS_LOT_NO -> G_NAME_KD Lookup in VOC History**:
  - Updated `f_checkG_CODE_From_PROCESS_LOT_NO` helper in `src/pages/qc/utils/qcUtils.tsx` to read `G_NAME_KD` from API result.
  - Updated `commitSearch` in `src/pages/qc/oqc/VOC_HISTORY.tsx`: when "Dùng máy scan" is checked, the scanned `PROCESS_LOT_NO` queries `checkG_CODE_From_PROCESS_LOT_NO` to obtain `G_NAME_KD` and filter VOC history records.
  - Handled errors and alerts when `G_NAME_KD` is not found or no matching VOC records are found.

## Update - 2026-07-02 (Add and Search PART_CODE_OTHERS in OQC VOC History)

### Completed
- **Add and Search PART_CODE_OTHERS**:
  - Added `PART_CODE_OTHERS?: string;` to frontend `QTR_DATA` interface.
  - Implemented logic in `VOC_HISTORY.tsx` to search by `PART_CODE_OTHERS` (supporting comma-separated values) with error-handling fallback to old search behavior.

## Update - 2026-06-29 (IQC Reliability Test Items Toggle & Rendering Bugfix)

### Completed
- **IQC Reliability Test Items Toggle & Rendering Bugfix**:
  - Added six new Y/N test columns (`KEO_KEO`, `BOC_TACH`, `DIEN_TRO`, `TINH_DIEN`, `FT_IR`, `TACK`) as optional fields in `IQC_INCOMMING_DATA` interface.
  - Implemented TACK column under "Độ tin cậy" section of the main report table in `BNK_COMPONENT.tsx`, placed immediately after `FT-IR`.
  - Added double-click handlers on all six reliability test headers in `BNK_COMPONENT.tsx` to toggle their active/inactive status. Double clicking updates the database (`ZTB_MATERIAL_TB` table) and updates the frontend local and parent states dynamically.
  - Configured conditional formatting and visual cues (line-through and text graying-out) on headers and cells when reliability test items are disabled (`'N'`). Their Test Level and QTY values now display as `N/A`.
  - Fixed a `TypeError` crash in `BNK_COMPONENT.tsx` where mapping `dtc_data` attempted to call `.slice(0, -1)` on null/undefined `POINT_NAME` values. Added safety checks for `POINT_NAME` and specs comparison to prevent rendering failures when values are null.
  - Resolved `validateDOMNesting` console warning in `BNK_COMPONENT.tsx` by wrapping the `info-table` row elements inside a `<tbody>` tag.

## Update - 2026-06-24 (NCR Layout & IQC NCR_ID Enhancements)

### Completed
- **NCR Layout Refactoring**:
  - Replaced clickedrow ref with `selectedNCR` state to trigger re-renders dynamically.
  - Split right-hand panel of `NCR_MANAGER.tsx` to display defect image at the top (if available) and the `Holding - Failing Detail` table at the bottom. Clicking the defect image preview opens the image in a new tab.
- **IQC Incoming NCR_ID & NCR Details Integration**:
  - Altered `IQC1_TABLE` table on the database to add `NCR_ID` column.
  - Updated backend query in `qcService.js` (`loadIQC1table`) to LEFT JOIN `ZTB_IQC_NCRTB` and select the `DEFECT_IMAGE` and `COUNTERMEASURE` status fields.
  - Added backend handler `update_iqc_ncr_id` to update the `NCR_ID` of an incoming lot.
  - Updated frontend `INCOMMING.tsx` to display `NCR_ID`, `NCR_DEFECT_IMAGE`, and `NCR_COUNTERMEASURE` columns in both the admin and worker tables.
  - Added an input text box and "Update NCR_ID" button in the toolbar of incoming table with proper validation (exactly 1 row required, prompt confirmation by Swal).
  - Added a "Show All" checkbox to the search query panel in `INCOMMING.tsx`. When unchecked, the backend filters the list to only return records that are OK/PD, or NG records that have countermeasures uploaded (`COUNTERMEASURE` = 'Y').
- Resolved upload error (400 Bad Request) when adding equipment/calibration history in `CALIBRATION.tsx`. Updated backend `routes/fileUpload.js` to dynamically create `TEMP_UPLOAD_FOLDER` if it does not exist.
- Improved table layout in `CALIBRATION.tsx`:
  - Set `rowHeight={60}` for both equipment and calibration history tables.
  - Wrapped image renderers (`IMAGE_URL`, `STAMP_IMAGE_URL`) in anchor tags (`target="_blank"`) to allow opening full-resolution images in a new tab.
  - Styled images inside cells to fit properly (`height: 50px`, `object-fit: contain`) and vertically centered all cell contents (including action buttons).
  - Added status color-coding to rows in the main Equipment List table based on calibration due date (Overdue = Red, Near Due = Yellow, In-Time = Green, Broken = Gray) just like in the Calibration History table.
  - Added a status color legend and a "Load data" refresh button (with `AiOutlineReload` icon) to the Equipment List toolbar.
  - **Fixed Row Style Override Bug**: Fixed a CSS conflict where `background-color: rgba(241, 239, 198, 0) !important` in `AGTable.scss` was blocking row coloring. Removed `!important` from `.ag-row` in `AGTable.scss` and updated the default `getRowStyle` in `AGTable.tsx` to return `transparent` (instead of `#eaf5e1`) to prevent other tables from turning green.
  - **Fixed Calibration Status Logic**: Corrected the `daysDiff` threshold comparison math where Overdue (Red) is `daysDiff < -30` (exceeded next calibration date by more than 30 days), Near Due (Yellow) is `-30 <= daysDiff <= 0` (exceeded next calibration date by 0 to 30 days), and OK (Green) is `daysDiff > 0` (future calibration date).
- **Added NCR Countermeasure & Process Status features in `NCR_MANAGER.tsx`**:
  - Added `COUNTERMEASURE` and `COUNTERMEASURE_EXT` columns to `ZTB_IQC_NCRTB` database table to support countermeasure status ('Y'/'N') and file extensions.
  - Added a `COUNTERMEASURE` column to the NCR table which displays a download link if countermeasure exists, or a file upload button if not.
  - Allowed NCR countermeasure uploads for any of `.pdf`, `.pptx`, `.docx`, or `.xlsx` files named dynamically after `NCR_ID` (stored extension is read on download).
  - Refactored `DEFECT_IMAGE` and `COUNTERMEASURE` upload inputs to combine file selection and upload into a single-button flow using `<Button component="label">`.
  - Added "SET COMPLETED" (updates status to 'Y') and "SET PENDING" (updates status to 'P') buttons to the NCR toolbar.
  - Added corresponding update API commands (`update_ncr_process_status`, `update_ncr_countermeasure`) in backend `qcService.js`.

## Update - 2026-06-10 (OQC VOC History)

### Completed
- Added a new **VOC History** tab in `src/pages/qc/oqc/OQC.tsx` alongside the existing CMS-only QTR tab.
- Implemented `src/pages/qc/oqc/VOC_HISTORY.tsx` + `src/pages/qc/oqc/VOC_HISTORY.scss` to render VOC data as cards instead of an AGTable.
- The VOC tab reuses the same QTR data source and always queries from `2020-01-01` through today.
- Default view shows the 6 newest VOC cards in a 3-column grid; typing a product name/code filters and shows all matching cards; clearing the search restores the latest 6.
- VOC image lookup now tries `MANAGEMENT_NUMBER.jpg` and `MANAGEMENT_NUMBER.png` under `/VOC/`, with a fallback image if nothing matches.
- Updated the VOC card layout so `DEFECT_DETAILS` is shown in a dedicated highlighted block with stronger visual priority, while the product TITLE no longer crowds that area.
- Added a `Show all` checkbox next to Reload so the VOC tab can switch between the latest 6 cards and the full list when no search term is entered.
- Added per-card upload support for missing VOC images using `uploadQuery(..., "qtrimage")`; successful uploads immediately refresh the card image using `MANAGEMENT_NUMBER.jpg` or `MANAGEMENT_NUMBER.png`.
- Added a `Full Screen` checkbox next to `Show all` for the VOC tab, matching the PATROL full-screen behavior.
- Switched VOC image existence detection to async image probing with a small cache so cards render immediately while image checks run in the background.
- The VOC search box now auto-focuses on tab load and regains focus after Reload, Show all, and Full Screen toggles.
- VOC cards now support triple-clicking the image area to open the upload picker even when an image is already displayed.
- The VOC layout was compacted so the toolbar stays on a single line where possible, image height is fixed with aspect-ratio preserved, and DEFECT/WH OUT/QTR PPM/RATE now stay in a single row to fit six VOC cards better in full screen.
- The VOC search flow now treats the scan text box as a temporary buffer: successful scans commit a persistent filter, clear the input, keep focus, and preserve the current result set until the next scan.
- Added a `Dùng máy scan` checkbox on VOC History; when enabled, only the first 11 characters of the scan buffer are used as the committed search keyword.
- Optimized VOC Card layout: Redesigned the card body into two columns of equal width (50% each). The left column splits the 4 metadata fields (`REGISTERED_DATE`, `PLANT`, `PART_CODE`, `DEFECT_QTY`) into 2 rows (2 fields per row) to significantly reduce the card's vertical height. The right column displays `DEFECT_DETAILS` (or `TITLE`) in a larger font size (`1.15rem`, bold) for high visual prominence. This clean structure maximizes readability and allowed increasing the VOC image display height to `300px` (with `height: 100%` and `object-fit: contain` for full scale display) while still ensuring 2 rows of VOC cards fit cleanly in standard viewports.

### Validation
- Frontend production build succeeded: `npm run build` in `cmsnewerp2`.

## Update - 2026-04-24 (Quotation Delete Price History)

### Completed
- Added new tab **Lịch sử xóa giá** in `src/pages/kinhdoanh/quotationmanager/QuotationTotal.tsx`.
- Implemented new page `src/pages/kinhdoanh/quotationmanager/QuotationDeleteHistory.tsx` + styles `src/pages/kinhdoanh/quotationmanager/QuotationDeleteHistory.scss`.
- New tab follows QuotationManager-style layout:
	- Left panel: filter form (`fromdate`, `todate`, `codeKD`, `codeCMS`, `m_name`, `cust_name`, `alltime`) and search button.
	- Right panel: `AGTable` with deleted price history columns, approval color rendering, and Show/Hide filter panel button in toolbar.

### Backend Commands Added (practice1)
- `loadbanggiaDeletedHistory`

This command was added in `practice1/services/kinhdoanhService.js`, querying `PROD_PRICE_TABLE_DELETED` with filters and joins to `M100` + `M110`.

### Frontend Service/Type Added
- Added `BANGGIA_DELETED_DATA` interface in `src/pages/kinhdoanh/interfaces/kdInterface.ts`.
- Added `f_loadbanggiaDeletedHistory(filterData)` in `src/pages/kinhdoanh/utils/kdUtils.tsx`.

### Validation
- Frontend production build succeeded: `npm run build` (in `cmsnewerp2`).
- Backend syntax/module load check passed: `node -e "require('./services/kinhdoanhService')"` (in `practice1`).

## Update - 2026-04-17 (Dao Film Report)

### Completed
- Added new tab **Dao Film Report** inside `src/pages/sx/BAOCAOSXALL.tsx` (kept existing Data Dao Film tab unchanged).
- Implemented new page `src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.tsx` + styles `src/pages/sx/DAOFILM_REPORT/DAOFILM_REPORT.scss`.
- New page layout:
	- Top area: 3 KPI widgets (Tong so dao, So dao OK, So dao NG) + 2 Recharts pie charts.
	- Bottom area: split AGTable layout 3:2 (left backdata table + right detail table).
- Checkbox behavior implemented as requested:
	- Checked: always query full range from 2020-01-01 to current date (All time).
	- Unchecked: query by selected from/to dates.
	- First load on entering tab auto-runs with checkbox checked.
- Added frontend API utilities at `src/pages/sx/utils/daoFilmReportUtils.ts` for 4 report queries.
- Additional UI refinement:
	- Increased widget typography for easier reading.
	- Pie charts switched to full pie style and now display outside labels with connector lines so users can identify slices directly without looking at bottom legend.
	- Updated usage pie bucket ranges to: `0%`, `1 - 10%`, `11 - 20%`, `21 - 50%`, `51 - 99%`, `100 - 300%`, `301 - 500%`, `>= 500%`.
	- Updated export-count pie bucket ranges to: `0 lan`, `1 lan`, `2 - 3 lan`, `4 - 5 lan`, `6 - 10 lan`, `11 - 50 lan`, `51 - 100 lan`, `100 - 300 lan`, `300 - 500 lan`, `> 500 lan`.
	- Desktop layout updated to 3 equal columns: first column is a stacked widget group (Tong/OK/NG), second and third columns are the two pie charts; top row height is prioritized over AGTable area to enlarge chart display.
	- Added right-side detail AGTable: click a row in left backdata table to load detail rows by selected `MA_DAO` + `MA_DAO_KT`; detail columns now include `MA_DAO`, `MA_DAO_KT`, `G_CODE`, `G_NAME`, `PD`, `CAVITY`, `QTY`, `PRESS_QTY`, `EMPL_NO`, `SX_EMPL`, `SX_DATE`, `PLAN_ID` from OUT_KNIFE_FILM-based query.
	- Updated Dao Film Report backend grouping/filtering keys from `(MA_DAO, MA_DAO_KT)` to `(ZTB_QL_KNIFE_FILM.FULL_KNIFE_CODE, ZTB_QL_KNIFE_FILM.KT_KNIFE_CODE)` for backdata/widget/usage pie/export pie and detail-filter query.
	- Updated TOTAL_PRESS and ExportCount consistency: backdata now sums `ZTB_SX_RESULT.SX_RESULT / ZTB_SX_RESULT.CAVITY` from a pre-aggregated `R_SUM` CTE joined by `PLAN_ID` + `KNIFE_FILM_NO` (`FINAL_YN='Y'`) so total press matches detail rows, and `ExportCount` uses the same one-row-per-out record source without `DISTINCT` undercounting; detail query `PRESS_QTY` is also `ZTB_SX_RESULT.SX_RESULT / ZTB_SX_RESULT.CAVITY`.

### Backend Commands Added (practice1)
- `loadDaoFilmReportBackData`
- `loadDaoFilmReportWidgetData`
- `loadDaoFilmReportUsagePieData`
- `loadDaoFilmReportExportPieData`
- `loadDaoFilmReportDetailData`

These were added in `practice1/services/sanxuatService.js` and are reachable through the existing `/api` command dispatcher (`dbCommandHandlers` spread import of `sanxuatService`).

### Validation
- Frontend production build succeeded: `npm run build`.
- Backend service syntax check passed: `node -e "require('./services/sanxuatService')"`.

**Date**: March 31, 2026  
**Objective**: Implement ERPChat feature with database synchronization, semantic query engine, and real-time AI chat interface.

---

## 📋 Task Overview

Build a complete ERP Chat system that enables:
1. **AI-powered natural language queries** against ERP database
2. **Database metadata synchronization** (tables, columns, relationships)
3. **Visual metadata management** UI (add/edit tables, columns, relationships, business rules)
4. **Training data collection** for semantic query engine
5. **Session-based chat** with SQL generation and explanation

---

## 📁 Files Modified/Created (Latest Session: March 31)

### Backend Changes

#### 1. **practice1/semantic-query-engine/services/dbSyncService.js** 🚀 OVERHAULED
**Status**: ✅ Stabilized  
**Improvements**:
- **Description Sync**: Now fetches `MS_Description` from SQL Server `sys.extended_properties` for both tables and columns using specific T-SQL queries.
- **Relationship Fix**: Replaced faulty `INFORMATION_SCHEMA` cross-join logic with `sys.foreign_keys` and `sys.foreign_key_columns` join to correctly identify composite and single foreign keys.
- **Deduplication**: Implemented a `Set`-based check during sync to prevent duplicate relationships and added a cleanup script to purge existing duplicates in `relationships.json`.

#### 2. **practice1/routes/ai.js**
**Status**: ✅ Modified  
**Fixes**:
- **Table Metadata Persistence**: Fixed `POST /v2/metadata/tables` to correctly include `use_cases` field in the saved JSON, preventing data loss after edits.

---

### Frontend Changes

#### 1. **cmsnewerp2/src/components/SemanticEngineManagerEnhanced.tsx** 💎 POLISHED
**Status**: ✅ Stabilized  
**Key Improvements**:
- **AG-Grid Stability**: Fixed "duplicate node ID" warnings by memoizing table data with unique, index-prefixed IDs (e.g., `id: `${item.source_table}_${item.target_table}_${index}``).
- **Column Width persistence**: Memoized `columnDefs` to prevent AG-Grid from resetting layout on every data reload.
- **Data Type Select**: Fixed MUI "out-of-range" errors in the Column Dialog. Values are now normalized (UPPERCASE) and include a dynamic fallback for custom SQL types.
- **Bulk Import Hints**: Updated JSON placeholders in bulk import dialogs to match the exact schema of project metadata files (`tables.json`, `columns.json`, `relationships.json`).
- **Multiline Input Fix**: Fixed `use_cases` field to allow multiple lines during typing by permitting empty strings in `onChange` and filtering them only in `handleSaveTable`.

---

## 🔄 Metadata Management Status

### 🛠️ Synchronization Pipeline
- **Auto-Sync**: Fetches schema, descriptions, and relationships.
- **Force Overwrite**: Supported via UI checkbox to refresh existing metadata.
- **Manual Adjustments**: All metadata can be edited through the "Enhanced Manager" UI.

### 📊 Current Stats
- **Tables**: Parsed from `tables.json`.
- **Columns**: Managed per-table.
- **Relationships**: Cleaned and deduplicated.

---

## ⚠️ Known Issues & Observations

### 1. API Endpoint 404 (Resolved/Verify)
**Description**: Earlier report of `POST http://.../ai/ai/v2/query 404`.  
**Note**: This was likely due to double `/ai/ai` prefixing in `ERPChatV2.tsx`. Ensure base URL resolution is consistent across components using `SemanticEngineManagerEnhanced.tsx` logic.

### 2. Typing Delay
**Description**: Large column lists in AG-Grid might cause minor lag.  
**Optimization**: Using `React.memo()` and `useMemo()` for grid data has significantly improved performance.

---

## 🎯 Next Steps (April 1st)

### 1. Chat Interface (ERPChatV2.tsx)
- Verify the connection to `v2/query` endpoint.
- Test the SQL generation and explanation display.
- Ensure chat history is correctly passed to provide context.

### 2. Training Refinement
- Start adding "Business Rules" and "Concept Mappings" to improve engine accuracy for ERP-specific terms.
- Use the fixed `use_cases` field to document common question patterns directly in table metadata.

### 3. Pipeline Monitoring
- Check `pm2 logs` for any runtime errors during full DB sync cycles now that descriptions are being fetched.

---

**Version**: v0.3-alpha
**Last Updated**: 2026-03-31 16:15:00
**Status**: Metadata pipeline STABLE. UI STABLE. Ready for training & chat testing.

## Update - 2026-05-23 (Restore system default font)

- Set app font to system UI stack by updating `src/App.scss` (removed Google Inter import and switched `--app-font-family` to system-ui fallback list).

## Update - 2026-06-17 (Fix Local API Connection)

### Completed
- Investigated ERR_CONNECTION_TIMED_OUT during Login when using SUBNET_SERVER (http://cmsvina4285.com:3007).
- Identified that cmsvina4285.com resolves to a remote IP (14.160.33.94) while the local backend is running on localhost. Local requests to the domain were timing out due to network mismatch.
- Uncommented TEST_SERVER (http://localhost:3007) in globalSlice.ts's apiUrlArray so that the user can test the local backend directly without routing through the external DDNS domain.

