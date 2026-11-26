# @zerpto/ui

The theme, shared React components and host/extension contract of Zerpto's web frontends. Used by
`web.app` (Next.js host) and by every federated extension (React, TypeScript, Rsbuild, Module
Federation 2.0).

It ships TypeScript source, with no build step. It is framework-agnostic: no `next/*`, no
`next-intl`, no data fetching. Links, texts and the 403 screen are injected with `UiProvider`.

## Setup in this package

```bash
pnpm install
pnpm typecheck
pnpm lint
```

## Exports

| Specifier               | What                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `@zerpto/ui`            | All runtime components, `UiProvider`, `useUi`, `uiMessages`, the contract types. The only runtime path to import.                |
| `@zerpto/ui/extension`  | Contract types, plus the values of `@zerpto/ui/federation`.                                                                      |
| `@zerpto/ui/federation` | Plain JavaScript for build configs: `ROUTES_EXPOSE`, `SCOPE_ATTRIBUTE`, `SHARED_DEPENDENCIES`, `remoteName()`, `remoteShared()`. |
| `@zerpto/ui/host.css`   | Host stylesheet entry.                                                                                                           |
| `@zerpto/ui/remote.css` | Extension stylesheet entry.                                                                                                      |
| `@zerpto/ui/theme.css`  | Tokens and the `dark` / `loose` variants alone (included by both entries).                                                       |

Components: `Alert`, `Badge`, `Button`, `ButtonGroup`, `buttonStyles`, `CheckboxField`,
`ComboboxField`, `ConfirmDialog`, `CopyButton`, `DataTable`, `TableFrame`, `tableStyles`,
`Section` (with its parts), `DetailSection`, `DetailMeta`, `DetailSplit`, `DetailStats`,
`detailStyles`, `Dialog`, `DialogActions`, `ExtensionScope`, `useExtensionScope`, `PageContainer`,
`PageHeader`, `PageFooter`, `SettingsSection`, `Card`, `EmptyState`, `QueryError`,
`TableSkeleton`, `PasswordField`, `RadioCards`, `RowMenu`, `SearchField`, `SegmentedControl`,
`SelectField`, `Spinner`, `Stat`, `StepperField`, `SwitchField`, `TextField`, `TextAreaField`,
`TextLink`, `textLinkStyles`, `TimezoneField`.

`buttonStyles`, `textLinkStyles`, `Section`, `Badge`, `Alert` and `Spinner` can be used from a
React Server Component. Modules that need the browser carry `"use client"`.

### `UiProvider`

```tsx
<UiProvider locale="id" messages={{ retry: "..." }} Link={RouterLink} NoAccess={My403} pageIcon={Icon}>
```

`pageIcon` is the icon `PageHeader` shows when it gets no `icon` prop (`icon={null}` shows none); the
host sets it to the page's menu icon. Every prop is optional; what is left out comes from the outer provider, then the defaults (English,
a plain `<a>`, a built-in 403 message). `Link` takes `ExtensionLinkProps`. An extension running in
the host inherits the host's provider (same `@zerpto/ui` instance) and must not add its own. Only a
standalone run needs one.

### Not here (stays in `web.app`)

| What                                                             | Why                                                                                     |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Breadcrumbs`, the nav icon and `crumbs` of `PageHeader`         | Come from the app's menu, router and server menu.                                       |
| `Can`, permission filtering in `TextLink` / `RowMenu`            | The app's permission rules. `web.app` wraps the shared components.                      |
| `SidePanel`, `SidePanelLayout`                                   | Built on Next parallel routes and router.                                               |
| `DateTimeField`                                                  | Needs `react-aria-components` and more injected texts; move when an extension needs it. |
| `PasswordStrengthMeter`                                          | App scoring rules, auth screens only.                                                   |
| `skeletons.tsx`                                                  | Skeletons of specific app pages.                                                        |
| Charts, `--viz-*` tokens, app shell background, side panel width | Host only.                                                                              |
| `AddressFields`, `LineItemsEditor` and other domain components   | Fetch data through the SDK.                                                             |

## Host setup (`web.app`)

`package.json`:

```json
"@zerpto/ui": "link:../web.ui"
```

Run `pnpm install` in this package too: its own imports resolve from its `node_modules`.

`next.config.ts`:

```ts
transpilePackages: ["@zerpto/ui"],
turbopack: {
  root: path.join(__dirname, ".."),
  resolveAlias: {
    "@headlessui/react": "./node_modules/@headlessui/react",
    "@heroicons/react/*": "./node_modules/@heroicons/react/*",
    clsx: "./node_modules/clsx",
  },
},
```

The aliases are required: without them the bundle holds two copies of Headless UI.

Global stylesheet:

```css
@import "tailwindcss";
@import "@zerpto/ui/host.css";
```

`host.css` brings the theme, utilities, `body` base styles, the `--gutter` variables and the
`@source` for this package. The host supplies `--font-geist-sans` / `--font-geist-mono` and toggles
`dark` on `<html>`.

## Extension setup (remote)

Replace `<key>` with the extension key, for example `sales-orders`.

`package.json` (adjust the relative path):

```json
"dependencies": {
  "@zerpto/ui": "link:../../web.ui",
  "@headlessui/react": "^2.2.10",
  "@heroicons/react": "^2.2.0",
  "clsx": "^2.1.1",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
},
"devDependencies": {
  "@module-federation/rsbuild-plugin": "^2.9.4",
  "@rsbuild/core": "^2.3.4",
  "@rsbuild/plugin-react": "^2.1.1",
  "@tailwindcss/postcss": "^4.3.3",
  "tailwindcss": "^4.3.3",
  "typescript": "^5.9.3",
  "@types/react": "^19.3.0",
  "@types/react-dom": "^19.3.0"
}
```

`rsbuild.config.ts`:

```ts
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { remoteName, remoteShared, ROUTES_EXPOSE } from "@zerpto/ui/federation";

// `STANDALONE=true` bundles fallback copies of the shared libraries, to run without the host.
const standalone = process.env.STANDALONE === "true";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: remoteName("<key>"),
      exposes: { [ROUTES_EXPOSE]: "./src/Routes.tsx" },
      shared: remoteShared({ fallback: standalone }),
      dts: false,
    }),
  ],
  resolve: { dedupe: ["react", "react-dom", "@headlessui/react", "@heroicons/react", "clsx"] },
  // The host loads the manifest and chunks from another origin.
  server: { port: 3101, cors: { origin: "http://localhost:3000" } },
  // Lazy compilation (Rsbuild 2.3.4) fails the first load with "Cannot read properties of
  // undefined (reading 'call')", and its on-demand modules don't load across the federation.
  dev: { assetPrefix: "auto", lazyCompilation: false },
  output: { assetPrefix: "auto" },
});
```

The static host serving a built remote must send CORS headers for the web app's origin.

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

`tsconfig.json` (both copies of the React types must be one, or `tsc` reports "Two different types
with this name exist"):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "isolatedModules": true,
    "skipLibCheck": true,
    "paths": {
      "react": ["./node_modules/@types/react"],
      "react/*": ["./node_modules/@types/react/*"]
    }
  },
  "include": ["src"]
}
```

Add `declare module "*.css";` in a `src/env.d.ts`.

`src/styles.css`:

```css
@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" theme(reference);
@import "@zerpto/ui/remote.css";

@source "./";

@layer utilities {
  [data-zerpto-ext="<key>"] {
    @tailwind utilities source(none);
  }
}
```

Rules, so the extension never restyles the host:

- Never `@import "tailwindcss"` or `preflight.css`, and write no global selectors (`body`, `*`,
  bare elements).
- Keep every utility inside the `[data-zerpto-ext="<key>"]` block. Unscoped duplicates would
  reorder the host's cascade (a later `.hidden` beating the host's `lg:flex`).
- Do not remove the layer order line.
- Theme variables are not emitted: utilities read the host's (`var(--color-brand-600, <default>)`).
  A standalone run falls back to those defaults; the `--gutter` family and base styles are missing
  there, so a standalone entry may import its own preflight and variables (never the exposed
  module).
- Rebuild and redeploy extensions when `@zerpto/ui` or the host's own screens inside an extension
  change (see the limitation below).
- Classes on the scope element itself do not match (only its descendants).
- A `Dialog` from `@zerpto/ui` carries the scope into its portal. For a portal the extension
  renders itself (Headless UI `Dialog`, `MenuItems`, `PopoverPanel`...), put the classes on
  children of the portal root and spread `useExtensionScope()` on that root.

**Known limitation.** Scoped utilities outrank the host's plain ones inside the scope. On an element
the host renders there (a shared component, or the host's "no access" screen), a utility the
extension's CSS has (`.hidden`) beats a variant only the host's CSS has (`sm:block`), so the element
takes the wrong style. It can only happen with classes missing from the extension's build, which
scans this package: that is, when the host runs a newer `@zerpto/ui`, or in host-only markup. The
host's "no access" screen is unaffected today. Lowering the scope's specificity with `:where()` does
not help, because the extension's stylesheet loads last and wins the tie.

`src/Routes.tsx` (the exposed module; it imports the stylesheet):

```tsx
import { PageContainer, PageHeader } from "@zerpto/ui";
import type { ExtensionRoutesProps } from "@zerpto/ui/extension";
import "./styles.css";

export default function Routes({ path }: ExtensionRoutesProps) {
  return (
    <PageContainer>
      <PageHeader title={path} />
    </PageContainer>
  );
}
```

Entry: `src/index.ts` holds only `import("./bootstrap");` (shared modules need an async boundary).
`bootstrap.tsx` is the standalone run: render `Routes` with stand-in props inside
`<ExtensionScope name="<key>">`.

## Host and extension contract

Types: `src/extension.ts`. Values: `src/federation.js`.

- A remote exposes `./Routes`. Its default export is a React component with `ExtensionRoutesProps`:

| Prop          | Type                                 | Meaning                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`        | `string`                             | Whole current app pathname, starting with `/`.                                                                                                                                                                                                                |
| `search`      | `string`                             | As `location.search`: `""` or starting with `?`.                                                                                                                                                                                                              |
| `locale`      | `"en" \| "id"`                       | The app's language.                                                                                                                                                                                                                                           |
| `permissions` | `string[]`                           | Permission keys the user can use now: wildcards expanded, keys outside the plan left out, only `read` ones for a read-only user. UI only; the API enforces.                                                                                                   |
| `navigate`    | `(href, { replace? }) => void`       | Client navigation to an app path.                                                                                                                                                                                                                             |
| `Link`        | `ComponentType<ExtensionLinkProps>`  | The host's link: anchor props, `href: string`, `replace?`.                                                                                                                                                                                                    |
| `apiFetch`    | `(path, init?) => Promise<Response>` | Authorized `fetch`; `path` (`/v1/...`) is appended to the API base URL. Resolves for any status. The host handles the token and refresh; do not set `Authorization`. Rejects session calls (`/v1/auth/*` except `GET /v1/auth/me`, and creating a workspace). |

- Theme is not a prop: dark mode follows the host's `dark` class.
- MF remote name: the extension key with `-` replaced by `_` (`remoteName()`).
- Manifest: `frontend.mode` is `module-federation`, `frontend.remote` is the URL of the remote's
  `mf-manifest.json`, `frontend.expose` is `./Routes`, `frontend.shared` mirrors the table below.
- The host renders the component inside `<ExtensionScope name={key}>`.
- The component stays mounted while the path changes between the extension's own pages, and is
  remounted when the user switches workspace. Module-level state outlives that remount, so keep no
  workspace data there.
- `PageHeader` shows the page's menu icon by itself, and the host draws the breadcrumbs from the
  menu entry and the URL.
- The extension owns the paths under its menu entries' `route` and `create_route`.

### Shared singletons

Provided by the host; an extension bundles no copy (`import: false`) unless built standalone.

| Module                  | Accepted range |
| ----------------------- | -------------- |
| `react`                 | `^19.2.0`      |
| `react/jsx-runtime`     | `^19.2.0`      |
| `react/jsx-dev-runtime` | `^19.2.0`      |
| `react-dom`             | `^19.2.0`      |
| `react-dom/client`      | `^19.2.0`      |
| `@headlessui/react`     | `^2.2.0`       |
| `@zerpto/ui`            | `^0.1.0`       |

`@zerpto/ui` holds React context. Headless UI is shared because the shared components are built on
it: two copies would not see each other's fields, dialogs and portals.

Host obligations:

- Register every module above with the Module Federation runtime, using the instances the app itself
  imports, with `singleton: true`.
- State versions as plain releases (`19.2.8`, never `React.version`: Next's React is a canary
  pre-release, which fails `^19.2.0`).
- A production host has no working `react/jsx-dev-runtime`, so it can load production builds of
  extensions only. Use `next dev` to load an extension's dev server.

Because extensions use the host's `@zerpto/ui`, changes to it must be additive: an older extension
meets a newer host. Releasing an incompatible change means a new range and rebuilt extensions.
