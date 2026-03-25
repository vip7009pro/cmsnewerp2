# REFACTOR PLAN: CMS ERP2 React Codebase Standardization

## TL;DR
**Mục tiêu:** Tái cấu trúc codebase theo hướng chuẩn (modular, typed, maintainable) trong 2-3 tuần. 
**Phương pháp:** Refactor từng module độc lập theo thứ tự ưu tiên (từ core → UI), đảm bảo không vỡ cấu trúc thông qua kiểm tra manual từng phase.
**Kết quả mong đợi:** Codebase dễ bảo trì, mở rộng, và giảm 30-40% kỹ thuật debt.

---

## PHASE 1: FOUNDATION REFACTOR (Tuần 1 - 5 ngày)
*Những thay đổi core không ảnh hưởng đến UI, commit từng bước*

### Step 1.1: Unified Type System (1 ngày)
**Đích:** Loại bỏ duplicate interface, tạo single source of truth cho types

**Chi tiết làm việc:**
- **File:** `src/api/GlobalInterface.ts`
  - Merge `UserData` (optional) + `userDataInterface` (required) thành 1 interface `User`
  - Tách `GlobalInterface` (70+ properties) thành 5 sub-interfaces:
    - `UserState` - user data + credentials
    - `UIState` - toggles, sidebar, theme
    - `SocketState` - socket connection
    - `NotificationState` - message queue
    - `SettingsState` - app config
  - Tạo 5 type files mới trong `src/types/`:
    - `user.ts`, `ui.ts`, `socket.ts`, `notification.ts`, `settings.ts`
  
- **New file:** `src/types/errors.ts`
  ```typescript
  export class ApiError extends Error {
    constructor(public code: number, public message: string) { super(); }
  }
  export class ValidationError extends Error { }
  export class NetworkError extends Error { }
  ```

- **New file:** `src/api/errorHandler.ts`
  ```typescript
  export const handleApiError = (error: any): ApiError => {
    if (error.response) return new ApiError(error.response.status, error.response.data?.message)
    if (error.code === 'ECONNABORTED') return new NetworkError('Timeout')
    return new ApiError(0, error.message)
  }
  ```

**Verification:**
- [ ] Compile không có TS errors
- [ ] Imports của tất cả files vẫn hoạt động (chỉnh đầu file nếu cần)
- [ ] globalSlice.ts vẫn export đúng state structure

**Commit:** `refactor: consolidate type definitions into unified system`

---

### Step 1.2: Redux State Refactor - PART A: Create Selectors (1 ngày)
**Đích:** Tạo selectors trước khi di chuyển state (để không break references)

**Chi tiết làm việc:**
- **New folder:** `src/redux/selectors/`
- **New files:** Tạo selector files cho mỗi domain:
  - `userSelectors.ts` - export từ globalSlice.totalSlice.userData (hiện tại)
  - `uiSelectors.ts` - sidebar, theme, modals
  - `notificationSelectors.ts` - messages, toasts
  
  Example:
  ```typescript
  // src/redux/selectors/userSelectors.ts
  import { RootState } from '../store';
  
  export const selectUser = (state: RootState) => state.totalSlice.userData;
  export const selectUserId = (state: RootState) => state.totalSlice.userData?.EMPL_NO;
  export const selectUserRole = (state: RootState) => state.totalSlice.userData?.JOB_NAME;
  ```

- **Update all components:**
  - Tìm tất cả `useSelector((state) => state.totalSlice.userData)`
  - Thay bằng `useSelector(selectUser)`
  - Làm tương tự cho tất cả properties của globalSlice

**Verification:**
- [ ] App vẫn chạy (reload page)
- [ ] User data hiển thị đúng trên Navbar/Dashboard
- [ ] Không có console warnings

**Commit:** `refactor: add redux selectors (preparation for state split)`

---

### Step 1.3: Configuration Extraction (6 hours)
**Đích:** Di chuyển hardcoded values từ code sang .env + config file

**Chi tiết làm việc:**
- **New file:** `.env.example` (commit vào repo)
  ```
  VITE_API_HOST=localhost
  VITE_API_PORT_MAIN=5013
  VITE_API_PORT_MAIN_HTTPS=5014
  VITE_API_PORT_SUB=3007
  VITE_SOCKET_HOST=localhost
  VITE_SOCKET_PORT=3000
  ```

- **New file:** `src/config/app.config.ts`
  ```typescript
  export const apiConfig = {
    host: import.meta.env.VITE_API_HOST || 'localhost',
    port: {
      main: import.meta.env.VITE_API_PORT_MAIN || '5013',
      mainHttps: import.meta.env.VITE_API_PORT_MAIN_HTTPS || '5014',
      sub: import.meta.env.VITE_API_PORT_SUB || '3007',
    },
    protocol: window.location.protocol.replace(':', ''),
  };
  
  export const socketConfig = {
    host: import.meta.env.VITE_SOCKET_HOST || 'localhost',
    port: import.meta.env.VITE_SOCKET_PORT || '3000',
  };
  ```

- **Update files:**
  - `src/redux/slices/globalSlice.ts` - import từ `config/app.config.ts` thay vì hardcoded
  - `src/api/Api.ts` - sử dụng `apiConfig.host` thay vì hardcoded URL
  
- **Remove:** Các hardcoded CMS info, company info từ globalSlice (để vào database thay vì code)

**Verification:**
- [ ] .env.example có tất cả config keys (reference file để set up dự án mới)
- [ ] App chạy với đúng server (check Network tab)
- [ ] Đổi .env values, chắc chắn app sử dụng giá trị mới

**Commit:** `refactor: extract configuration to .env and config file`

---

### Step 1.4: API Error Handling Standardization (1 ngày)
**Đích:** Thay thế `catch(error: any) => Swal.fire(...)` bằng structured error handling

**Chi tiết làm việc:**
- **Update:** `src/api/errorHandler.ts`
  ```typescript
  export const errorHandler = {
    handleApiError: (error: any) => {
      const apiError = handleApiError(error);
      
      // Classify error
      if (apiError.code === 401) {
        // Redirect to login
        window.location.href = '/login';
        return;
      }
      if (apiError.code >= 500) {
        logger.error('Server Error', apiError);
        return Swal.fire('Lỗi Server', 'Hãy thử lại sau', 'error');
      }
      if (apiError instanceof NetworkError) {
        return Swal.fire('Mất kết nối', 'Kiểm tra Internet', 'warning');
      }
      
      // Generic API error
      Swal.fire('Lỗi', apiError.message || 'Đã xảy ra lỗi', 'error');
    },
    
    logError: (context: string, error: any, severity: 'info'|'warn'|'error') => {
      // Log to console / external service
      console[severity](`[${context}]`, error);
    }
  };
  ```

- **Update in phases** (batch by module):
  - **Phase A (Day 2):** `src/api/Api.ts` - Thay tất cả `.catch()` blocks
  - **Phase B (Day 3):** `src/pages/login/` - Update login flow error handling
  - **Phase C (Day 4):** `src/pages/home/` - Update dashboard error handling
  - (Tiếp tục các pages quan trọng khác)

- **Pattern thay đổi:**
  ```typescript
  // BEFORE
  .catch((error: any) => {
    Swal.fire("Thông báo", "Có lỗi: " + error, "warning");
    console.log(error);
  })
  
  // AFTER
  .catch((error) => {
    errorHandler.handleApiError(error);
    errorHandler.logError('fetchUserData', error, 'error');
  })
  ```

**Verification:**
- [ ] Trigger network error (turn off internet) - hiển thị đúng message
- [ ] Trigger 401 - redirect to login, không xảy ra exception
- [ ] Trigger 500 - hiển thị "Lỗi Server"
- [ ] Normal API error - hiển thị message từ server

**Commit:** `refactor: standardize API error handling with structured handlers`

---

## PHASE 2: STATE MANAGEMENT REFACTOR (Tuần 1-2 - 4 ngày)
*Tách Redux store từ one big slice thành multiple domain slices*

### Step 2.1: Create Individual Redux Slices (2 ngày)
**Đích:** Tách `globalSlice` (70 properties) thành 5 slices

**Chi tiết:**
- **New files:** `src/redux/slices/`
  - `userSlice.ts` (user data, auth info)
  - `uiSlice.ts` (sidebar toggle, modals, theme)
  - `notificationSlice.ts` (message queue, toasts)
  - `settingsSlice.ts` (language, preferences)
  - `socketSlice.ts` (connection status, listeners)
  
  Keep existing: `globalSlice.ts` (for gradual migration)

- **Example - `userSlice.ts`:**
  ```typescript
  import { createSlice, PayloadAction } from "@reduxjs/toolkit";
  import { User } from "../../types/user";
  
  interface UserState {
    data: User | null;
    isLoading: boolean;
    error: string | null;
  }
  
  const initialState: UserState = {
    data: null,
    isLoading: false,
    error: null,
  };
  
  export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<User>) => {
        state.data = action.payload;
      },
      clearUser: (state) => {
        state.data = null;
      },
    },
  });
  
  export const { setUser, clearUser } = userSlice.actions;
  export default userSlice.reducer;
  ```

- **Update store.ts temporarily** (parallel setup):
  ```typescript
  export const store = configureStore({
    reducer: {
      // Old (keep for backward compat - will remove later)
      totalSlice: glbReducer,
      workflowSlice: workflowReducer,
      // New
      user: userReducer,
      ui: uiReducer,
      notifications: notificationReducer,
      settings: settingsReducer,
      socket: socketReducer,
    },
  });
  ```

**Verification:**
- [ ] Store structure now has both old + new slices
- [ ] Selectors still work (reference old totalSlice)
- [ ] Redux DevTools shows correct state structure
- [ ] No console errors

**Commit:** `refactor: create individual redux slices (user, ui, notifications, settings, socket)`

---

### Step 2.2: Migrate State Values to New Slices (1.5 ngày)
**Đích:** Di chuyển data từ globalSlice sang appropriate new slices

**Chi tiết:**
1. **Extract initial state values** từ globalSlice
   - userData → userSlice.initialState.data
   - sidebar/theme → uiSlice.initialState
   - messages → notificationSlice.initialState
   - etc.

2. **Migrate reducers** one by one
   - Find actions in globalSlice that update user data
   - Create equivalent actions in userSlice
   - Update dispatch calls in components

3. **Update selectors** progressively
   ```typescript
   // Before
   const user = useSelector(selectUser); // from old slice
   
   // After
   const user = useSelector((state) => state.user.data); // from new slice
   // Or better:
   const user = useSelector(selectUserData); // from userSelectors.ts
   ```

**Files to update:** (Prioritize by frequency of use)
- [ ] `src/redux/slices/globalSlice.ts` - copy userData → userSlice
- [ ] `src/redux/slices/globalSlice.ts` - copy UI toggles → uiSlice
- [ ] `src/redux/slices/globalSlice.ts` - copy notifications → notificationSlice
- [ ] Login flow - dispatch to `userSlice.setUser` instead of global
- [ ] Sidebar component - dispatch to `uiSlice.toggleSidebar` 

**Verification:**
- [ ] App.tsx initializes both old + new slices (no data loss)
- [ ] Login flow works (user data stored in new userSlice)
- [ ] Sidebar toggle works (uses uiSlice)
- [ ] Notifications appear (uses notificationSlice)

**Commit:** `refactor: migrate globalSlice data to individual domain slices`

---

### Step 2.3: Remove Old globalSlice (1/2 ngày - buổi cuối)
**Đích:** Xóa totalSlice từ store khi tất cả migrations hoàn thành

**Thực hiện:**
1. Verify tất cả selectors đã update
2. Verify tất cả dispatch calls không reference globalSlice
3. Remove from store.ts
4. Delete old globalSlice.ts
5. Update store.ts types

**Verification:**
- [ ] App still works (reload)
- [ ] No console errors about missing state
- [ ] Redux DevTools shows clean structure (user, ui, notifications, etc.)

**Commit:** `refactor: remove legacy globalSlice`

---

## PHASE 3: COMPONENT REFACTOR (Tuần 2-3 - 4 ngày)
*Tách large components, add memoization, extract logic*

### Step 3.1: Extract App.tsx Logic (1 ngày)
**Đích:** App.tsx (300+ lines) → split into hooks + cleaner component

**Chi tiết:**
- **New file:** `src/hooks/useAppInitialization.ts`
  ```typescript
  export const useAppInitialization = () => {
    const dispatch = useDispatch();
    const [isInitialized, setIsInitialized] = useState(false);
  
    useEffect(() => {
      // Move ALL initialization logic from App.tsx here
      // - Load user from storage
      // - Connect socket
      // - Initialize settings
      // - etc.
      
      setIsInitialized(true);
    }, [dispatch]);
    
    return { isInitialized };
  };
  ```

- **Update App.tsx:**
  - Remove 200+ lines of initialization logic
  - Import + call `useAppInitialization()`
  - Keep only: routes + layout

  Before: 300+ lines
  After: ~80 lines (much cleaner)

**Verification:**
- [ ] App.tsx readable in single screen
- [ ] Initialization still works (user loads, socket connects)
- [ ] No race conditions (settings load before use)

**Commit:** `refactor: extract App initialization logic into custom hook`

---

### Step 3.2: Add React.memo to Components (1 ngày)
**Đích:** Prevent unnecessary re-renders

**Priority:**
1. **High-update components** (rerender frequently):
   - All table headers/columns
   - Filter components
   - Toolbar items

2. **Implementation:**
   ```typescript
   // Before
   export function TableHeader({ columns }) {
     return <...>
   }
   
   // After
   export const TableHeader = memo(function TableHeader({ columns }) {
     return <...>
   }, (prevProps, nextProps) => {
     // Custom comparison if needed
     return prevProps.columns === nextProps.columns;
   });
   ```

**Files to update:**
- [ ] `src/components/DataTable/*` - Add memo to table headers
- [ ] `src/components/AppBar/*` - Memo AppBarCustom
- [ ] `src/components/NavMenu/*` - Memo menu items

**Verification:**
- [ ] Open DevTools Profiler
- [ ] Interact with table (filter, sort)
- [ ] Verify components don't re-render unnecessarily

**Commit:** `refactor: add React.memo to prevent unnecessary re-renders`

---

### Step 3.3: Extract Large Pages Logic (1.5 ngày)
**Đích:** Pages > 400 lines → split logic into hooks + sub-components

**Target files:**
1. `src/pages/qlsx/QLSXPLAN/QLSXPLAN.tsx` (400+ lines)
   - Extract form logic → `useQLSXPlanForm.ts`
   - Extract table logic → `useQLSXPlanTable.ts`
   - Keep page as: `<QLSXPlanTable /> + <QLSXPlanForm />`

2. `src/pages/home/Home.tsx` (large)
   - Extract widget rendering → `useWidgetData.ts`
   - Extract chart logic → `useChartData.ts`

**Example refactor:**
```typescript
// Before - 400 lines in one component
export function QLSXPLAN() {
  const [formData, setFormData] = useState({...});
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({...});
  // ... 200 more lines of logic
  return <form>{/* complex JSX */}</form>
}

// After - 80 lines
export function QLSXPLAN() {
  const { formData, handleChange, handleSubmit } = useQLSXPlanForm();
  const { tableData, filters, setFilters } = useQLSXPlanTable();
  
  return (
    <>
      <QLSXPlanTable data={tableData} filters={filters} onFilterChange={setFilters} />
      <QLSXPlanForm data={formData} onChange={handleChange} onSubmit={handleSubmit} />
    </>
  );
}
```

**Verification:**
- [ ] Page functionality unchanged (all actions still work)
- [ ] Each hook < 100 lines (single responsibility)
- [ ] Form validation works
- [ ] Table operations (sort, filter, edit) work

**Commit:** `refactor: extract large page components into hooks and sub-components`

---

### Step 3.4: Add Error Boundaries (6 hours)
**Đích:** Catch component errors, prevent app crash

**Implementation:**
- **New file:** `src/components/ErrorBoundary/ErrorBoundary.tsx`
  ```typescript
  export class ErrorBoundary extends React.Component<...> {
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Component crashed:', error);
      this.setState({ hasError: true, error });
      // Log to external service
    }
    
    render() {
      if (this.state.hasError) {
        return <ErrorFallback error={this.state.error} />;
      }
      return this.props.children;
    }
  }
  ```

- **Wrap key sections** in App.tsx:
  ```typescript
  <ErrorBoundary>
    <AppBar />
  </ErrorBoundary>
  <ErrorBoundary>
    <Routes>
      <Route ... />
    </Routes>
  </ErrorBoundary>
  ```

**Verification:**
- [ ] Intentionally throw error in a component
- [ ] Error Boundary catches it (doesn't crash whole app)
- [ ] User sees friendly error message
- [ ] Can reload that section

**Commit:** `refactor: add error boundaries to prevent app crashes`

---

## PHASE 4: CODE CLEANUP & STANDARDS (Tuần 3 - 3 ngày)

### Step 4.1: Remove Duplication (1 ngày)
**Đích:** Consolidate duplicate code patterns

**Priority:**
1. **Placeholder strings** (found in 10+ files)
   ```typescript
   // New file: src/constants/placeholders.ts
   export const PLACEHOLDERS = {
     GH: 'GH63-xxxxxx',
     LINE: '7C123xxx',
     PRODUCT: 'SP-xxxxx',
     // etc.
   };
   
   // Usage everywhere:
   <Input placeholder={PLACEHOLDERS.GH} />
   ```

2. **User initialization** (found in 3 places)
   ```typescript
   // New file: src/utils/defaultData.ts
   export const getDefaultUserData = (): User => ({...});
   
   // Import in App.tsx + globalSlice.ts
   ```

3. **Styles duplication**
   - Find common gradient/shadow patterns
   - Create `src/styles/common.scss`
   - Reference in component files

**Verification:**
- [ ] Search for `GH63-xxxxxx` returns only 1 occurrence (constants file)
- [ ] User data initialized from one source
- [ ] App appearance unchanged

**Commit:** `refactor: consolidate duplicated code patterns`

---

### Step 4.2: Standardize Naming & Formatting (1/2 ngày)
**Đích:** Consistent naming conventions

**Guidelines (going forward):**
1. **Components:** PascalCase + descriptive names
   - ✅ `QualityCheckForm`, `InventoryTable`, `ShiftSelector`
   - ❌ `QLSX_PLAN`, `GH63_comp`, `COMPONENT_A`

2. **Hooks:** camelCase with `use` prefix
   - ✅ `useQLSXPlanData`, `useTableFilters`, `useUserAuth`
   - ❌ `f_qlsx_data`, `table_filters`, `get_user`

3. **Constants:** UPPER_SNAKE_CASE
   - ✅ `MAX_BATCH_SIZE`, `VALIDATION_RULES`
   - ❌ `maxBatchSize`, `validation_rules`

4. **Files:** Same as export (PascalCase for components)
   ```
   src/
   ├── components/
   │   ├── QualityCheckForm/              # PascalCase for components
   │   │   ├── QualityCheckForm.tsx
   │   │   └── QualityCheckForm.scss
   ├── hooks/
   │   ├── useQLSXPlanData.ts             # camelCase with 'use' prefix
   ├── constants/
   │   └── placeholders.ts                # lowercase for constants
   ```

**Immediate Actions:**
- [ ] Create coding standards doc: `CODING_STANDARDS.md`
- [ ] Refactor folder names (QLSXPLAN/ → qlsx-plan/ or QLSXPlan/)
- [ ] Keep old folder names during transition (won't break imports)

**Commit:** `docs: establish naming and formatting standards`

---

### Step 4.3: Dependency Cleanup (1/2 ngày)
**Đích:** Audit and optimize dependencies

**Analysis:**
- 3x table libraries: ag-grid, devextreme, material-table → Keep only ag-grid
- 2x excel libraries: xlsx + xlsx-populate → Keep only xlsx
- Unused: Check for imports that are never used

**Action Items:**
- [ ] Create `DEPENDENCIES_AUDIT.md`
- [ ] List candidates for removal (note in PR for future removal)
- [ ] Don't remove now (breaking changes risk) - mark for next phase
- [ ] Document why keeping: "ag-grid for complex grids, material for simple tables"

**Commit:** `docs: audit and document dependency strategy`

---

## PHASE 5: VERIFICATION & TESTING (After each phase)
*Manual QA checklist to run after each step*

### Daily Verification Checklist
After each commit or end of day:

**Functional Testing:**
- [ ] App loads without errors (check console)
- [ ] Login flow works
- [ ] User data displays (Navbar shows name)
- [ ] Sidebar toggle works
- [ ] Navigate between main pages (Home → QLSX → etc.)
- [ ] Table operations: sort, filter, paginate
- [ ] Form submission (in at least 1 page)
- [ ] Search functionality

**Performance Check:**
- [ ] Page load time reasonable (< 3 sec)
- [ ] No memory leaks (DevTools → Memory)
- [ ] Redux DevTools: state mutations are correct

**UI/UX Check:**
- [ ] No visual bugs (layout intact)
- [ ] Errors display correctly
- [ ] Notifications appear
- [ ] No console warnings (allow some, check new ones)

---

## CRITICAL BLOCKERS & MITIGATION

### 1. Socket.io Initialization
**Risk:** Socket setup happens at module load in globalSlice
**Mitigation:** 
- Lazy load socket after user authenticated
- Move socket setup to useAppInitialization hook
- Test with DevTools: verify socket only connects when needed

### 2. Login Flow Coupled to globalSlice
**Risk:** Changing auth state structure breaks login
**Strategy:**
- Step 1: Create selectors (so component refs don't break)
- Step 2: Migrate auth state to userSlice gradually
- Step 3: Test login completely before removing old slice

### 3. Circular Dependencies
**Risk:** Refactoring may create circular imports
**Prevention:**
- Use `src/redux/selectors/` as single import point
- Never import slices directly in components
- Keep hooks in `src/hooks/` separate from slice definitions

---

## FILES MODIFIED SUMMARY

### New Files Created (Phase 1-4):
```
src/
├── types/                          # NEW
│   ├── index.ts
│   ├── user.ts
│   ├── ui.ts
│   ├── errors.ts
│   └── ...
├── config/                         # NEW
│   └── app.config.ts
├── api/
│   └── errorHandler.ts             # NEW
├── redux/
│   ├── selectors/                  # NEW
│   │   ├── userSelectors.ts
│   │   ├── uiSelectors.ts
│   │   └── ...
│   └── slices/
│       ├── userSlice.ts            # NEW
│       ├── uiSlice.ts              # NEW
│       └── ...
├── hooks/                          # NEW (start minimal)
│   ├── useAppInitialization.ts
│   └── useQLSXPlanForm.ts
├── constants/                      # NEW
│   ├── placeholders.ts
│   └── defaultData.ts
├── utils/
│   └── defaultData.ts              # MOVED from hardcoded
└── docs/                           # NEW
    ├── CODING_STANDARDS.md
    └── DEPENDENCIES_AUDIT.md
```

### Key Files Modified:
```
src/
├── App.tsx                         # Reduced from 300 → ~80 lines
├── api/GlobalInterface.ts          # Consolidated duplicates
├── api/Api.ts                      # Updated error handling (batch)
├── redux/store.ts                  # Added new slices (kept old)
├── redux/slices/globalSlice.ts     # Reduced size (removed to other slices)
├── pages/login/*.tsx               # Updated dispatch calls
├── pages/qlsx/QLSXPLAN.tsx         # Extracted logic to hooks
├── pages/home/Home.tsx             # Extracted widget logic
├── components/**/*.tsx             # Added React.memo (batch)
├── .env.example                    # NEW - configuration template
└── package.json                    # No changes (remove deps in future)
```

---

## TIMELINE & MILESTONES

| Phase | Week | Days | Focus | Milestones |
|-------|------|------|-------|-----------|
| **1** | Week 1 | 5 days | Core Foundation | ✅ Types unified, Errors standardized, Config extracted |
| **2** | Week 1-2 | 4 days | Redux Refactor | ✅ Slices created, Old state migrated, globalSlice removed |
| **3** | Week 2-3 | 4 days | Component Refactor | ✅ App simplified, Memoization added, Pages split |
| **4** | Week 3 | 3 days | Cleanup | ✅ Duplications removed, Standards established |
| **5** | Throughout | Ongoing | Testing | ✅ Daily QA, Issue tracking |

**Total:** 2.5-3 weeks (manageable by 1 person with daily focus)

---

## ROLLBACK STRATEGY

If critical issue found after commit:
```bash
# Revert problematic commit
git revert COMMIT_HASH

# Or go back multiple commits
git reset --hard HEAD~2

# Test on previous commit
```

**Safety measures:**
1. Commit after EACH step (not bulk commits)
2. Test before committing (functional checklist)
3. Tag stable versions: `git tag phase-1-stable`

---

## POST-REFACTOR MAINTENANCE

### Month 1 (After refactor):
- [ ] Monitor error logs (any new patterns?)
- [ ] Document lessons learned
- [ ] Create issue backlog for future improvements

### Month 2-3:
- [ ] Remove deprecated dependencies
- [ ] Write unit tests for critical hooks
- [ ] Implement i18n for hard-coded strings
- [ ] Add performance monitoring

---

## SUCCESS CRITERIA

Refactor is **successful** when:

✅ **Code Quality:**
- [ ] No `any` types in new code
- [ ] All functions have clear single responsibility
- [ ] Components < 200 lines
- [ ] 90%+ test coverage on critical flows

✅ **Performance:**
- [ ] Page load < 2 seconds
- [ ] No unnecessary re-renders
- [ ] Bundle size stable (not increased)

✅ **Maintainability:**
- [ ] 3 new developers can understand structure in 1 day
- [ ] Adding new feature takes < 2 hours (vs. current > 1 day)
- [ ] Code reviews faster (clear patterns)

✅ **Stability:**
- [ ] Zero production errors introduced by refactoring
- [ ] All existing features work identically
- [ ] Deployment confidence: 95%+ (vs. current 70%)

---

## APPENDIX: REFERENCE PATTERNS

### Redux Pattern (AFTER refactor):
```typescript
// OLD (avoid going forward)
const state = useSelector(state => state.totalSlice);

// NEW (use this pattern)
const user = useSelector(selectUserData);
const dispatch = useDispatch();
dispatch(setUser(newUser));
```

### Component Pattern (AFTER refactor):
```typescript
// OLD (avoid)
function TableHeader(props: any) { ... }

// NEW (use this pattern)
interface TableHeaderProps {
  columns: Column[];
  sortBy?: string;
  onSort?: (column: string) => void;
}

export const TableHeader = memo(function TableHeader({
  columns,
  sortBy,
  onSort,
}: TableHeaderProps) {
  return <...>
});
```

### Error Handling Pattern (AFTER refactor):
```typescript
// OLD (avoid)
.catch(err => Swal.fire('Error', err, 'warning'))

// NEW (use this pattern)
.catch(err => {
  errorHandler.handleApiError(err);
  errorHandler.logError('fetchData', err, 'error');
})
```

---

**Document Version:** 1.0  
**Created:** 2026-03-25  
**Last Updated:** 2026-03-25  
**Owner:** Refactor Task  
**Status:** Ready for Execution
