# Agent guide: web.ui (`@zerpto/ui`)

Theme, shared React components and the host/extension contract for `web.app` and federated
extensions. Read [README.md](README.md) first: exports, consumer setup and the contract.

## Rules

- Framework-agnostic: no `next/*`, `next-intl`, `@zerpto/sdk`, app aliases or data fetching. Inject
  what differs per app through props or `UiProvider`.
- Stack: React, TypeScript, Tailwind CSS (latest), Headless UI, Heroicons. pnpm only; never commit
  `package-lock.json` or `yarn.lock`.
- Ships TypeScript source; no build step. Keep `src/federation.js` plain JavaScript (build configs
  load it) and its `.d.ts` in step.
- Runtime components are exported from the root `src/index.ts` only, because that module is what the
  host shares with extensions.
- Add `"use client"` to every module that uses hooks, context or Headless UI. Keep style helpers and
  pure components free of it, so server components can call them.
- Changes are additive: deployed extensions run against the host's newer copy.
- The contract (`src/extension.ts`, `src/federation.js`) is the single source of truth. Change it
  here, update the README tables, and tell the host and the extension template.
- A new text goes in `UiMessages` with English and Bahasa Indonesia, and the host adapter
  (`web.app/src/components/ui/ui-provider.tsx`) must pass it.
- A new dependency that holds React context or global state needs a decision: shared singleton,
  and a resolve alias in `web.app/next.config.ts`.
- Visual rules for the components are in `web.app/CLAUDE.md` (full-bleed sections, compact tables,
  link style). Changing a class string changes the app.
- Never run remote git operations. Local commits only when asked. Never read `.env` files.

## Checks

`pnpm typecheck` and `pnpm lint` here, then the same in `web.app` (and `pnpm build` there for
changes to styles, exports or `"use client"`).
