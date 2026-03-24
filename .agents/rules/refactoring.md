---
trigger: always_on
---

# AI REFACTOR RULES (SOLID SAFE MODE)

## 🎯 GOAL

Refactor code to follow SOLID principles WITHOUT breaking behavior or losing any logic.

---

## 🔒 HARD CONSTRAINTS (MUST FOLLOW)

1. DO NOT remove any business logic
2. DO NOT rename or delete public methods unless explicitly instructed
3. DO NOT refactor unrelated files
4. DO NOT assume missing code
5. If unsure → ASK instead of guessing
6. Preserve all side effects (logging, DB calls, events, validation, etc.)

---

## 📌 PRE-REFACTOR (MANDATORY)

### 1. List all affected files

Output:
Affected Files:

* fileA.ts
* fileB.ts

### 2. Build call flow

Output:
Call Flow:
Controller → Service → Repository → External API

### 3. Extract PUBLIC API (VERY IMPORTANT)

List ALL public methods BEFORE refactor:

Example:

* createUser(dto)
* updateUser(id, dto)
* deleteUser(id)

❗ These MUST still exist AFTER refactor

---

## 🧠 SOLID ANALYSIS

### Identify violations:

* S: Multiple responsibilities in one class?
* O: Using if/else instead of extensible design?
* L: Subclass breaking parent behavior?
* I: Fat interface?
* D: Direct instantiation instead of DI?

---

## 🛠️ REFACTOR STRATEGY

1. Define interfaces FIRST
2. Split responsibilities into smaller classes
3. Apply Dependency Injection
4. Replace condition logic with strategy/polymorphism if needed
5. Keep method signatures unchanged

---

## 🧾 OUTPUT FORMAT (STRICT)

### 1. Public API (Before)

(list all methods)

### 2. SOLID Issues

(explain clearly)

### 3. Refactor Plan

(step-by-step)

### 4. Code (After)

(full updated code)

### 5. Diff (MANDATORY)

```diff
- old code
+ new code
```

### 6. Logic Mapping (CRITICAL)

Map ALL old logic → new location

Example:

* validateUser() → moved to UserValidator
* DB save logic → moved to UserRepository

### 7. Missing Check

Explicitly confirm:

* No missing methods
* No missing conditions
* No missing side effects

---

## 🧪 POST-REFACTOR VALIDATION

### Generate test checklist:

* All public methods behave the same
* Edge cases preserved
* Error handling unchanged
* DB interactions unchanged

---

## 🚨 ANTI-BUG RULES

1. Never drop:

   * if conditions
   * loops
   * validations
   * try/catch
   * async/await

2. Never simplify logic unless explicitly asked

3. Never merge functions if it changes behavior

---

## 🔁 SAFE REFACTOR MODE

If code is large:

* Refactor ONE module at a time
* DO NOT refactor whole project at once

---

## 🧱 INTERFACE RULE (MANDATORY)

Always define interface before implementation:

Example:
interface IUserService {
createUser(dto): Promise<User>
}

---

## 🧯 FAIL-SAFE

If ANY of the following happens → STOP:

* Missing dependency
* Undefined function
* Incomplete context

Then ASK for more code.

---

## ✅ SUCCESS CRITERIA

Refactor is ONLY valid if:
✔ 100% logic preserved
✔ 100% public methods preserved
✔ Code follows SOLID
✔ No hallucinated code
✔ Clear mapping old → new

---

## 🔥 PRIORITY ORDER

1. Correctness (NO BUG)
2. Completeness (NO MISSING CODE)
3. Maintainability (SOLID)
4. Clean code

---

END OF RULES
