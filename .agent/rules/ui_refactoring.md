---
trigger: always_on
description: guidelines for refactoring UI components in the ERP system
---

# ERP UI Refactoring Rules

When tasked with refactoring or creating UI components in this ERP system, you MUST strictly adhere to the following guidelines:

1. **Tech Stack & Libraries:**
   - **SCSS** MUST be used for all layout, spacing, typography, and utility classes.
   - **MUI (Material UI v5)** MUST be used for complex interactive components (e.g., `Select`, `DatePicker`, `Dialog`, `Button`).
   - **EXCEPTION:** Do NOT refactor existing Table components to MUI. Keep using **AGGrid (AGTable component)** to maintain consistency and avoid breaking the massive number of existing files.
   - Do NOT mix other libraries like DevExtreme or Material React Table for new work unless strictly necessary. Default to MUI for inputs/modals and AGGrid for data-heavy tables.

2. **High-Density / Compact Design (ERP First):**
   - Optimize for maximum screen real estate. Use "dense" variants for MUI components.
   - Minimize padding and margins. Use Tailwind classes like `p-1`, `p-2`, `gap-1`, `gap-2` instead of larger defaults.
   - Keep typography compact (smaller font sizes like `text-xs` or `text-sm`) while maintaining readability.
   - Components should be as small as possible while remaining usable for high-productivity workflows.

3. **No Inline Styles:**
   - NEVER use static inline styles (e.g., `style={{ display: 'flex', width: '200px' }}`).
   - All static styling MUST be handled via TailwindCSS classes.
   - Inline styles are ONLY permitted for highly dynamic values calculated at runtime (e.g., dynamic virtualized list heights).

3. **CSS / SCSS Deprecation:**
   - DO NOT create new `.css` or `.scss` files.
   - When refactoring a component, aggressively migrate its external CSS/SCSS or `@emotion/styled` definitions into Tailwind utility classes.
   - If a styled-component is purely for layout (e.g., `const Wrapper = styled.div`), replace it with a standard HTML element and Tailwind classes.

4. **Design Tokens & Consistency:**
   - Strictly follow the MUI `ThemeProvider` for colors and typography.
   - Do NOT hardcode hex colors in Tailwind (`text-[#0b5ed7]`) if a theme alias exists (`text-primary`).

5. **Responsiveness:**
   - Adopt a mobile-first approach. 
   - Never use fixed pixel width/heights that break on smaller screens. Use relative sizing (`w-full`, `max-w-md`, `flex-1`).
   - Use standard Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`) to handle responsive layouts.
   - For wide data tables, ensure they are wrapped in a container with `overflow-x-auto`.

6. **Component Architecture (Clean Code):**
   - Keep UI components small and focused.
   - If a file exceeds 300 lines during refactoring, split it. Extract pure UI presentation into isolated components, and keep business logic (API calls, side-effects) in custom hooks or container patterns.
   - Maintain SOLID principles.

7. **Performance Optimization:**
   - Re-renders in large ERP systems are costly. Use `React.memo()` for pure UI components.
   - Use `useMemo` for derived data (like table columns or filtered lists) and `useCallback` for heavily passed-down event handlers.