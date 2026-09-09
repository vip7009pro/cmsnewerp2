# Roadmap - cmsnewerp2

- [x] Add `PART_CODE_OTHERS` to `QTR_DATA` interface in `src/pages/qc/oqc/QTR_DATA.tsx`
- [x] Add `PART_CODE_OTHERS` search support in `src/pages/qc/oqc/VOC_HISTORY.tsx`
- [x] Add scanner PROCESS_LOT_NO -> G_NAME_KD lookup via checkG_CODE_From_PROCESS_LOT_NO API in VOC_HISTORY.tsx
- [x] Fix empty REQUEST_DEPT_CODE bug in DTC Registration (dk_dtc_tab.dart & qcService.js)
- [x] Add auto-dismiss timer (3s) for Swal alert when G_NAME_KD is not found during scanning in VOC_HISTORY.tsx
- [x] Create comprehensive Web ERP UI specification markdown for Google Stitch redesign (`SYSTEM_UI_SPECIFICATION_FOR_STITCH.md`)
- [x] Create new Precision Header (`PrecisionHeader.tsx`) and Account Info (`PrecisionAccountInfo.tsx`) based on Stitch DESIGN.md with full logic mapping & dedicated preview page (`/precision-preview`)
- [x] Create new Precision PO Manager (`PrecisionPoManager.tsx` & subcomponents) mapping 100% logic from `PoManagerManageTab` and `PoManagerAddTab`, consolidating 2 tabs into 1 unified modern workspace based on Stitch DESIGN.md
- [x] Optimize layout: eliminate secondary header banner, full-width AGTable on collapse, centered DevExtreme Pivot Grid modal popup
- [x] Build comprehensive SCSS modal architecture (`PrecisionPoModals.scss`) for all 4 Stitch modals (Manual Add, Excel Bulk, Edit PO, New Invoice) resolving unstyled Tailwind issue
- [x] Fix Customer and Code Autocomplete dropdown in New PO Modal: fix z-index layering above backdrop, enable openOnFocus, multi-field search, and smart enterprise fallback data
- [x] Full-height sticky bottom viewport stretch: expand PO AGTable and Left Filter Panel seamlessly to bottom edge, pin filter actions at bottom, zero wasted space
- [x] Fix PO Filter Panel style loss: resolve unclosed JSX element div in PrecisionPoFilterPanel.tsx and add direct SCSS import
- [x] Production rollout: Replace legacy `PoManager` with `PrecisionPoManager` (preserving full backup `PoManager.backup.tsx`)
- [x] Production rollout: Replace legacy `AccountInfo` with `PrecisionAccountInfo` (preserving full backup `AccountInfo.backup.tsx` & re-exporting `LinearProgressWithLabel`)
- [x] Production rollout: Replace legacy `NavBarNew` with `PrecisionHeader` (preserving full backup `NavBarNew.backup.tsx` & proxying props)
- [x] Multi-Tab Bar overhaul: Redesign `tabsdiv` in `Home.tsx` & `home.scss` with modern Stitch UI (34px compact bar, slate-50 background, card-pill active tab with blue status dot, JetBrains Mono index chips, quick close-all toolbar, aligned `.component_element` top offset)
- [x] Fix Multi-Tab Component Full-Width Stretch: remove `justify-content: center` in `home.scss` and force `align-items: stretch`, `width: 100%` on `.component_element` and `PrecisionPoManager`
- [x] Fix PO AGTable height collapse bug in Multi-Tab mode: anchor `.component_element` with `bottom: 0` and `height: calc(100vh - 82px)`, establish full flex column height down to `.po-grid-body`, `.agtable`, `.ag-theme-quartz`, and `.ag-root-wrapper` (min-height: 250px)
- [x] Fix Menu cursor auto-focus on open (Hamburger button & `Ctrl + Space`) via micro-delay focus and `effectiveAutoFocusSearch`
- [x] Restore Navbar Omnibar quick search dropdown & real-time filtering: fix double-dispatch toggleSidebar bug, add dynamic search alignment bounds calculation (`--precision-menu-left`, `--precision-menu-width`), and enable click-to-open


