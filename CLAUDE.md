# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Đạo Tổ Tu Tiên" — a Vietnamese-language idle/incremental cultivation (tu tiên) RPG. Single-page React app, **client-only**: there is no backend. All game state lives in the browser and is persisted to `localStorage`. All user-facing text is Vietnamese.

## Commands

```bash
npm run dev      # Vite dev server on http://localhost:4200
npm run build    # tsc -b (typecheck) then vite build
npm run preview  # serve the production build
```

There is no test runner, linter, or formatter configured. `npm run build` is the only verification gate — it runs `tsc -b`, so type errors fail the build. `tsconfig.json` enables `strict`, `noUnusedLocals`, and `noUnusedParameters`, so unused imports/vars break the build too.

Import alias: `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts` — keep them in sync).

## Architecture

The codebase deliberately separates **pure game logic** from **React state** from **UI**. Respect these boundaries:

- **`src/data/`** — static game content as plain TS constants/tables (realms, dungeons, bosses, arena opponents, tower floors, quests, item templates, leaderboard). Pure data + small lookup helpers. No React, no mutation.
- **`src/systems/`** — pure game-logic functions. Each takes a `Player` (or relevant data) and returns a new `Player`/result object; **never mutates** and **never touches the store**. Examples: `cultivation.ts` (breakthrough/tick), `combat.ts` (battle simulation), `offline.ts`, `inventory.ts`, `equipment.ts`, `quest.ts`, `towerAuto.ts`, `player.ts` (character factory). Results commonly use a discriminated shape like `{ success: true, player, message } | { success: false, reason }` or `{ player, error? }`.
- **`src/utils/stats.ts`** — derived-stat computation: `calcStats` (base + element + equipment), `calcCombatPower` (the "lực chiến" power number), `calcDisplayStats`, `getStatPowerMultiplier`. This is the single source of truth for how stats and combat power are derived from a `Player`.
- **`src/stores/gameStore.ts`** — the **only** Zustand store and the single bridge between systems and UI. It holds `GameSave` plus transient UI fields (`toastMessage`, `breakthroughMessage`, `_hydrated`). Every store action follows the same pattern: read `player` from state → call a `systems/` function → on error set a toast, on success `set({ player: ... })`. Most success paths wrap the new player in `syncQuestProgress(...)` so quest counters stay current.
- **`src/components/`** — reusable UI. Import shared components from the barrel `@/components` (`src/components/index.ts`), not deep paths. `common/` = generic widgets, `game/` = cultivation/battle-specific visuals, `header/` & `navigation/` = chrome, `routing/` & `layout/` = shells.
- **`src/pages/`** — one component per route; composes components + store actions.

### Persistence & hydration

The store uses Zustand's `persist` middleware (key `dao-to-tu-tien-save`). `partialize` controls exactly which fields are saved — **if you add a field to `GameSave` that must survive reload, add it to both `initialSave` and the `partialize` list**, and add a migration default in `onRehydrateStorage` for existing saves. `onRehydrateStorage` also recomputes `player.stats` via `calcStats` on load (stats are never trusted from storage) and triggers offline-reward calculation.

Because hydration is async, `App.tsx`'s `HydrationGate` blocks rendering until `_hydrated` is true, then runs `checkOfflineOnLoad()`. `ProtectedRoute` enforces the create-character gate (`hasCharacter`). Routes are wrapped as `GameRoute` = `ProtectedRoute` + `GameShell`.

### Game loop

`useGameTick` (in `GameShell`, active only when `hasCharacter`) calls `store.tick(deltaMs)` every 100ms. `tick` handles daily reset, idle auto-cultivation (accumulating `cultivation` toward the breakthrough cost), and a dev "fast breakthrough" mode (`devFastBreakthrough`, on by default in DEV) that auto-breaks-through once per second. Offline progress is computed separately from `lastOnlineAt` on load.

### Progression model (data/realms.ts)

Player level = `realmId` (0..12, the `REALMS` table) × `tier` (1..maxTier within a realm). Breakthrough advances tier, then rolls over to the next realm. Costs (`getBreakthroughCost`), cultivation rate (`getCultivationRate`, element-modified), and power scaling (`getRealmPowerScale`, `getRealmGapMultiplier`) all grow exponentially with realm/tier — these functions are the balance knobs for the whole game.

### Battle modes

`canStartBattle(mode, targetId, towerFloor?)` validates (realm requirement, daily limits in `dailyCounters`) and returns an error string or `null`; `resolveBattle(...)` applies rewards and increments counters. Modes: `dungeon`, `boss`, `arena`, `tower`. Combat outcome is probabilistic (`systems/combat.ts` `simulateBattle` / `simulateFullBattle`) based on relative combat power. The tower additionally supports `autoClimbTower()` which loops `simulateTowerFloor` + `resolveBattle` until defeat or max floor.

## Conventions

- Keep new game logic in `systems/` as pure functions; the store only orchestrates and sets state. Don't put rule logic in components or in the store body.
- User-visible strings are Vietnamese — match existing tone (e.g. toast/error messages returned from systems).
- Styling is plain CSS files in `src/styles/`, each imported once in `src/main.tsx`, using CSS custom properties (design tokens) from `src/styles/tokens.css`. Inline `style={{...}}` is used freely for one-offs.
