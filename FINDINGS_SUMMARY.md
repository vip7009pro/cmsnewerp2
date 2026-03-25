# CODEBASE FINDINGS SUMMARY

## 🔴 CRITICAL ISSUES (Phải Fix)

### 1. Duplicate Type Definitions
**File:** `src/api/GlobalInterface.ts`  
**Issue:** UserData (optional) + userDataInterface (required) = same data, 2 definitions  
**Risk Level:** HIGH - violates single source of truth  
**Impact:** Maintenance nightmare, hard to know which one to use  
**Action:** Consolidate into 1 User interface  
**Effort:** 2 hours  

### 2. God Object Redux State
**File:** `src/redux/slices/globalSlice.ts`  
**Issue:** Single slice with 70+ properties (user, UI, socket, settings, notifications)  
**Risk Level:** HIGH - impossible to debug, hard to optimize  
**Impact:** Entire app state in one huge object  
**Action:** Split into userSlice, uiSlice, notificationSlice, settingsSlice, socketSlice  
**Effort:** 2 days  

### 3. Untyped Error Handling
**File:** `src/api/Api.ts` (20+ places)  
**Issue:** `.catch((error: any) => Swal.fire(...))` - generic error handling, hides real issues  
**Risk Level:** HIGH - production errors not properly caught/logged  
**Impact:** Can't distinguish API errors from network errors from validation errors  
**Action:** Create structured error types + error handler utility  
**Effort:** 1 day  

### 4. Hard-coded Configuration
**Files:** `src/redux/slices/globalSlice.ts`, `src/api/Api.ts`  
**Issue:** Server URLs, ports, CMS info hard-coded in code  
**Risk Level:** MEDIUM - can't change without recompile  
**Impact:** Need to rebuild app for different environments  
**Action:** Move to .env + config file  
**Effort:** 6 hours  

---

## 🟠 HIGH PRIORITY ISSUES (Phải Refactor)

### 5. Large Components
**Files:** `src/App.tsx` (300 lines), `src/pages/qlsx/QLSXPLAN/QLSXPLAN.tsx` (400 lines)  
**Issue:** Too much logic in single file (mixing initialization, layout, business logic)  
**Risk Level:** MEDIUM - hard to test, maintain, extend  
**Impact:** Difficult to find bugs, slow to modify  
**Action:** Extract logic into custom hooks  
**Effort:** 2 days  

### 6. Code Duplication
**Examples:**
- `GH63-xxxxxx` placeholder string appears in 10+ files
- User initialization logic in App.tsx + globalSlice.ts
- Similar form patterns repeated across pages

**Risk Level:** MEDIUM - changes need to be made in multiple places  
**Action:** Consolidate into constants + utilities  
**Effort:** 1 day  

### 7. No Error Boundaries
**Files:** Throughout codebase  
**Issue:** Single component error crashes entire app  
**Risk Level:** MEDIUM - bad user experience  
**Impact:** App becomes blank screen if any component crashes  
**Action:** Add Error Boundary components at route level  
**Effort:** 6 hours  

### 8. Mixed Styling Approaches
**Found:** SCSS files + styled-components + inline styles  
**Risk Level:** LOW-MEDIUM - inconsistent maintenance  
**Impact:** Hard to update styles, possible conflicts  
**Action:** Standardize on 1 approach (recommend SCSS)  
**Effort:** 3 days  

---

## 🟡 MEDIUM PRIORITY ISSUES

### 9. Any Types (50+ instances)
**Examples:**
- `const [data, setData] = useState<any>([]);`
- `const handleClick = (evt: any) => {...}`

**Risk Level:** MEDIUM - lose type safety  
**Action:** Replace with proper types  
**Effort:** 1 day  

### 10. Incomplete Hooks
**File:** `src/api/GlobalHooks.tsx`  
**Issue:** `useDebounce()` is empty (just `function useDebounce() { }`)  
**Risk Level:** LOW - hook never used  
**Action:** Implement or delete  
**Effort:** 1 hour  

### 11. Socket Initialization at Module Load
**File:** `src/redux/slices/globalSlice.ts` (line 98)  
**Issue:** Socket connects immediately when app loads  
**Risk Level:** MEDIUM - socket always active, wastes resources  
**Impact:** Socket connection even if user not authenticated yet  
**Action:** Lazy load socket after successful login  
**Effort:** 4 hours  

### 12. Missing Input Validation
**Found in:** Multiple form components  
**Risk Level:** MEDIUM - bad data sent to server  
**Impact:** Database inconsistency, security issues  
**Action:** Add validation layer in form hooks  
**Effort:** 2 days  

### 13. No i18n (Internationalization)
**Files:** Throughout (Vietnamese strings hard-coded)  
**Risk Level:** LOW - bad for multi-language apps  
**Impact:** Can't easily support multiple languages  
**Action:** Extract strings to i18n system (future task)  
**Effort:** Not in current refactor phase  

---

## 🟢 LOW PRIORITY ISSUES (Polish)

### 14. Naming Conventions Inconsistent
**Examples:**
- `QLSXPLAN`, `QLSX_PLAN`, `qlsx_plan` (all refer to same thing)
- `WORK_SHIF_NAME` (typo - should be SHIFT)
- `f_insert_YCTK` (unclear prefix meaning)
- `useCalc`, `use_f_` mixing conventions

**Risk Level:** LOW - affects readability, not functionality  
**Action:** Standardize naming (PascalCase components, camelCase hooks, UPPER_SNAKE_CASE constants)  
**Effort:** 2 days  

### 15. Missing JSDoc/Comments
**Files:** Most components (200+ files)  
**Issue:** Functions undocumented, unclear purpose  
**Risk Level:** LOW - affects onboarding  
**Action:** Add JSDoc to components (future task)  
**Effort:** Not critical for current phase  

### 16. Prop Drilling
**Found in:** Pages with nested component hierarchies  
**Issue:** Props passed through 4-5 levels of components  
**Risk Level:** LOW - performance impact minimal  
**Action:** Use Context API or Redux for deeply nested props  
**Effort:** 1 day (if needed)  

### 17. Heavy Dependencies
**Found:**
- 3x table libraries (ag-grid, devextreme, material-react-table)
- 2x Excel libraries (xlsx, xlsx-populate)
- 60+ total production dependencies

**Risk Level:** LOW - maintenance burden, not immediate concern  
**Action:** Document in audit, remove non-critical ones later  
**Effort:** 1 day (audit only)  

---

## 📊 ISSUE DISTRIBUTION

| Severity | Count | Total Days to Fix |
|----------|-------|------------------|
| 🔴 Critical | 4 | 5 days |
| 🟠 High | 5 | 7 days |
| 🟡 Medium | 5 | 4 days |
| 🟢 Low | 4 | 3 days |
| **TOTAL** | **18** | **~19 days** |

**Realistic Timeline:** 2.5-3 weeks (buffer for testing, blockers)

---

## 📁 FILE HEALTH SCORECARD

| Aspect | Score | Notes |
|--------|-------|-------|
| **Type Safety** | 3/10 | 50+ `any` types, duplicate interfaces |
| **Component Organization** | 4/10 | Large components, mixed responsibilities |
| **State Management** | 2/10 | Single massive slice, no clear structure |
| **Error Handling** | 2/10 | Generic catch-alls, no error classification |
| **Code Duplication** | 4/10 | Placeholders, user data duplicated |
| **Naming Consistency** | 5/10 | Mix of conventions (camelCase, PascalCase, snake_case) |
| **Performance** | 6/10 | No memoization, socket always on, all state in Redux |
| **Configuration** | 3/10 | Hard-coded URLs, ports, CMS info |
| **Documentation** | 2/10 | No JSDoc, no comment explaining complex logic |
| **Testing** | 0/10 | No unit tests found |

**Overall Score:** 3.1/10 (needs refactoring) → Target: 7-8/10 after refactor

---

## 🎯 REFACTOR IMPACT PREDICTION

### Before Refactor
- 📊 Codebase Health: 3/10
- ⏱️ Time to add feature: ~1-2 days
- 🐛 Bug detection: Delayed (complex code)
- 🔧 Maintenance: High effort

### After Refactor (Estimated)
- 📊 Codebase Health: 7-8/10
- ⏱️ Time to add feature: ~2-4 hours
- 🐛 Bug detection: Immediate (clear errors)
- 🔧 Maintenance: Low effort

### Metrics to Track
- Lines of code per component (target < 200)
- Type coverage (target > 95%)
- Error handling coverage (target 100%)
- Component re-render optimization (track with Profiler)
- Bundle size (ensure not increased)

---

## ✅ NEXT STEPS

1. **Review this summary** - Understand 18 issues found
2. **Read detailed plan** - See full refactor strategy
3. **Start Phase 1, Day 1** - Begin with type consolidation
4. **Commit daily** - Keep momentum, build confidence
5. **Test continuously** - Use verification checklist
6. **Track blockers** - Document issues as they arise

**Target:** Complete all 4 phases in 2.5 weeks, then deploy with confidence!

---

**Document Version:** 1.0  
**Prepared:** 2026-03-25  
**For:** CMS ERP2 React Codebase Refactor
