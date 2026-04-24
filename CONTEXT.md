# ERP Chat & Semantic Engine - Task Context & Status

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
