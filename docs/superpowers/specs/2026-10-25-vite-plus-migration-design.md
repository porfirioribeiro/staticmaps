# StaticMaps → Vite+ migration (design)

Date: 2026-10-25
Status: awaiting approval (rev 2 — ESM-only, lint/format migration, modern tests)

## Intent

Move the `staticmaps` monorepo onto the Vite+ toolchain, bring every dependency to its latest
compatible release (including SvelteKit 3), publish the libraries as ESM-only, and pin the Node
runtime to the latest LTS.

The repo today is a 2022-era pnpm workspace: Vite 2.9, Vitest 0.9, TS 4.6, Vue 3.2, React 18,
and SvelteKit `1.0.0-next.318` with Svelte 3. None of it builds on Node 24 without the upgrade.

## Goals

- One toolchain: `vp` for dev/build/test/lint/fmt, replacing vite, vitest, c8, ESLint, Prettier.
- **Run `vp migrate`** so ESLint and Prettier are migrated into Vite+ `lint` and `fmt` blocks.
- All dependencies on latest compatible versions (see matrix).
- **ESM-only library output**: `@staticmaps/core`, `@staticmaps/react`, `@staticmaps/vue`
  emit a single `dist/index.js` + `dist/index.d.ts`. No CJS, UMD, or IIFE builds.
- SvelteKit app upgraded to SvelteKit 3 / Svelte 5, routes and component rewritten for runes.
- Tests modernized for Vitest 5 (`vite-plus/test`, explicit imports, no legacy globals/c8).
- Node pinned to the latest LTS: 24.22.1 (Krypton).
- Every package builds, tests pass, and the Svelte demo passes its Playwright smoke test.

## Non-goals

- No new features or API changes to `@staticmaps/*`.
- Keep the repository's original `strict: true` TypeScript setting; fix any new errors rather
  than lowering strictness.
- No rewrite of demo content, styling, or snapshots beyond what the upgrades require.
- No release/version bump. ESM-only output is breaking for CJS/CDN consumers; a major bump is
  recommended but left to the release owner.

## Decisions

| Decision          | Choice                                                            | Why                                                                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript        | `6.0.3` everywhere                                                | SvelteKit 3 and `svelte-check` require `^6`; TS 7 is latest but unsupported by both.                                                                                                                                                   |
| Library output    | ESM only via `vp pack` (tsdown)                                   | Latest formats dropped by request; tsdown emits ESM + dts natively.                                                                                                                                                                    |
| Node              | `24.22.1`                                                         | Latest LTS today. Node 26 becomes LTS on 2026-10-27, after this change.                                                                                                                                                                |
| Lint/format       | Run `vp migrate`, then keep Oxlint/Oxfmt blocks                   | User requirement; Oxlint lints Svelte/Vue `<script>` blocks, Oxfmt formats Svelte/Vue.                                                                                                                                                 |
| Coverage          | `@vitest/coverage-v8@5.0.5`                                       | `c8` is unmaintained; Vitest 5 bundles the v8 provider contract.                                                                                                                                                                       |
| Vitest order      | Upgrade to Vitest 5 before `vp migrate`                           | Tests are being modernized in this change, so Vitest 4 compatibility preservation is not wanted. Suite is small (3 unit specs, 1 e2e).                                                                                                 |
| `vite` resolution | Vite+ core alias for every package (catalog + workspace override) | `vp build` refuses any other Vite (`Expected @voidzero-dev/vite-plus-core@1.4.0, but found vite@8.3.5`). Kit 3 works against the core in `vp build`/`vp dev`; the peer range mismatch is allowed explicitly via `peerDependencyRules`. |

## Approaches considered

1. **Latest deps first, then `vp migrate`, then finish framework majors (chosen).** Bring
   tooling to Vite 8 / Vitest 5 (so the migrator's preflight passes and no v4 compat shims are
   generated), run `vp migrate` while ESLint/Prettier are still present so they are migrated,
   then finish SvelteKit 3 / Svelte 5 / React 19 by hand.
2. **`vp migrate` on the current Vite 2 / Vitest 0.9 tree.** Rejected: preflight requires
   Vite 7+/Vitest 4+, and the old runner would trigger compatibility work we don't need.
3. **Manual Vite+ adoption.** Full control, but repeats script/import/catalog/lint/format
   migration that `vp migrate` performs and that the user explicitly asked to use.

## Target versions

| Area                 | Current                             | Target                                                                                                              |
| -------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Toolchain            | vite 2.9, vitest 0.9, c8 7          | `vite-plus@1.4.0` (Vite 8.3 core, Vitest 5.0.5, Oxlint, Oxfmt)                                                      |
| TypeScript           | 4.6                                 | 6.0.3                                                                                                               |
| Node                 | unset                               | 24.22.1 (`engines`, `.node-version`, `.nvmrc`)                                                                      |
| Svelte               | 3.47                                | 5.57.2                                                                                                              |
| SvelteKit            | 1.0.0-next.318                      | 3.1.0                                                                                                               |
| Svelte tooling       | svelte-check 2, svelte-preprocess 4 | svelte-check 4.7.7, `@sveltejs/vite-plugin-svelte` 7.3.1, `@sveltejs/adapter-auto` 8.0.0, `@sveltejs/package` 3.0.1 |
| Svelte package build | `svelte-kit package`                | `svelte-package` (reads plugin config from `vite.config.ts`)                                                        |
| React                | 18.0                                | 19.3.1 (+ `@types/react` 19.3.0, plugin-react 6.1.2)                                                                |
| React tests          | RTL 13, jest-dom 5, jsdom 19        | RTL 16.3.3, jest-dom 7.0.1, `@testing-library/dom` 10.4.2, jsdom 30.1.3                                             |
| Vue                  | 3.2.33                              | 3.5.44 (+ plugin-vue 6.0.10, test-utils 2.5.1, happy-dom 21.0.4)                                                    |
| Playwright           | 1.21                                | 1.64.1                                                                                                              |
| dts                  | vite-plugin-dts 1.1                 | tsdown `dts: true` (no plugin)                                                                                      |
| pnpm                 | unpinned                            | `packageManager: pnpm@12.15.0`                                                                                      |

## Build design

### core / react / vue — ESM only

React's published JSX is compiled with `jsx: "react-jsx"` so `vp pack` emits `react/jsx-runtime`
imports instead of raw JSX. Vue declarations are emitted by `vue-tsc` (`tsconfig.build.json`),
because tsdown's dts output re-exported a hashed JS chunk with no matching declaration.

`vite.config.ts` uses `defineConfig` from `vite-plus` with a `pack` block:

```ts
pack: {
  entry: 'src/index.ts',
  format: ['es'],
  platform: 'browser',
  dts: true,
  minify: true,
  clean: true,
}
```

- Output is `dist/index.js` (ESM, because every package has `"type": "module"`) plus
  `dist/index.d.ts` and declaration maps.
- `package.json`: keep `"type": "module"`; `exports` becomes
  `{ ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } }`; keep `module`
  for older bundlers; **remove** `main`, `unpkg`, `esmodule`, `umd:main`; add `files: ["dist"]`.
- `@staticmaps/core` stays a runtime `dependencies` entry (`workspace:*`) in React/Vue and is
  externalized by tsdown. react/react-dom/vue move from `dependencies` to `devDependencies`,
  with peers `react: ^18 || ^19` and `vue: ^3.2` (code uses stable APIs). `react-dom` is not a
  peer: the component imports only `react`; it stays a dev dependency for the demo.
- No UMD/IIFE global names, globals map, or property mangling. Oxc has no property mangling,
  so the old terser `_`-prefix mangling is dropped; output bytes change, behavior does not.

### Tests (Vitest 5)

- Tests import explicitly from `vite-plus/test` (`describe`, `expect`, `it`, `test`); remove
  `globals: true`.
- Per-package `test` block lives in the package `vite.config.ts`:
  `environment: 'jsdom'` (React) / `'happy-dom'` (Vue), coverage provider `v8`
  (`reporter: ['text', 'lcov']`), and `include: ['src/**/*.spec.{ts,tsx}']` where useful.
- React matchers load via `@testing-library/jest-dom/vitest`. Snapshots are regenerated only
  after confirming the rendered DOM is unchanged.
- Svelte demo e2e stays Playwright (latest), modern config: `testDir: 'tests'`,
  `webServer: { command: 'vp build && vp preview --port 4173', url: 'http://localhost:4173',
  reuseExistingServer: !process.env.CI }`.
- Scripts: library packages `"test": "vp test run --coverage"`; Svelte `"test:e2e":
  "playwright test"` (no `test` script, so the recursive unit run skips it).
- `@staticmaps/core` must be built before React/Vue/Svelte consume it (their source imports
  the package, whose exports point at `dist`). Root `test` and CI build core first; no source
  aliasing is added to published package configs.

### svelte

- Config moves from `svelte.config.js` into `vite.config.ts`:
  `sveltekit({ adapter: adapter(), preprocess: vitePreprocess() })`.
  SvelteKit 3 no longer reads `svelte.config.js`.
- Routes restructure: `__layout.svelte` → `+layout.svelte` (children snippet via `$props()`),
  `index.svelte` → `+page.svelte`, `polygon.svelte` / `linestring.svelte` / `server-side.svelte`
  → `<name>/+page.svelte`. `prerender`/`csr` exports move to `server-side/+page.ts`;
  `hydrate`/`router` are removed options.
- `$lib` is removed in SvelteKit 3. Add Node subpath `imports` in `package.json`
  (`"#lib": "./src/lib/index.ts"`, `"#lib/*": "./src/lib/*"`) and update imports.
- `src/lib/StaticMap.svelte` moves to runes: `$props()` + `$derived(createStaticMap(options))`.
  Demo pages use `$state()` and `onclick` instead of `on:click`.
- `app.html` switches to `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`.
- `tsconfig.json` extends `$app/tsconfig` with explicit `include`/`exclude`.
- Library packaging: `svelte-package -i src/lib -o dist`; add `exports`, `files`, `svelte`,
  `types`, and `peerDependencies: { svelte: ^5.0.0 }`.
- Scripts: `vp dev` / `vp build` / `vp preview`; library build stays `svelte-package`.
- **Vite resolution:** `vp build` hard-fails unless `vite` resolves to
  `@voidzero-dev/vite-plus-core`, so every package uses the catalog alias, including this one.
  SvelteKit 3's `vite@^8.0.12` peer is satisfied in behavior by the Vite 8.3 core; the
  version-range mismatch is explicitly allowed in `pnpm-workspace.yaml`
  (`peerDependencyRules.allowedVersions`). `vp build` and `vp dev` are the verified path.

### Root toolchain and lint/format

- `vite.config.ts` (root):
  - `fmt`: former `.prettierrc` values (`semi: true`, `singleQuote: true`,
    `trailingComma: 'all'`, `printWidth: 140`, `arrowParens: 'avoid'`) plus a
    `packages/svelte/**` override for tabs.
  - `lint`: converted from `packages/svelte/.eslintrc.cjs` and
    `@typescript-eslint/recommended` — TypeScript plugin, correctness rules, and
    `typescript/no-explicit-any` as a warning. Type-aware/type-check options are enabled;
    they pass on the migrated codebase.
  - Old `.prettierrc`, `packages/svelte/.prettierrc`, and `packages/svelte/.eslintrc.cjs`
    are deleted after the migration is verified. `c8`, `eslint`, `prettier`,
    `prettier-plugin-svelte`, `typescript-eslint`, `eslint-plugin-svelte`, `svelte-preprocess`,
    and `vite-plugin-dts` are removed.
- `vp migrate --no-interactive` is run from the workspace root after the tooling bump, with
  the ESLint/Prettier configs still in place so its lint/format migration runs. Its diff is
  reviewed; anything it leaves (e.g. Svelte-specific rules) is ported by hand into the
  `lint`/`fmt` blocks.
- Scripts: `build`/`test` keep recursive semantics via `vp run -r …`; add `lint` (`vp lint`),
  `fmt` (`vp fmt`), `check` (`vp check`), `test:e2e`.
- `build:ci` becomes `pnpm install --frozen-lockfile && pnpm build && pnpm -C packages/svelte run build:demo`.
- `pnpm-workspace.yaml`: toolchain catalog (`vite-plus`, `typescript`, coverage provider) and
  only-built dependencies if install requires it.
- `.vscode`: replace Prettier/Volar recommendations with Oxc/Svelte/Volar; set Oxc formatter.
- `.github/workflows/ci.yml`: Node 24.22.1, pnpm cache, **core build before checks** (its
  exports point at `dist`), `vp check`, `svelte-check`, unit tests, full build,
  `check:dist` import smoke, Chromium install + Playwright. Update CodeQL action majors.
- Regenerate `pnpm-lock.yaml` with pnpm 12.15.0.

## Ordered execution

1. **Record baseline** on the current branch (expected to fail on Node 24; capture output).
2. **Tooling/dependency majors** with plain Vite/Vitest still: TS 6 (`module: ESNext`,
   `moduleResolution: Bundler`), Vite 8, Vitest 5, React 19, Vue 3.5, Svelte 5 + Kit 3,
   ESM-only metadata, configs, route/runes rewrite. Tests already import from `vitest` but
   run on Vitest 5.
3. **`vp migrate --no-interactive`** with ESLint/Prettier still present; review the whole
   diff. Accept dependency/script/import/lint/format migrations; revert anything wrong
   (notably the `vite` alias in `packages/svelte`).
4. **Add `pack` blocks** (ESM only), remove dead tooling/configs, modernize test blocks and
   Playwright config, Node pins, root scripts, CI.
5. **Verify** per package and fix failures; do not silence them.

## Verification

- `pnpm install --frozen-lockfile` on Node 24.22.1.
- `vp check` (Oxfmt + Oxlint) clean; deleted ESLint/Prettier configs are unreferenced.
- `vp run -r test` green for core, react, vue (Vitest 5, coverage v8).
- `vp run -r build` produces `dist/index.js` + `dist/index.d.ts` for the three libraries and
  `dist/` from `svelte-package`; assert no `index.cjs.js` / `umd` / `iife` files remain.
- `vp -C packages/svelte build:demo`, `vp -C packages/svelte preview`, `playwright test`.
- `node scripts/check-dist.mjs` parses and imports the built ESM entry points and checks their
  named exports.
- Manual smoke of the three demos (Svelte dev server, React and Vue dev servers).
- `vp fmt --check` leaves no diff.

## Risks and mitigations

| Risk                                                                 | Mitigation                                                                                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `vp migrate` cannot parse the legacy `.eslintrc.cjs` / `.prettierrc` | Port the rules into `lint`/`fmt` by hand from the same source; the migration outcome and deletion of old configs stay the same. |
| Oxlint only lints `<script>` blocks in `.svelte`/`.vue`              | Accepted; Oxfmt formats the whole file, and `svelte-check` covers template types.                                               |
| SvelteKit 3 config/API changes (`#lib`, `$app/*`, options exports)   | Follow the Kit 3 migration guide; keep changes mechanical.                                                                      |
| Vite+ core vs SvelteKit’s `vite@^8` peer                             | Upstream `vite` in the Svelte package; fallback to Vite CLI for that app if runtime conflicts appear.                           |
| tsdown output differs from Vite lib output                           | ESM-only output is deterministic; assert `dist/index.js` + `.d.ts` and imports.                                                 |
| TS 6 module resolution (`node` removed)                              | `module: ESNext` + `moduleResolution: Bundler`; add explicit extensions where required.                                         |
| React 19 / Testing Library 16 snapshot drift                         | Regenerate snapshots only after confirming no real DOM change.                                                                  |
| ESM-only breaks CJS/CDN consumers                                    | Documented breaking change; recommend a major release.                                                                          |
| Playwright browsers missing locally                                  | CI installs Chromium; local runs report the missing-browser gap instead of hiding it.                                           |

## Rollback

Work happens on a dedicated branch/worktree, one commit per phase. A failing phase can be
reverted without losing earlier green states; the old lockfile remains in history.
