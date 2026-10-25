# @staticmaps/svelte

Svelte 5 bindings for [`@staticmaps/core`](../core), plus a SvelteKit 3 demo.

## Requirements

Node 24 LTS and pnpm 12. The package is ESM-only.

## Development

```bash
pnpm install
pnpm -C packages/svelte dev         # SvelteKit demo
pnpm -C packages/svelte build       # svelte-package -> dist/
pnpm -C packages/svelte build:demo  # production demo build
pnpm -C packages/svelte check       # svelte-check
pnpm -C packages/svelte test:e2e    # Playwright smoke test
```

The library is built with `svelte-package`; the demo and its configuration live in
`vite.config.ts` (SvelteKit 3 no longer reads `svelte.config.js`).
