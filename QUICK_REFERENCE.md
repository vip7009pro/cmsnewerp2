# QUICK REFERENCE: CMS ERP2 REFACTOR EXECUTION GUIDE

## 📋 TẠM TÍNH NHANH

### Dòng thời gian
- **Phase 1:** 5 ngày - Types, Config, Errors
- **Phase 2:** 4 ngày - Redux State Split
- **Phase 3:** 4 ngày - Component Refactor
- **Phase 4:** 3 ngày - Code Cleanup
- **Total:** ~2.5 tuần (đơn độc)

### Người thực hiện
- 1 người (tự làm), phương pháp: Refactor từng module, test manual

### Mục tiêu chính
✅ Consolidate types (UserData + userDataInterface → 1 User interface)  
✅ Split Redux (globalSlice 70 props → 5 slices)  
✅ Extract logic (App.tsx 300 → 80 lines, large pages → hooks)  
✅ Standardize errors (catch any → structured ApiError)  

---

## 🎯 DAILY CHECKLIST TEMPLATE

Sử dụng cho mỗi ngày làm việc:

```
[ ] Morning: Review step to implement
[ ] Code: Make changes (commit sau mỗi sub-step)
[ ] Test: Run daily verification checklist (xem dưới)
[ ] Commit: Descriptive message (feature/bug fixed)
[ ] Evening: Document blockers found
```

### Daily Verification (Chạy sau mỗi commit)
```
FUNCTIONAL:
[ ] App loads without console errors
[ ] Login works (username/password)
[ ] User data displays (Navbar shows name, EMPL_NO)
[ ] Can navigate pages (Home → QLSX → etc.)
[ ] Table operations work (sort/filter/paginate)
[ ] Form submission OK
[ ] Errors display correctly (intentionally trigger one)

PERFORMANCE:
[ ] Redux DevTools shows correct state
[ ] No memory leaks (Dev Tools → Memory)
[ ] Page load time < 3 sec

UI/UX:
[ ] No layout broken
[ ] Colors/styling intact
[ ] No new console warnings (ignore pre-existing)
```

---

## 📝 PHASE 1 CHECKLIST (5 ngày)

### Day 1: Step 1.1 - Unified Type System
**Output:** Consolidated types, no duplication

```
[ ] Read GlobalInterface.ts (xác nhận duplicate UserData/userDataInterface)
[ ] Create src/types/ folder
[ ] Create user.ts, ui.ts, errors.ts, etc.
[ ] Consolidate UserData into User interface
[ ] Split GlobalInterface into 5 sub-interfaces
[ ] Run: npm run type-check (no TS errors)
[ ] Test: Type checking passes globally
[ ] Commit: "refactor: consolidate type definitions"
```

### Day 2: Step 1.2 - Redux Selectors
**Output:** All components use selectors (not direct state access)

```
[ ] Create src/redux/selectors/ folder
[ ] Create userSelectors.ts, uiSelectors.ts, etc.
[ ] Write selector functions (export selectUser, selectUserId, etc.)
[ ] Find 10+ top components using useSelector
[ ] Update them to use selectors instead of state.totalSlice
[ ] Test: App works after changes
[ ] Commit: "refactor: add redux selectors"
```

### Day 3: Step 1.3 - Configuration Extraction
**Output:** No hardcoded URLs/ports in code

```
[ ] Create .env.example file
[ ] List all hardcoded values:
    - API_HOST, API_PORT_MAIN, API_PORT_HTTPS, API_PORT_SUB
    - SOCKET_HOST, SOCKET_PORT
    - Other config as needed
[ ] Create src/config/app.config.ts
[ ] Import values from .env + provide defaults
[ ] Update globalSlice.ts to use config
[ ] Update Api.ts to use config
[ ] Test: Change .env values, verify app uses them
[ ] Commit: "refactor: extract configuration to .env"
```

### Day 4: Step 1.4 - Error Handling (Part A) - Setup
**Output:** Error handler utility ready

```
[ ] Create src/api/errorHandler.ts
[ ] Write handleApiError() - classify errors (401, 5xx, network, validation)
[ ] Write logError() - for error logging
[ ] Create error type definitions (ApiError, NetworkError, ValidationError)
[ ] Write error response formatter (show user-friendly messages)
[ ] Test: errorHandler.handleApiError(mockError) returns correct type
[ ] Commit: "refactor: create error handling utilities"
```

### Day 5: Step 1.4 - Error Handling (Part B) - Apply to Api.ts
**Output:** All API errors use structured handler

```
[ ] Open src/api/Api.ts
[ ] Find all .catch() blocks (~10-15 of them)
[ ] Replace with errorHandler.handleApiError(error)
[ ] Add logging: errorHandler.logError('fetchData', error, 'error')
[ ] Test API errors:
    [ ] Turn off internet → Network error message appears
    [ ] Test 401 → User redirected to login (or shows message)
    [ ] Test 500 → Server error message appears
[ ] Commit: "refactor: standardize API error handling"
```

---

## 📦 PHASE 2 CHECKLIST (4 ngày)

### Day 1: Step 2.1 - Create Slices
**Output:** New redux slices created, old slice still works

```
[ ] Create src/redux/slices/userSlice.ts
[ ] Create src/redux/slices/uiSlice.ts
[ ] Create src/redux/slices/notificationSlice.ts
[ ] Create src/redux/slices/settingsSlice.ts
[ ] Create src/redux/slices/socketSlice.ts
[ ] Each file has:
    - State interface
    - initialState
    - reducers with PayloadActions
    - exports: actions + default reducer
[ ] Update store.ts to include new slices (keep old totalSlice)
[ ] Test: App loads, Redux DevTools shows all slices
[ ] Commit: "refactor: create individual redux slices"
```

### Day 2-3: Step 2.2 - Migrate State Values
**Output:** Data living in new slices, old slice deprecated

```
[ ] Day 2: Migrate user data
    [ ] Copy userData from globalSlice → userSlice.initialState.data
    [ ] Update 20+ components using userData selector
    [ ] Change: useSelector(selectUser) → useSelector(selectUserData)
    [ ] Test login flow works
    
[ ] Day 3: Migrate UI state
    [ ] Copy sidebar/theme/modals → uiSlice
    [ ] Update 15+ components using UI toggles
    [ ] Test sidebar toggle works
    [ ] Test theme switching works
    
[ ] Test: All features still work (no data loss)
[ ] Commit: "refactor: migrate globalSlice data to new slices"
```

### Day 4: Step 2.3 - Remove Old Slice
**Output:** Clean Redux structure, only new slices

```
[ ] Verify all selectors updated (none reference state.totalSlice)
[ ] Verify all dispatch calls updated (none use old slice actions)
[ ] Remove totalSlice from store.ts
[ ] Delete src/redux/slices/globalSlice.ts (or backup)
[ ] Update RootState type
[ ] Test: Full app still works
    [ ] Load page → no errors
    [ ] Login → still works
    [ ] Navigate → works
[ ] Commit: "refactor: remove legacy globalSlice"
```

---

## 🎨 PHASE 3 CHECKLIST (4 ngày)

### Day 1: Step 3.1 - Extract App Logic
**Output:** App.tsx < 100 lines, logic in hook

```
[ ] Create src/hooks/useAppInitialization.ts
[ ] Move ALL initialization from App.tsx into hook:
    - Load user from storage
    - Connect socket
    - Initialize theme/settings
    - Setup listeners
[ ] useAppInitialization returns { isInitialized }
[ ] Update App.tsx to use hook (keep only: layout + routes)
[ ] Verify App.tsx < 100 lines (was 300+)
[ ] Test: App initializes correctly
[ ] Commit: "refactor: extract App initialization into hook"
```

### Day 2: Step 3.2 - Add React.memo
**Output:** Prevent unnecessary re-renders

```
[ ] Find files: src/components/DataTable/*.tsx
[ ] Wrap exports with React.memo()
[ ] Do same for: AppBar, NavMenu, important lists
[ ] Example:
    export const TableHeader = memo(function TableHeader(props) { ...
[ ] Test with Profiler (DevTools → Profiler):
    [ ] Trigger table sort/filter
    [ ] Verify TableHeader doesn't re-render (should be memoized)
[ ] Commit: "refactor: add React.memo to prevent re-renders"
```

### Day 3: Step 3.3 - Extract Page Logic
**Output:** Large pages split into hooks + sub-components

```
[ ] Pick 1 large page: src/pages/qlsx/QLSXPLAN/QLSXPLAN.tsx
[ ] Create src/hooks/useQLSXPlanForm.ts (extract form logic)
[ ] Create src/hooks/useQLSXPlanTable.ts (extract table logic)
[ ] Update QLSXPLAN.tsx to use hooks:
    - Form logic in hook
    - Table logic in hook
    - Component just returns JSX
[ ] Verify component < 150 lines (was 400+)
[ ] Test all functionality:
    [ ] Form submission works
    [ ] Table filters work
    [ ] Validation still works
[ ] Commit: "refactor: extract large page component logic"
```

### Day 4: Step 3.4 - Error Boundaries
**Output:** App won't crash if component errors

```
[ ] Create src/components/ErrorBoundary.tsx
    - Catch errors & display fallback UI
    - Log error to console/service
    - Provide reset button
[ ] Wrap in App.tsx:
    <ErrorBoundary><AppBar /></ErrorBoundary>
    <ErrorBoundary><Routes>...</Routes></ErrorBoundary>
[ ] Test: Intentionally throw error in child component
    [ ] Should see error boundary message (not blank page)
    [ ] Page still navigable/functional
[ ] Commit: "refactor: add error boundaries"
```

---

## 🧹 PHASE 4 CHECKLIST (3 ngày)

### Day 1: Step 4.1 - Remove Duplication
**Output:** Placeholders, default data, styles consolidated

```
[ ] Create src/constants/placeholders.ts
    export const PLACEHOLDERS = { GH: 'GH63-xxxxxx', LINE: '7C123xxx', ... }
[ ] Create src/utils/defaultData.ts
    export const getDefaultUserData = () => ({ ... })
[ ] Find & replace duplications:
    [ ] 10+ files with `GH63-xxxxxx`  → use PLACEHOLDERS.GH
    [ ] App.tsx + globalSlice both init user → use getDefaultUserData()
[ ] Test: Placeholder values still correct everywhere
[ ] Commit: "refactor: consolidate duplicated code"
```

### Day 2: Step 4.2 - Naming Standards
**Output:** Consistent naming, documentation created

```
[ ] Create CODING_STANDARDS.md (in project root):
    - Component naming: PascalCase + descriptive
    - Hook naming: camelCase + usePrefix
    - Constants: UPPER_SNAKE_CASE
    - Files: match export name
    
[ ] Document folder structure:
    src/components/QualityCheckForm       (PascalCase folder)
    src/hooks/useQLSXPlanData.ts          (camelCase file)
    src/constants/placeholders.ts         (lowercase constants)
    
[ ] Update README with this standard
[ ] Commit: "docs: establish coding standards"
```

### Day 3: Step 4.3 - Dependency Audit
**Output:** Documentation of dependencies (cleanup done later)

```
[ ] Create DEPENDENCIES_AUDIT.md
[ ] List problematic dependencies:
    - 3x table libraries (ag-grid, devextreme, material-table)
    - 2x excel libraries (xlsx + xlsx-populate)
    - Unused packages
    
[ ] Recommendation: "Keep for now (stability), remove in Phase 2"
[ ] DON'T remove yet (breaking changes)
[ ] Note which ones to keep permanently + why
[ ] Commit: "docs: audit and document dependency strategy"
```

---

## ✅ FINAL VERIFICATION

After all 4 phases complete:

### Functionality Check
```
[ ] App loads (no console errors)
[ ] Login/Logout works
[ ] All main pages accessible (Home, QLSX, KPI, etc.)
[ ] Data displays correctly
[ ] Forms submit successfully
[ ] Errors handled gracefully (no white screen)
[ ] Search/Filter works
[ ] Export/Import functions work
```

### Code Quality Check
```
[ ] No 'any' types in new code
[ ] Components < 200 lines
[ ] Hooks < 150 lines
[ ] Proper error handling everywhere
[ ] Redux structure logical (user, ui, notifications, settings, socket)
[ ] No circular dependencies
[ ] No unused imports
```

### Performance Check
```
[ ] Page load < 2 sec
[ ] No memory leaks (DevTools Memory)
[ ] Redux Devtools working
[ ] No console warnings (new ones)
```

### Success Criteria
```
✅ Zero bugs introduced
✅ All features work as before
✅ Code is more maintainable
✅ Structure is easier to expand
✅ Can deploy with confidence
```

---

## 🚨 KNOWN RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Socket.io breaks on init | App won't load | Move to lazy load in hook |
| Login fails after auth state move | Can't login | Test login thoroughly before removing old slice |
| Circular imports after refactor | Module errors | Never import slices in components, use selectors |
| Large component errors crash app | App blank screen | Add Error Boundaries (Day 4 of Phase 3) |

---

## 📅 SUGGESTED WEEK SCHEDULE

### Week 1
```
Mon: Phase 1.1 + 1.2 (Types + Selectors)
Tue: Phase 1.3 (Config extraction)
Wed: Phase 1.4 (Error handling)
Thu: Phase 2.1 + 2.2 (Redux slices + migration)
Fri: Phase 2.3 (Cleanup old slice) → Test thoroughly
```

### Week 2
```
Mon: Phase 3.1 + 3.2 (App logic + memoization)
Tue: Phase 3.3 (Page extraction)
Wed: Phase 3.4 (Error boundaries)
Thu: Phase 4.1 + 4.2 (Dedup + standards)
Fri: Phase 4.3 (Dependency audit) → Full verification
```

### Week 3 (if needed)
```
Mon-Wed: Bug fixes from Week 1-2 QA
Thu-Fri: Polish, documentation, prepare for production deploy
```

---

## 💡 TIPS FOR SUCCESS

1. **Commit frequently** - After each sub-step (not bulk commits)
2. **Test continuously** - Use daily checklist after every commit
3. **Document issues** - Keep running list of blockers/bugs found
4. **Ask for help early** - If stuck, don't waste 2+ hours
5. **Pull latest** - Make sure upstream changes don't conflict
6. **Backup before risky changes** - `git tag phase-1-checkpoint`

---

## 📞 WHEN STUCK

1. Check console errors (most obvious)
2. Search codebase for similar patterns (copy-paste solution)
3. Review Git diff (see what changed)
4. Try reverting last commit (if critical)
5. Ask in code review / docs (don't skip this)

---

**Status:** Ready for Week 1  
**Keep this guide open in a vs Code tab while executing!**
