# Project Guidelines

## Scope
This workspace is a Vite + React + TypeScript ERP frontend with a related Flutter mobile app.
- Web app: `src/` + `public/`
- Mobile app: `mobile_flutter/` (separate build/test toolchain)

## Build And Test
- Install: `npm install`
- Dev server: `npm run dev` (port 3001)
- Alternate dev command: `npm run start` (same as dev)
- Production build: `npm run build`
- Preview build: `npm run serve`
- Test command: `npm test` (legacy react-scripts test entry)

When changing UI behavior, run at least one successful `npm run build` before finalizing.

## Architecture Boundaries
- `src/pages/` contains feature/page composition.
- `src/components/` contains reusable UI building blocks.
- `src/api/` owns HTTP client logic and API wrappers.
- `src/redux/` owns global app state.
- `src/theme/` and style files own visual theming.

Keep API concerns in `src/api/` and avoid embedding request logic directly inside large page components when possible.

## Conventions
- Keep refactors safe: preserve current business behavior unless the task explicitly requests behavior changes.
- Prefer SOLID-style decomposition when improving code, but do not force large rewrites in unrelated files.
- Follow existing TypeScript strictness and local patterns in surrounding files.
- Respect current mixed styling stack (SCSS, styled-components, Tailwind) and avoid sweeping style-system migrations in task-scoped changes.

## Pitfalls
- Avoid reintroducing duplicated AI path prefixes in API clients (for example `/ai/ai/...`).
- This repo includes Vite + TypeScript setup but also legacy CRA test references; verify scripts before assuming tooling behavior.
- There are many large page/components; keep edits narrowly scoped and avoid opportunistic broad refactors unless requested.

## Reference Docs (Link First)
- Current implementation context: `CONTEXT.md`
- Findings and risks: `FINDINGS_SUMMARY.md`
- Bug history: `BUG_FIXES.md`
- Refactor quick guide: `QUICK_REFERENCE.md`
- Feature-specific notes: `FRONTEND_PROMPT_DISPLAY_FEATURE.md`

For mobile work, use `mobile_flutter/README.md` and Flutter-specific docs in that subproject.
