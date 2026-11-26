/**
 * The contract between the web app (host) and a federated extension (remote). This file is the
 * single source of truth; change it here, never copy it.
 *
 * A remote exposes `./Routes`, whose default export is a React component taking
 * `ExtensionRoutesProps`. The theme is not a prop: dark mode follows the host's `dark` class.
 */
import type { ComponentPropsWithRef, ComponentType } from "react";

export {
  remoteName,
  remoteShared,
  ROUTES_EXPOSE,
  SCOPE_ATTRIBUTE,
  SHARED_DEPENDENCIES,
  type RemoteSharedConfig,
  type SharedDependency,
} from "./federation.js";

export type ExtensionLocale = "en" | "id";

/** Props of the link component the host injects. */
export type ExtensionLinkProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  /** App path, with an optional query string and hash: `/sales/orders?tab=draft`. */
  href: string;
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
};

export type ExtensionNavigate = (href: string, options?: { replace?: boolean }) => void;

/**
 * `fetch` against the API. `path` starts with `/` and is appended to the API base URL
 * (`/v1/...`). The host adds the access token and renews it; the remote never sees it and must
 * not set `Authorization`. Resolves for every HTTP status (check `response.ok`) and rejects only
 * when no response arrives, like `fetch`. Other headers (`Content-Type`, `Idempotency-Key`) are
 * the remote's to set in `init`.
 */
export type ExtensionApiFetch = (path: string, init?: RequestInit) => Promise<Response>;

export type ExtensionRoutesProps = {
  /** The whole current app pathname, starting with `/` (not relative to the extension). */
  path: string;
  /** The current query string as in `location.search`: `""`, or starting with `?`. */
  search: string;
  locale: ExtensionLocale;
  /**
   * The permission keys the signed-in user can use now in the current workspace, wildcards
   * expanded. Keys outside the plan are left out, and so are the write keys of a read-only user.
   * For showing and hiding controls only; the API enforces access.
   */
  permissions: string[];
  navigate: ExtensionNavigate;
  Link: ComponentType<ExtensionLinkProps>;
  apiFetch: ExtensionApiFetch;
};

/** What `loadRemote("<remote name>/Routes")` resolves to. */
export type ExtensionRoutesModule = {
  default: ComponentType<ExtensionRoutesProps>;
};
