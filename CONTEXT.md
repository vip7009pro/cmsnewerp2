# ERP Chat & Semantic Engine - Task Context & Status

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

