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

**Implicit `any` type fixes applied to:**
- `DieuChuyenTeamCMS.tsx`, `DiemDanhNhomCMS.tsx`, `BangChamCong.tsx`, `PostManager.tsx`
- Pattern: AGTable callback params `(e)` → `(e: any)`

## Known outstanding TypeScript errors (pre-existing, not caused by refactor)
- Multiple `Parameter 'e' implicitly has an 'any' type` in:
  - `DieuChuyenTeamCMS.tsx`, `DiemDanhNhomCMS.tsx`, `BangChamCong.tsx`
  - `PostManager.tsx`, `KHCT.tsx`, `EQ_STATUS2.tsx`, `NCR_MANAGER.tsx`

## Guidance for continuation
1) Run `yarn build` to confirm no regressions after implicit `any` fixes.
2) Selectors to use:
   - `uiSelectors.ts`: `selectTheme`, `selectLang`, `selectCompany`, `selectSidebarMenu`
   - `tabsSelectors.ts`: `selectTabs`, `selectTabIndex`, `selectTabModeSwap`
   - `authSelectors.ts`: `selectUserData`, `selectIsLoggedIn`

## What was NOT done
- No final `yarn build` after implicit `any` fixes.
- No smoke test.
