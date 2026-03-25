---
trigger: model_decision
description: When refactoring something, consider the following rule
---

# AI REFACTOR RULES - SOLID SAFE MODE

## GENERAL RULES
- Do NOT change existing behavior
- Do NOT remove existing functions unless confirmed unused
- Do NOT break API contracts
- Preserve backward compatibility at all times
- Refactor in small incremental steps only
- If file is too large, split before refactoring

## FILE SIZE RULES
- If file > 500 lines: split into smaller modules before refactor
- Class should be <= 200 lines
- Method should be <= 30 lines
- Each method must do ONLY ONE thing

## SOLID RULES

### S - Single Responsibility
- One class = one responsibility
- Separate:
  - business logic
  - data access
  - validation
  - mapping
- Do NOT mix multiple concerns in one class

### O - Open/Closed
- Do NOT modify existing classes to add new behavior
- Use:
  - interfaces
  - strategy pattern
  - polymorphism
- Replace conditionals (if/else or switch) with polymorphism when applicable

### L - Liskov Substitution
- Child classes must be fully replaceable for parent classes
- Do NOT override methods with incompatible behavior
- Do NOT throw errors in overridden methods unless base allows it

### I - Interface Segregation
- Do NOT create large interfaces
- Split interfaces by responsibility
- Clients should only depend on methods they use

### D - Dependency Inversion
- Depend on abstractions, not concrete classes
- Use interfaces for dependencies
- Use constructor injection

## SAFETY RULES (CRITICAL)
- Before refactor:
  - List all existing functions
- After refactor:
  - Ensure NO function is missing
  - Ensure signatures are unchanged unless required
- Ensure logic behavior is identical

## CONTEXT CONTROL
- If file is large:
  - Summarize structure first
  - Identify dependencies
  - Refactor in parts
- Do NOT rewrite entire file unless explicitly requested

## STEP-BY-STEP PROCESS
1. Analyze code
2. Identify responsibilities
3. Detect SOLID violations
4. Propose refactor plan
5. Refactor step-by-step:
   - Extract method
   - Extract class
   - Introduce interface
6. Validate after each step

## FORBIDDEN ACTIONS
- Do NOT rename variables massively
- Do NOT change folder structure unnecessarily
- Do NOT modify database schema
- Do NOT change API request/response format

## NAMING RULES
- Use clear, explicit names:
  - UserService
  - UserRepository
  - UserValidator
- Avoid generic names:
  - Helper
  - Util
  - Common

## VALIDATION
- Code must compile
- Must pass TypeScript check:
  tsc --noEmit

## AI BEHAVIOR RULES
- If unsure: ask for clarification
- If missing context: request additional files
- Do NOT assume missing logic
- Always preserve existing behavior

## OUTPUT REQUIREMENTS
- Provide step-by-step explanation
- Then provide updated code
- Do NOT skip steps