# Kanban MVP - Plan

Single-board Kanban web app. Client-rendered Next.js in `frontend/`, no persistence, no auth. Priority: slick UI, minimal features.

## Stack

- Next.js 16 (App Router, TypeScript, `"use client"` board), React 19
- Tailwind CSS 4 (color scheme as CSS theme tokens)
- @dnd-kit/core + @dnd-kit/sortable for drag and drop
- Vitest + React Testing Library for unit/component tests
- Playwright for integration tests

## Architecture

- `src/lib/board.ts` - types (`Card`, `Column`, `Board`) and pure functions: `renameColumn`, `addCard`, `deleteCard`, `moveCard`. All state changes go through these.
- `src/lib/seed.ts` - dummy data: 5 columns (Backlog, To Do, In Progress, Review, Done), ~10 cards.
- `src/components/Board.tsx` - holds state (`useState`), DnD context, renders columns.
- `src/components/Column.tsx` - editable title, sortable card list, add-card form.
- `src/components/Card.tsx` - title, details, delete button, draggable.
- `src/app/page.tsx` - renders `<Board />`.

## Phases

### Phase 1 - Scaffolding
- [x] `create-next-app` in `frontend/` (TS, Tailwind, ESLint, App Router, `src/`)
- [x] Root `.gitignore` (node_modules, .next, test-results, playwright-report, .env*)
- [x] Install dnd-kit, Vitest, RTL, jsdom, Playwright
- [x] Scripts: `dev`, `build`, `lint`, `test`, `test:e2e`
- [x] Theme tokens for the 5 brand colors in `globals.css`
- Success: `npm run dev` serves a page, `npm run build`, `lint`, `test` all pass on a trivial test

### Phase 2 - Board logic (TDD)
- [x] Types and seed data
- [x] Pure functions in `board.ts` with unit tests: rename, add, delete, move within column, move across columns, move into empty column
- Success: all unit tests pass, 100% coverage of `board.ts`

### Phase 3 - UI
- [x] Board layout: 5 columns side by side, header with app title, horizontal scroll on narrow screens
- [x] Column: inline rename (click title, Enter/blur saves, Escape cancels), card count
- [x] Card: title + details, delete on hover
- [x] Add card: inline form at column bottom (title required, details optional)
- [x] Polish: yellow accent lines, navy headings, purple submit buttons, gray labels, soft shadows, smooth transitions
- [x] Component tests: renders seed data, rename column, add card, delete card, empty title rejected
- Success: tests pass, app opens with dummy data, looks clean and professional at desktop and laptop widths

### Phase 4 - Drag and drop
- [x] DndContext with pointer + keyboard sensors, sortable cards, droppable columns (incl. empty)
- [x] Drag overlay with lifted card styling
- Success: cards reorder within a column and move between columns, including into an empty column

### Phase 5 - Integration testing (Playwright)
- [x] Page loads with 5 columns and seed cards
- [x] Rename a column
- [x] Add a card, delete a card
- [x] Drag a card within a column and to another column
- [x] Fix any defects found
- Success: full e2e suite green, `build` and `lint` clean, no console errors

### Phase 6 - Finish
- [x] Minimal README in `frontend/` (run, test)
- [x] Dev server running and ready for the user
- Success: all criteria above checked off
