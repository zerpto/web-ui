/** The module every remote exposes, and the manifest's `frontend.expose`. */
export declare const ROUTES_EXPOSE: "./Routes";

/** Attribute that scopes an extension's CSS; its value is the extension key. */
export declare const SCOPE_ATTRIBUTE: "data-zerpto-ext";

export type SharedDependency =
  | "react"
  | "react/jsx-runtime"
  | "react/jsx-dev-runtime"
  | "react-dom"
  | "react-dom/client"
  | "@headlessui/react"
  | "@zerpto/ui";

/** Libraries the host provides as singletons, with the version range an extension accepts. */
export declare const SHARED_DEPENDENCIES: Readonly<Record<SharedDependency, string>>;

/** The Module Federation remote name of an extension: its key with `-` replaced by `_`. */
export declare function remoteName(extensionKey: string): string;

export type RemoteSharedConfig = {
  singleton: true;
  requiredVersion: string;
  import?: false;
};

/** The `shared` option of an extension's Module Federation plugin. */
export declare function remoteShared(options?: {
  fallback?: boolean;
}): Record<SharedDependency, RemoteSharedConfig>;
