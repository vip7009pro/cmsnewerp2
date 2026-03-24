# Context / Handoff (cmsnewerp2)

## Goal
Remove legacy Redux usage across the codebase:
- Replace `react-redux` (`useSelector`, `useDispatch`) + `RootState` imports.
- Remove direct `state.totalSlice.*` / `state.globalSlice.*` access.
- Use typed hooks: `useAppSelector`, `useAppDispatch`.
- Use domain selectors: `redux/selectors/uiSelectors`, `tabsSelectors`, `authSelectors`, etc.
- Prefer domain slices (eg `tabsSlice`) over old `globalSlice` tab actions.

## Codebase overview (for the next IDE)
### High-level structure
- **`src/index.tsx`**
  - React entry point.
  - Wraps app with Redux `Provider` (this is expected; do not remove).
- **`src/App.tsx`**, **`src/AppRoutes.tsx`**
  - Main app shell + routing.
- **`src/pages/*`**
  - Feature pages (largest surface area; where most legacy `useSelector`/`state.totalSlice` occurs).
- **`src/components/*`**
  - Shared UI components.
- **`src/api/*`**
  - API layer and global helpers.

### Redux architecture (current)
Store is configured in **`src/redux/store.ts`**.

Reducers (important keys in `RootState`):
- `totalSlice` -> `src/redux/slices/globalSlice.ts` (legacy aggregator; still exists)
- `auth` -> `src/redux/slices/authSlice.ts`
- `ui` -> `src/redux/slices/uiSlice.ts`
- `notifications` -> `src/redux/slices/notificationsSlice.ts`
- `tabs` -> `src/redux/slices/tabsSlice.ts`
- `chithi` -> `src/redux/slices/chithiSlice.ts`
- `socket` -> `src/redux/slices/socketSlice.ts`
- `workflowSlice` -> `src/redux/slices/workflowSlice.ts`

Typed hooks:
- **`src/redux/hooks.ts`** exports:
  - `useAppSelector` (typed to `RootState`)
  - `useAppDispatch` (typed to `AppDispatch`)

Selectors to prefer (domain selectors):
- **UI**: `src/redux/selectors/uiSelectors.ts`
  - `selectTheme`, `selectLang`, `selectCompany`, `selectSidebarMenu`, `selectCompanyInfo`, ...
- **Tabs**: `src/redux/selectors/tabsSelectors.ts`
  - `selectTabs`, `selectTabIndex`, `selectTabModeSwap`
- **Auth**: `src/redux/selectors/authSelectors.ts`
  - `selectUserData`, `selectIsLoggedIn`, ...

Domain slice actions:
- Tabs actions should come from **`src/redux/slices/tabsSlice.ts`**:
  - `closeTab`, `setTabIndex`, `addTab`, ...

### API patterns / data flow
- Main API module: **`src/api/Api.ts`**
  - Exposes helpers like `generalQuery`, `uploadQuery`, plus getters like:
    - `getCompany()`, `getUserData()`, `getGlobalLang()`, ...
  - These getters are implemented via `src/api/services/appSelectors.ts` and read from the Redux store.
- Many pages call:
  - `generalQuery("someQueryName", payload)`
  - then map `response.data.data` to local state.

### Common UI/data table usage
- Many pages render `AGTable` (`src/components/DataTable/AGTable`).
- TypeScript strictness often flags callback params in `AGTable` props.
  - Common fix applied in this session: type callback parameter `(e: any)`.

### Migration rules of thumb (practical)
- Replace `useSelector((state: RootState) => state.totalSlice.X)` with selector functions whenever possible:
  - `theme` -> `useAppSelector(selectTheme)`
  - `company` -> `useAppSelector(selectCompany)`
  - `lang` -> `useAppSelector(selectLang)`
  - `tabs/tabIndex/tabModeSwap` -> `tabsSelectors`
  - `userData` -> `useAppSelector(selectUserData)`
- Replace `useDispatch()` with `useAppDispatch()`.
- If a file still imports actions from `globalSlice` for tabs (eg `settabIndex`):
  - Migrate to `tabsSlice` (`setTabIndex`).
- Keep `Provider` in `index.tsx`.

## Progress summary (done)
### 1) `pages/qc` cleanup (COMPLETED)
Migrated all QC pages (11 files). Grep confirmed zero hits.

### 2) Early non-QC targets (COMPLETED)
- `WorkflowEditor.tsx`, `MyTab copy.tsx`, `Home copy.tsx`
- `CalcQuotation.tsx`, `YCSXComponent.tsx`

### 3) `pages/kinhdoanh` (21 files) (COMPLETED)
Full batch migration of all 21 files in kinhdoanh directory.

### 4) `pages/nhansu` (14 files) (COMPLETED)
- DeptManager, QuanLyPhongBanNhanSu copy, QuanLyCapCao(×2), LichSu(×2)
- DieuChuyenTeamCMS, DiemDanhNhomCMS
- FormXacNhanChamCong, FormDangKyTangCa, FormDangKyNghi
- BaoCaoNhanSu, UploadCong, BangChamCong

### 5) `pages/kho` (3 files) (COMPLETED)
- KHOTP, NHAPLIEU, KHOLIEU

### 6) `pages/muahang` (2 files) (COMPLETED)
- TINHLIEU, QLVL

### 7) `pages/information_board` (2 files) (COMPLETED)
- PostManager, AddInfo

## Current scan status (FULLY CLEAN)
**Final grep for `from "react-redux"` across entire `src/` returns only 2 expected hits:**
- `src/redux/hooks.ts` — typed hooks wrapper (expected, do not remove)
- `src/index.tsx` — Redux `Provider` wrapper (expected, do not remove)

All page-level and component-level files are fully migrated.

**Implicit `any` and `never` type fixes applied to:**
- `DieuChuyenTeamCMS.tsx`, `DiemDanhNhomCMS.tsx`, `BangChamCong.tsx`, `PostManager.tsx` (fixed AGTable callback params `e: any`).
- `socketSlice.ts` updated `SocketState` to include `globalSocket` to resolve `Property 'emit' does not exist on type 'never'` from `getSocket()`.

## Known outstanding TypeScript errors
None. All previously identified `implicit any` errors and the `socketSlice` type error have been fixed. A full `yarn build` confirms 0 compilation errors.

## Roadmap: SOLID Architecture Refactor (Phase 1)
Following the completion of the basic Redux migration, the next phase focuses on architectural improvements, specifically dismantling God Files and enforcing Single Responsibility Principle (SRP).

**Target:** `src/pages/kinhdoanh/utils/kdUtils.tsx` (over 2000 lines)

**Plan:**
1. **Extract Domain Services:** Break `kdUtils.tsx` into specialized service files inside `src/pages/kinhdoanh/services/` (e.g., `poService.ts`, `invoiceService.ts`, `ycsxService.ts`).
2. **Purify API Calls:** Remove all UI side-effects (e.g., `Swal.fire` and JSX rendering) from API functions. API services must only return data or throw errors.
3. **Move UI to Components:** Shift the responsibility of displaying success/error messages (`Swal.fire`) to the React components (`PoManager.tsx`, etc.) handling the user interaction.

## Guidance for continuation
1) Begin step-by-step extraction starting with `poService.ts`.
2) Ensure type safety is maintained using `kdInterface.ts`.
3) Selectors to use for Redux access:
   - `uiSelectors.ts`: `selectTheme`, `selectLang`, `selectCompany`, `selectSidebarMenu`
   - `tabsSelectors.ts`: `selectTabs`, `selectTabIndex`, `selectTabModeSwap`
   - `authSelectors.ts`: `selectUserData`, `selectIsLoggedIn`

## What was done recently (Phases 1-7 Refactor)
- **SOLID Refactoring Phase 1 (PO Services) COMPLETED:**
  - `src/pages/kinhdoanh/services/poService.ts` was created to hold pure PO-related API functions (e.g., `loadPoDataFull`, `insertPO`, `getCustomerList`, etc.).
  - All UI side-effects (`Swal.fire`) were removed from these service functions.
  - All components depending on these functions (`PoManagerManageTab.tsx`, `PoManagerAddTab.tsx`, `YCTK.tsx`, `YCSXManager.tsx`, `QuotationManager.tsx`, `InvoiceManagerManageTab.tsx`, `InvoiceManagerAddTab.tsx`) have been successfully updated to use `poService.ts` and handle UI feedback themselves.
  - The duplicated legacy functions were safely deleted from `kdUtils.tsx`.
  - Type-checking with `tsc` passed successfully.
- **SOLID Refactoring Phase 2 (Invoice Services) COMPLETED:**
  - `src/pages/kinhdoanh/services/invoiceService.ts` was created to hold pure Invoice API functions (`loadInvoiceDataFull`, `insertInvoice`, `updateInvoice`, `deleteInvoice`, `updateInvoiceNo`).
  - `InvoiceManagerManageTab.tsx` and `InvoiceManagerAddTab.tsx` updated to use `invoiceService.ts` and handle UI logic.
  - Legacy invoice functions removed from `kdUtils.tsx`.

- **SOLID Refactoring Phase 3 (YCSX Services) COMPLETED:**
  - `src/pages/kinhdoanh/services/ycsxService.ts` was created to hold YCSX, YCTK, AMZ, and PO Balance related API functions.
  - All UI side-effects were removed from service functions.
  - Components `YCSXManager.tsx`, `YCTKManager.tsx`, `YCTK.tsx`, and `KinhDoanhReport.tsx` were updated to use the new service.
  - Redundant functions (over 1400 lines) were removed from `kdUtils.tsx`.
  - Naming convention alignment: removed `f_` prefix from all service methods.

- **SOLID Refactoring Phase 6 (Nhansu Utils Migration) COMPLETED:**
  - Migrated all 30 functions from `nhansuUtils.tsx` into 2 new service files:
    - `src/pages/nhansu/services/employeeService.ts` (17 methods: Employee/Dept/Position/FaceID CRUD)
    - `src/pages/nhansu/services/attendanceService.ts` (12+1 methods: Attendance/Timekeeping/NV Verification + Personal history)
  - Updated 5 component files: `DeptManager.tsx`, `UserManager.tsx`, `DiemDanhNhomCMS.tsx`, `BangChamCong.tsx`, `UploadCong.tsx`.
  - Deleted obsolete `nhansuUtils.tsx` file.

- **SOLID Refactoring Phase 7 (Nhansu Remaining Subdirectories) COMPLETED:**
  - Created 3 new service files:
    - `src/pages/nhansu/services/reportService.ts` (6 methods: report queries from BaoCaoNhanSu)
    - `src/pages/nhansu/services/registrationService.ts` (3 methods: DangKy form submissions)
    - `src/pages/nhansu/services/teamManagementService.ts` (8 methods: team/shift/factory/position/approval operations)
  - Added `getMyDiemDanh` to existing `attendanceService.ts` for personal attendance history.
  - Updated 8 component files:
    - `BaoCaoNhanSu.tsx` → `reportService` (6 inline queries replaced)
    - `FormDangKyNghi.tsx`, `FormDangKyTangCa.tsx`, `FormXacNhanChamCong.tsx` → `registrationService`
    - `DieuChuyenTeamCMS.tsx` → `teamManagementService` (7 inline queries replaced)
    - `PheDuyetNghiCMS.tsx` → `teamManagementService` (5 inline queries replaced)
    - `LichSu.tsx`, `LichSu_New.tsx` → `attendanceService` (3 inline queries replaced)
  - All Swal.fire() notifications remain in components.
  - `QuanLyCapCao.tsx` and `QuanLyCapCao_NS.tsx` — tab containers with zero API calls, no changes needed.

## Nhansu Service Architecture (Current)
```
src/pages/nhansu/services/
├── employeeService.ts        (17 methods - Employee/Dept/Position/FaceID)
├── attendanceService.ts      (13 methods - BangCong/DiemDanh/Shifts/History)
├── reportService.ts          (6 methods  - Reports/Summaries)
├── registrationService.ts    (3 methods  - Leave/OT/TimeCheck registration)
└── teamManagementService.ts  (8 methods  - Team/Shift/Factory/Position/Approval)
```

- **SOLID Refactoring Phase 8 (Kho Module) COMPLETED:**
  - Created 3 new service layers: `khoReportService.ts`, `khoTpService.ts`, and `khoLieuService.ts` inside `src/pages/kho/services/`.
  - Removed internal reliance on `khoUtils.tsx` and cleared it.
  - Successfully moved 39 `generalQuery` calls away from 6 main interface components (`KHOTPNEW`, `KHOTP`, `XUATLIEU`, `NHAPLIEU`, `KHOLIEU`, and 3 Report files).

## Kho Service Architecture (Current)
```
src/pages/kho/services/
├── khoReportService.ts       (11 methods - Report charts and stock summaries)
├── khoLieuService.ts         (12 methods - Material inputs/outputs/checking)
└── khoTpService.ts           (13 methods - Finished goods inputs/outputs/stock/updates)
```

- **SOLID Refactoring Phase 9 (Remaining KinhDoanh Modules) COMPLETED:**
  - `custManager`, `fcstmanager`, `planmanager`, `poandstockfull`, `shortageKD` successfully refactored.
  - Added 4 new service files: `customerService.ts`, `fcstService.ts`, `planService.ts`, `shortageService.ts`.
  - Extended `poService.ts` to support `loadPOFullCMS` and `loadPOFullKD`.
  - Cleaned all inline `generalQuery` usages from 8 corresponding components.

## KinhDoanh Service Architecture (Current)
```
src/pages/kinhdoanh/services/
├── poService.ts              (extended, supports POFull handling)
├── invoiceService.ts         
├── ycsxService.ts            
├── customerService.ts        (4 methods - checkcustcd, get_listcustomer, add_customer, edit_customer)
├── fcstService.ts            (5 methods - traFcstDataFull, insert_fcst, delete_fcst, checkFcstExist, checkGCodeVer)
├── planService.ts            (5 methods - traPlanDataFull, insert_plan, delete_plan, checkPlanExist, checkGCodeVer)
└── shortageService.ts        (5 methods - traShortageKD, insert_shortage, delete_shortage, checkShortageExist, checkGCodeVer)
```

## What is NEXT
- Proceed to review and refactor the next major module (e.g., `rnd`, `sx`, `qc`, or `qlsx`), tracking down loose `generalQuery` occurrences and implementing corresponding service layers.
