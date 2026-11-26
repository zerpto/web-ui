/**
 * Module Federation facts shared by the host (web.app) and every extension. Plain JavaScript so a
 * build config (`rsbuild.config.ts`) can import it without compiling TypeScript.
 */

/** The module every remote exposes, and the manifest's `frontend.expose`. */
export const ROUTES_EXPOSE = "./Routes";

/** Attribute that scopes an extension's CSS; its value is the extension key. */
export const SCOPE_ATTRIBUTE = "data-zerpto-ext";

/** Libraries the host provides as singletons, with the version range an extension accepts. */
export const SHARED_DEPENDENCIES = Object.freeze({
  react: "^19.2.0",
  "react/jsx-runtime": "^19.2.0",
  "react/jsx-dev-runtime": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-dom/client": "^19.2.0",
  "@headlessui/react": "^2.2.0",
  "@zerpto/ui": "^0.1.0",
});

/** The Module Federation remote name of an extension: its key with `-` replaced by `_`. */
export function remoteName(extensionKey) {
  return extensionKey.replaceAll("-", "_");
}

/**
 * The `shared` option of an extension's Module Federation plugin. By default no fallback copy is
 * bundled (`import: false`), so the extension can only ever use the host's instances. Pass
 * `{ fallback: true }` for a build that must also run on its own, without a host.
 */
export function remoteShared({ fallback = false } = {}) {
  return Object.fromEntries(
    Object.entries(SHARED_DEPENDENCIES).map(([name, requiredVersion]) => [
      name,
      { singleton: true, requiredVersion, ...(fallback ? {} : { import: false }) },
    ]),
  );
}
