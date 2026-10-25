# StaticMaps Vite+ Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the StaticMaps monorepo to Vite+ 1.4 (Vite 8 / Vitest 5 / Oxlint / Oxfmt), publish all three libraries as ESM-only, upgrade SvelteKit to 3 with Svelte 5 runes, and pin Node 24.22.1.

**Architecture:** Six ordered phases: (1) isolate and pin, (2) bump all framework/tooling versions with plain Vite/Vitest, (3) rewrite the SvelteKit app for Kit 3, (4) run `vp migrate` while ESLint/Prettier still exist so lint/format migrate, (5) convert library builds to `vp pack` ESM-only, (6) clean up root tooling/CI and verify. Each phase ends in a green, committed state.

**Tech Stack:** pnpm 12.15.0, Vite+ 1.4.0 (Vite 8.3 core, Vitest 5.0.5), TypeScript 6.0.3, React 19.3.1, Vue 3.5.44, Svelte 5.57.2 + SvelteKit 3.1.0, tsdown 0.23 (via `vp pack`), Oxlint/Oxfmt.

**Spec:** `docs/superpowers/specs/2026-10-25-vite-plus-migration-design.md`

## Global Constraints

- Node `24.22.1` (`.node-version`, `.nvmrc`, CI); `engines.node: ">=24.11.0"`.
- pnpm `12.15.0` via `packageManager`.
- TypeScript `6.0.3` everywhere; `module: "ESNext"`, `moduleResolution: "Bundler"`.
- Vite+ `1.4.0`; Vitest `5.0.5`; `@vitest/coverage-v8` `5.0.5`.
- Library output is **ESM only**: `dist/index.js` + `dist/index.d.ts`. No CJS/UMD/IIFE, no `main`/`unpkg`/`esmodule`/`umd:main`.
- Do not enable TypeScript `strict`; do not change public APIs or demo content.
- SvelteKit 3 config lives only in `vite.config.ts`; `svelte.config.js` must not exist.
- `packages/svelte` keeps upstream `vite@8.3.5`; no workspace `vite` override.
- Run `vp migrate` before adding `pack` blocks, while `.prettierrc` and `packages/svelte/.eslintrc.cjs` still exist.

## Review Focus

1. A consumer doing `require('@staticmaps/core')` or loading the old UMD/IIFE script: now fails because output is ESM only. Expected and documented; task 5 asserts the old files/fields are gone.
2. Importing `#lib` from a `.svelte` file in the demo: SvelteKit 3 removed `$lib`; a missing `imports` entry or wrong extension breaks dev/build. Task 3 pins this.
3. Running the Svelte app when `vite` resolves to the Vite+ core alias: Kit 3 requires `vite@^8.0.12@DataStream`; peer mismatch can crash. Task 4 keeps upstream `vite` for that package and validates `vp dev`.
4. `vp test` on a clean checkout before core is built: React/Vue tests import `@staticmaps/core`, whose exports point at `dist`. Root test/CI must build core first. Task 6 pins this.
5. Playwright in CI without browsers installed: CI must install Chromium and must fail if e2e is skipped. Task 6 pins this.

---

### Task 1: Isolate the workspaces and pin runtimes

**Files:**

- Create: `.node-version`, `.nvmrc`
- Modify: `package.json` (root)
- Modify: `packages/svelte/.npmrc`

**Interfaces:**

- Consumes: nothing.
- Produces: `engines.node = ">=24.11.0"`, `packageManager = "pnpm@12.15.0"`; exact Node pin readable by Vite+ (`vp env`) and CI.

- [ ] **Step 1: Create the isolation branch/worktree**

Use the `superpowers:using-git-worktrees` skill, or from the repo root:

```bash
git switch -c chore/vite-plus-migration
```

Expected: `git status --short` is empty (only the committed design doc may be untracked; commit it first with `docs: add Vite+ migration design`).

- [ ] **Step 2: Record the baseline**

Run:

```bash
node -v
pnpm -v
pnpm -r exec node -e "console.log(process.env.npm_package_name)"
```

Expected: Node `v24.21.x` (local) or newer, pnpm `12.15.0`, four package names. Do not attempt a build yet; the 2022 toolchain is not expected to run on Node 24. Save the output in the task notes.

- [ ] **Step 3: Pin Node and pnpm**

Write `.node-version` and `.nvmrc` with exactly `24.22.1`.

In root `package.json` add:

```json
"packageManager": "pnpm@12.15.0",
"engines": { "node": ">=24.11.0" }
```

Keep the existing `"type": "module"`, `private`, `license`, `author` fields.

- [ ] **Step 4: Relax the package-level engine gate**

`packages/svelte/.npmrc` currently sets `engine-strict=true`. Keep it, but confirm installs pass with the local Node (24.21 satisfies `>=24.11`). If pnpm refuses on a machine below 24.11, delete the file rather than lowering `engines`.

- [ ] **Step 5: Verify**

Run:

```bash
cat .node-version .nvmrc
node -e "const p=require('./package.json'); console.log(p.packageManager, p.engines.node)"
```

Expected: two lines `24.22.1`, then `pnpm@12.15.0 >=24.11.0`.

- [ ] **Step 6: Commit**

```bash
git add .node-version .nvmrc package.json packages/svelte/.npmrc
git commit -m "chore: pin node 24.22.1 and pnpm 12.15.0"
```

---

### Task 2: Bump dependencies and modernize unit tests

**Files:**

- Modify: `package.json` (root), `tsconfig.json`
- Modify: `packages/core/{package.json,tsconfig.json,vite.config.ts}`
- Modify: `packages/react/{package.json,tsconfig.json,vite.config.ts}`
- Modify: `packages/vue/{package.json,tsconfig.json,vite.config.ts}`
- Modify: `packages/core/tests/*.spec.ts`, `packages/react/src/StaticMap.spec.tsx`, `packages/vue/src/StaticMap.spec.ts`
- Modify: `packages/svelte/package.json`

**Interfaces:**

- Consumes: Task 1 pins.
- Produces: all packages installable on Node 24 with Vite 8 / Vitest 5; test scripts runnable per package; configs still import `defineConfig` from `vitest/config` (so `vp migrate` can rewrite them in Task 4).

- [ ] **Step 1: Write the failing check**

Run:

```bash
pnpm -C packages/core exec vitest --version
```

Expected: fails (vitest 0.9 is installed or install fails on Node 24). This is the baseline the task fixes.

- [ ] **Step 2: Update the root manifest**

Root `devDependencies` become:

```json
{
  "@types/node": "26.6.5",
  "typescript": "6.0.3"
}
```

Leave ESLint/Prettier dependencies in `packages/svelte` untouched for now (Task 4 migrates them). Keep the root scripts as-is until Task 6.

- [ ] **Step 3: Update the base tsconfig**

In root `tsconfig.json`, set these options and delete the commented placeholder block:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "noEmit": true
  }
}
```

Do not add `"strict": true`.

- [ ] **Step 4: Update core**

`packages/core/package.json` devDependencies:

```json
{
  "@types/node": "26.6.5",
  "@vitest/coverage-v8": "5.0.5",
  "typescript": "6.0.3",
  "vite": "8.3.5",
  "vite-plugin-dts": "5.1.2",
  "vitest": "5.0.5"
}
```

Remove `c8`, `prettier`. Keep `vite-plugin-dts` and `build.lib` until Task 5.

`packages/core/tsconfig.json`: keep `"extends": "../../tsconfig.json"`, `"include": ["src", "tests"]`, remove `"moduleResolution": "node"`.

`packages/core/vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
```

Replace `__dirname` with `dirname`, set `build.minify: true`, delete `terserOptions`, keep the four formats for now, and add:

```ts
test: {
  environment: 'node',
  coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
},
```

- [ ] **Step 5: Update React**

`packages/react/package.json`:

- `dependencies`: `{ "@staticmaps/core": "workspace:*" }`
- `peerDependencies`: `{ "react": "^18.0.0 || ^19.0.0" }`
- `devDependencies`:

```json
{
  "@testing-library/dom": "10.4.2",
  "@testing-library/jest-dom": "7.0.1",
  "@testing-library/react": "16.3.3",
  "@types/node": "26.6.5",
  "@types/react": "19.3.0",
  "@types/react-dom": "19.3.0",
  "@vitejs/plugin-react": "6.1.2",
  "@vitest/coverage-v8": "5.0.5",
  "jsdom": "30.1.3",
  "react": "19.3.1",
  "react-dom": "19.3.1",
  "typescript": "6.0.3",
  "vite": "8.3.5",
  "vite-plugin-dts": "5.1.2",
  "vitest": "5.0.5"
}
```

Remove `c8`, `prettier`. Keep `@vitejs/plugin-react`'s `jsxRuntime: 'classic'` for now (the component imports React explicitly).

`packages/react/tsconfig.json`: remove `moduleResolution: "Node"` (inherits Bundler).

`packages/react/vite.config.ts`: import `defineConfig` from `vitest/config`, replace the `/// <reference types="vitest" />` line, use `dirname` from `fileURLToPath`, set `minify: true`, drop `terserOptions`, and replace the `test` block with:

```ts
test: {
  environment: 'jsdom',
  coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
},
```

- [ ] **Step 6: Update Vue**

`packages/vue/package.json`:

- `dependencies`: `{ "@staticmaps/core": "workspace:*" }`
- `peerDependencies`: `{ "vue": "^3.2.0" }`
- `devDependencies`:

```json
{
  "@vitejs/plugin-vue": "6.0.10",
  "@vitest/coverage-v8": "5.0.5",
  "@vue/test-utils": "2.5.1",
  "happy-dom": "21.0.4",
  "typescript": "6.0.3",
  "vite": "8.3.5",
  "vite-plugin-dts": "5.1.2",
  "vitest": "5.0.5",
  "vue": "3.5.44"
}
```

Remove `c8`, `prettier`.

`packages/vue/tsconfig.json`: set `moduleResolution: "Bundler"`, add `"noEmit": true`. Keep demo includes.

`packages/vue/vite.config.ts`: same `defineConfig`/`dirname`/`minify` changes as React; test `environment: 'happy-dom'` plus the coverage block.

- [ ] **Step 7: Update the Svelte manifest for Kit 3**

`packages/svelte/package.json` devDependencies:

```json
{
  "@playwright/test": "1.64.1",
  "@sveltejs/adapter-auto": "8.0.0",
  "@sveltejs/kit": "3.1.0",
  "@sveltejs/package": "3.0.1",
  "@sveltejs/vite-plugin-svelte": "7.3.1",
  "@tsconfig/svelte": "5.0.8",
  "sass": "1.106.1",
  "svelte": "5.57.2",
  "svelte-check": "4.7.7",
  "typescript": "6.0.3",
  "vite": "8.3.5"
}
```

Add `"@staticmaps/core": "workspace:*"` to `dependencies`. Keep `eslint`, `eslint-plugin-svelte3`, `prettier`, `prettier-plugin-svelte` in place (Task 4 migrates them, Task 6 removes them). Remove `svelte-preprocess`, `svelte2tsx`, `c8`, `@typescript-eslint/*`, `eslint-config-prettier`, `tslib`.

- [ ] **Step 8: Modernize the unit specs**

Core specs: change `from 'vitest'` imports only if TypeScript complains; keep explicit `describe/expect/it`.

React spec:

```tsx
import { expect, test } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { StaticMap } from './StaticMap';
```

Keep the existing assertions.

Vue spec: add `import { expect, test } from 'vitest';` above the existing imports.

- [ ] **Step 9: Install and run the unit suites**

Run:

```bash
pnpm install
pnpm -C packages/core test
pnpm -C packages/react test
pnpm -C packages/vue test
```

Expected: install succeeds; three suites pass. React/Vue fail with `Cannot find package '@staticmaps/core'` because its `dist` does not exist. Build core once (`pnpm -C packages/core build`) and re-run. Snapshot differences caused by React 19 / Vue 3.5 are updated with `-u` only after inspecting the diff.

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json packages/core packages/react packages/vue packages/svelte/package.json
git commit -m "chore(deps): upgrade toolchain and frameworks to latest"
```

---

### Task 3: Port the Svelte app to SvelteKit 3 + Svelte 5

**Files:**

- Delete: `packages/svelte/svelte.config.js`
- Create: `packages/svelte/vite.config.ts`
- Modify: `packages/svelte/package.json`, `packages/svelte/tsconfig.json`, `packages/svelte/src/app.html`, `packages/svelte/src/app.d.ts`
- Create: `packages/svelte/src/routes/+layout.svelte`, `packages/svelte/src/routes/+page.svelte`, `packages/svelte/src/routes/{polygon,linestring,server-side}/+page.svelte`, `packages/svelte/src/routes/server-side/+page.ts`
- Delete: `packages/svelte/src/routes/__layout.svelte`, `index.svelte`, `polygon.svelte`, `linestring.svelte`, `server-side.svelte`
- Modify: `packages/svelte/src/lib/StaticMap.svelte`
- Modify: `packages/svelte/playwright.config.js`, `packages/svelte/tests/test.mjs`

**Interfaces:**

- Consumes: `@staticmaps/core` workspace package.
- Produces: SvelteKit 3 app with `#lib` subpath imports; `build` emits library output to `dist/` via `svelte-package`; `build:demo` emits the app; `test:e2e` runs Playwright against port 4173.

- [ ] **Step 1: Write the failing check**

Run:

```bash
pnpm -C packages/svelte build
```

Expected: fails because `svelte-kit package` no longer exists in Kit 3 / the old script targets a removed command.

- [ ] **Step 2: Add Kit 3 config to Vite and delete `svelte.config.js`**

`packages/svelte/vite.config.ts`:

```ts
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit({ adapter: adapter(), preprocess: vitePreprocess() })],
});
```

Delete `packages/svelte/svelte.config.js`.

- [ ] **Step 3: Update the Svelte package metadata and scripts**

`packages/svelte/package.json` add:

```json
"imports": {
  "#lib": "./src/lib/index.ts",
  "#lib/*": "./src/lib/*"
},
"exports": {
  ".": {
    "types": "./dist/index.d.ts",
    "svelte": "./dist/index.js",
    "default": "./dist/index.js"
  }
},
"files": ["dist"],
"peerDependencies": { "svelte": "^5.57.2" }
```

Scripts become:

```json
{
  "dev": "vite dev",
  "build": "svelte-package -i src/lib -o dist",
  "build:demo": "vite build",
  "preview": "vite preview",
  "prepare": "svelte-kit sync",
  "test:e2e": "playwright test",
  "check": "svelte-check --tsconfig ./tsconfig.json",
  "check:watch": "svelte-check --tsconfig ./tsconfig.json --watch"
}
```

Delete `lint` and `format` scripts (Task 6 provides root-level `vp lint`/`vp fmt`).

- [ ] **Step 4: Update the Svelte tsconfig and app template**

`packages/svelte/tsconfig.json`:

```json
{
  "extends": "$app/tsconfig",
  "include": ["src/**/*.ts", "src/**/*.svelte", "vite.config.ts"],
  "exclude": []
}
```

`src/app.html`: replace `%svelte.assets%`, `%svelte.head%`, `%svelte.body%` with `%sveltekit.assets%`, `%sveltekit.head%`, `%sveltekit.body%`. Wrap the body placeholder in `<div style="display: contents">` only if SvelteKit warns; otherwise leave as-is.

`src/app.d.ts` becomes:

```ts
declare namespace App {}
```

- [ ] **Step 5: Rewrite the layout**

`src/routes/+layout.svelte`:

```svelte
<script lang="ts">
  import '../style.scss';
  let { children } = $props();
</script>
```

Keep the existing header/aside/nav markup, replace `<slot />` with `{@render children()}`, and remove the `<style lang="scss">` block that only imported `../style.scss`.

- [ ] **Step 6: Rewrite the home page**

`src/routes/+page.svelte`: move the content of `index.svelte`, change imports to `#lib` and `#lib/StaticMap.svelte`, convert `let count = 0;` / `let width = 180;` to `let count = $state(0); let width = $state(180);`, and replace `on:click` with `onclick`.

- [ ] **Step 7: Move the remaining routes**

- `polygon.svelte` → `polygon/+page.svelte`; import `#lib/StaticMap.svelte`; update the GitHub link to `packages/svelte/src/routes/polygon/+page.svelte`.
- `linestring.svelte` → `linestring/+page.svelte`; same import/link updates.
- `server-side.svelte` → `server-side/+page.svelte` with imports updated; remove the `context="module"` block.
- Create `server-side/+page.ts`:

```ts
export const prerender = true;
export const csr = false;
```

- [ ] **Step 8: Rewrite `StaticMap.svelte` with runes**

`src/lib/StaticMap.svelte` script:

```svelte
<script lang="ts">
  import { createStaticMap, type StaticMapOptions } from '@staticmaps/core';

  let { options }: { options: StaticMapOptions } = $props();
  const state = $derived(createStaticMap(options));
</script>
```

Use `state.width`, `state.height`, `state.viewBox`, `state.tiles`, etc. in the template. Import `dashedKeys` from `@staticmaps/core` as before. Keep markup and styles unchanged.

- [ ] **Step 9: Modernize Playwright**

`playwright.config.js`:

```js
export default {
  testDir: 'tests',
  webServer: {
    command: 'pnpm run build:demo && pnpm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://localhost:4173' },
};
```

Keep the existing assertion; navigate with `page.goto('/')`.

- [ ] **Step 10: Verify**

```bash
pnpm -C packages/svelte check
pnpm -C packages/svelte build
ls packages/svelte/dist
pnpm -C packages/svelte build:demo
```

Expected: `svelte-check` reports 0 errors; `dist/index.js`, `dist/index.d.ts`, `dist/StaticMap.svelte` exist; demo build succeeds. Then run the e2e smoke against the preview (`pnpm -C packages/svelte exec playwright test`); expected PASS.

- [ ] **Step 11: Commit**

```bash
git add packages/svelte
git commit -m "feat(svelte): migrate to sveltekit 3 and svelte 5 runes"
```

---

### Task 4: Run `vp migrate` and review its lint/format migration

**Files:**

- Modify: every `package.json`, every `vite.config.ts`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- Create/modify: root `vite.config.ts`
- Modify: `.gitignore` if migration adds ignore entries

**Interfaces:**

- Consumes: a workspace that installs on Vite 8 / Vitest 5, with `.prettierrc` and `packages/svelte/.eslintrc.cjs` still present.
- Produces: `vite-plus@1.4.0` in the packages, `vp` scripts, `vite-plus/test` imports, root `lint`/`fmt` blocks, ESLint/Prettier no longer used by scripts.

- [ ] **Step 1: Confirm the preconditions**

Run:

```bash
ls .prettierrc packages/svelte/.prettierrc packages/svelte/.eslintrc.cjs
pnpm exec vite --version
pgrep -f 'vite-plus' || true
```

Expected: all three config files exist, Vite is 8.x, no Vite+ process. `pnpm exec vitest --version` must report 5.0.5.

- [ ] **Step 2: Run the migrator**

```bash
pnpm dlx --package=vite-plus@1.4.0 vp migrate --no-interactive
```

Expected: exit 0, a review report listing changed files. If it blocks because it cannot determine the original runner, re-run with `--full`; do not downgrade dependencies.

- [ ] **Step 3: Review the dependency diff**

```bash
git diff -- package.json packages/*/package.json pnpm-workspace.yaml
```

Accept: `vite-plus` added, `vitest`/`c8` removed, `vite` imports rewritten to `vite-plus` in configs, scripts rewritten to `vp`, catalog/overrides added.

Reject/fix: any workspace override that aliases `vite` to `@voidzero-dev/vite-plus-core` (remove it) and any removal of `vite@8.3.5` from `packages/svelte` (restore it).

- [ ] **Step 4: Review the lint/format output**

```bash
cat vite.config.ts
git diff -- packages/svelte/.eslintrc.cjs .prettierrc packages/svelte/.prettierrc
```

Expected: root `vite.config.ts` has `lint` (TypeScript/correctness rules from the old ESLint config) and `fmt` (the old Prettier values: `semi`, `singleQuote`, `trailingComma: 'all'`, `printWidth: 140`, `arrowParens: 'avoid'`). If the migrator leaves either block incomplete, port the missing rules/options from the old files by hand now.

- [ ] **Step 5: Install and verify the migrated suite**

```bash
pnpm install
pnpm -C packages/core build
pnpm exec vp test run --coverage --dir packages/core
pnpm exec vp test run --coverage --dir packages/react
pnpm exec vp test run --coverage --dir packages/vue
```

Expected: all pass; test files import from `vite-plus/test`; no `vitest` imports remain in `src`/`tests` (config `defineConfig` may import from `vite-plus`).

- [ ] **Step 6: Verify the Svelte app under Vite+**

```bash
pnpm -C packages/svelte exec vp build
pnpm -C packages/svelte exec vp dev --port 5199 &
sleep 5
curl -sf http://localhost:5199/ | grep -q 'StaticMaps'
kill %1
```

Expected: build succeeds and the dev server returns the layout title. If Vite+ core conflicts with Kit 3's upstream Vite, record it and switch only this package's `dev`/`build`/`preview` scripts to `vite`, then repeat.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: migrate tooling to vite-plus (lint and format included)"
```

---

### Task 5: Convert libraries to ESM-only `vp pack`

**Files:**

- Modify: `packages/core/{package.json,vite.config.ts}`
- Modify: `packages/react/{package.json,vite.config.ts}`
- Modify: `packages/vue/{package.json,vite.config.ts}`
- Delete: no source files; remove `vite-plugin-dts` dependency

**Interfaces:**

- Consumes: Vite+ `pack` config surface from Task 4.
- Produces: `packages/<pkg>/dist/index.js` + `dist/index.d.ts`; package `exports` = `{ ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } }`; `files: ["dist"]`.

- [ ] **Step 1: Write the failing check**

Run:

```bash
test ! -f packages/core/dist/index.js && echo "no esm output"
node -e "const p=require('./packages/core/package.json'); console.log(p.main, p.unpkg)"
```

Expected: `no esm output`, and the old `main`/`unpkg` fields print. This is what the task removes.

- [ ] **Step 2: Convert core**

`packages/core/vite.config.ts` becomes:

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: 'src/index.ts',
    format: ['es'],
    platform: 'browser',
    dts: true,
    minify: true,
    clean: true,
  },
});
```

`packages/core/package.json`:

- `exports`: `{ ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } }`
- keep `"module": "./dist/index.js"`, `"types": "./dist/index.d.ts"`
- remove `main`, `unpkg`, `esmodule`, `umd:main`
- add `"files": ["dist"]`
- remove `vite-plugin-dts` from devDependencies

- [ ] **Step 3: Convert React**

Same `pack` block, plus externals metadata:

```ts
pack: {
  entry: 'src/index.ts',
  format: ['es'],
  platform: 'browser',
  dts: true,
  minify: true,
  clean: true,
},
```

React and `@staticmaps/core` are already in `peerDependencies`/`dependencies`, so tsdown externalizes them. Apply the same `exports`/`files`/field removals as core, and remove `vite-plugin-dts`.

- [ ] **Step 4: Convert Vue**

Same as React, with the Vue externals already declared. Apply the same metadata changes and remove `vite-plugin-dts`.

- [ ] **Step 5: Build and inspect**

```bash
pnpm -C packages/core pack
pnpm -C packages/react pack
pnpm -C packages/vue pack
find packages/core/dist packages/react/dist packages/vue/dist -maxdepth 1 -type f | sort
```

Expected: each `dist` contains `index.js` and `index.d.ts` (plus maps if generated); no `index.cjs.js`, `index.umd.js`, or `index.iife.js`.

- [ ] **Step 6: Re-run unit tests against the built packages**

```bash
pnpm -C packages/core test
pnpm -C packages/react test
pnpm -C packages/vue test
```

Expected: pass, including snapshots.

- [ ] **Step 7: Commit**

```bash
git add packages/core packages/react packages/vue
git commit -m "build: emit esm-only packages with vp pack"
```

---

### Task 6: Finish root tooling, CI, and remove dead configs

**Files:**

- Modify: `package.json` (root), `vite.config.ts` (root), `pnpm-workspace.yaml`, `.gitignore`, `.vscode/*`
- Delete: `.prettierrc`, `packages/svelte/.prettierrc`, `packages/svelte/.eslintrc.cjs`
- Create: `.github/workflows/ci.yml`
- Modify: `.github/workflows/codeql-analysis.yml`

**Interfaces:**

- Consumes: `lint`/`fmt` blocks produced in Task 4; ESM outputs from Task 5.
- Produces: root scripts `check`, `lint`, `fmt`, `test`, `test:e2e`, `build`, `build:ci`; CI that runs all of them on Node 24.22.1.

- [ ] **Step 1: Write the failing check**

```bash
pnpm exec vp check
```

Expected: fails while `vite.config.ts` still lacks final `lint`/`fmt` coverage and old configs conflict.

- [ ] **Step 2: Finalize root scripts**

```json
{
  "build": "vp run -r build",
  "build:ci": "pnpm install --frozen-lockfile && vp run -r build && vp -C packages/svelte build:demo",
  "check": "vp check",
  "lint": "vp lint",
  "fmt": "vp fmt . --write",
  "test": "vp -C packages/core build && vp run -r test",
  "test:e2e": "vp -C packages/svelte build:demo && vp -C packages/svelte exec playwright test"
}
```

Note: `vp run -r test` runs only packages that define `test` (core/react/vue); Svelte defines `test:e2e`, so the unit run skips it.

- [ ] **Step 3: Add the workspace catalog**

In `pnpm-workspace.yaml`, keep the existing package globs and add a catalog plus only-built dependencies if pnpm reports ignored build scripts:

```yaml
catalog:
  vite-plus: 1.4.0
  typescript: 6.0.3
  '@vitest/coverage-v8': 5.0.5
```

Use `catalog:` references in package manifests only if `vp migrate` already introduced them; otherwise leave concrete versions. Do not add a `vite` override.

- [ ] **Step 4: Remove dead configs and dependencies**

Delete `.prettierrc`, `packages/svelte/.prettierrc`, `packages/svelte/.eslintrc.cjs`. Remove from `packages/svelte/package.json`: `eslint`, `@typescript-eslint/*`, `eslint-config-prettier`, `eslint-plugin-svelte3`, `prettier`, `prettier-plugin-svelte`. Remove any `prettier`/`c8`/`vite-plugin-dts` references elsewhere.

- [ ] **Step 5: Update `.vscode` and ignore files**

`.vscode/extensions.json` recommends `oxc.oxc-vscode`, `svelte.svelte-vscode`, `Vue.volar`, `editorconfig.editorconfig`. `.vscode/settings.json` uses Oxc as default formatter and sets `"oxc.fmt.disableNestedConfig": true`. Ensure `.gitignore` covers `coverage`, `.svelte-kit`, `.vitest`, and `dist` (already mostly present; add missing entries).

- [ ] **Step 6: Add CI**

`.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .node-version, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec vp check
      - run: pnpm test
      - run: pnpm -C packages/svelte exec playwright install --with-deps chromium
      - run: pnpm test:e2e
```

`vp` is available through the root `vite-plus` devDependency, so CI invokes it as `pnpm exec vp`.

Update `.github/workflows/codeql-analysis.yml`: `actions/checkout@v4`, `github/codeql-action/init@v3`, `github/codeql-action/autobuild@v3`, `github/codeql-action/analyze@v3`.

- [ ] **Step 7: Verify**

```bash
pnpm install --frozen-lockfile
pnpm exec vp check
pnpm test
pnpm build
pnpm test:e2e
pnpm exec vp fmt . --check
```

Expected: every command exits 0. `vp fmt --check` reports no unformatted files after the formatter has been run once.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: finish vite-plus config, scripts, and ci"
```

---

### Task 7: Whole-branch verification and documentation

**Files:**

- Modify: `README.md`, `packages/*/README.md`
- Modify: spec/plan status line if desired

**Interfaces:**

- Consumes: all prior tasks.
- Produces: a green branch that can be merged; documentation of ESM-only output and the Node pin.

- [ ] **Step 1: Clean-room verification**

```bash
rm -rf node_modules packages/*/node_modules packages/*/dist packages/svelte/.svelte-kit
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm exec vp check
```

Expected: all pass from a clean tree.

- [ ] **Step 2: Assert the output contract**

```bash
for p in core react vue; do
  test -f packages/$p/dist/index.js || exit 1
  test -f packages/$p/dist/index.d.ts || exit 1
  test ! -e packages/$p/dist/index.cjs.js || exit 1
  node -e "const p=require('./packages/$p/package.json'); if(p.main||p.unpkg||p.umd_main) process.exit(1)"
done
```

Expected: exit 0, no old-format artifacts or fields.

- [ ] **Step 3: Run the demo smoke**

```bash
pnpm -C packages/svelte build:demo
pnpm -C packages/svelte exec playwright test
pnpm -C packages/react start --port 5181 &
sleep 3; curl -sf http://localhost:5181/ >/dev/null; kill $!
pnpm -C packages/vue exec vite --port 5182 &
sleep 3; curl -sf http://localhost:5182/ >/dev/null; kill $!
```

Expected: Playwright passes; both demo servers return 200.

- [ ] **Step 4: Update documentation**

- Root `README.md`: replace the package checklist note with a short “Development” section (`pnpm install`, `pnpm build`, `pnpm test`, `pnpm exec vp check`) and state that packages are ESM-only and require Node 24 LTS.
- `packages/svelte/README.md`: replace the generated `create-svelte` text with the same ESM/Node note and the `svelte-package` build command.
- Note the breaking ESM-only change in the root README.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "docs: document vite-plus workflow and esm-only packages"
```

---

## Plan Self-Review

- **Spec coverage:** ESM-only (Task 5), latest deps (Tasks 2–3), vp migrate + lint/format (Task 4), Vitest 5 tests (Tasks 2, 4, 5), Node LTS (Task 1), CI/verification (Tasks 6–7), SvelteKit 3 (Task 3). Covered.
- **Steps:** each task starts with a check that can fail and ends with a command whose output decides success; no placeholder steps.
- **Type/name consistency:** `dist/index.js` + `dist/index.d.ts` used consistently; scripts `test:e2e` and `build:demo` match between Tasks 3 and 6.
- **Review Focus:** each of the five risks maps to a task assertion (5 → Task 5 Step 1/6; 2 → Task 3 Steps 6–10; 3 → Task 4 Step 6; 4 → Task 6 Step 2; 5 → Task 6 Step 6).
- **Proportion:** config-heavy by nature; code bodies are omitted where the spec fixes only metadata.
