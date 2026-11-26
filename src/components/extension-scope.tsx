"use client";

import { createContext, useContext } from "react";
import { SCOPE_ATTRIBUTE } from "../federation.js";

const ScopeContext = createContext<string | undefined>(undefined);

/**
 * Marks the subtree an extension renders into, so its scoped CSS applies there and nowhere else.
 * Dialogs opened inside it carry the mark into their portal. The host wraps every extension in it.
 */
export function ExtensionScope({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <ScopeContext.Provider value={name}>
      <div {...{ [SCOPE_ATTRIBUTE]: name }} style={{ display: "contents" }}>
        {children}
      </div>
    </ScopeContext.Provider>
  );
}

/**
 * The attributes to spread on the root of a portal an extension renders itself (a Headless UI
 * `Dialog`, `MenuItems`, `PopoverPanel`…), so its content stays styled. Empty outside a scope.
 */
export function useExtensionScope(): Record<string, string> {
  const name = useContext(ScopeContext);
  return name ? { [SCOPE_ATTRIBUTE]: name } : {};
}
