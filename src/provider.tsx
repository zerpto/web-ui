"use client";

import { createContext, useContext, useMemo } from "react";
import type { ExtensionLinkProps, ExtensionLocale } from "./extension";
import { uiMessages, type UiMessages } from "./messages";

type UiContextValue = {
  messages: UiMessages;
  Link: React.ComponentType<ExtensionLinkProps>;
  /** Shown by `QueryError` for a 403, instead of the built-in message. */
  NoAccess?: React.ComponentType;
  /** The icon `PageHeader` shows when it isn't given one: the page's menu icon. */
  pageIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

/** A plain link: a full page load. Hosts inject their router's link. */
function AnchorLink({ replace, onClick, ...props }: ExtensionLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        onClick?.(event);
        const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
        if (!replace || event.defaultPrevented || event.button !== 0 || modified) return;
        event.preventDefault();
        window.location.replace(props.href);
      }}
    />
  );
}

const UiContext = createContext<UiContextValue>({ messages: uiMessages.en, Link: AnchorLink });

/**
 * Injects what the shared components can't know: texts, the router's link and the "no access"
 * screen. Anything left out comes from the surrounding provider, or the English defaults. The host
 * sets it once; extensions rendered inside the host inherit it because `@zerpto/ui` is shared.
 */
export function UiProvider({
  locale,
  messages,
  Link,
  NoAccess,
  pageIcon,
  children,
}: {
  /** Picks the built-in texts. */
  locale?: ExtensionLocale;
  /** Overrides single texts. */
  messages?: Partial<UiMessages>;
  Link?: React.ComponentType<ExtensionLinkProps>;
  NoAccess?: React.ComponentType;
  pageIcon?: UiContextValue["pageIcon"];
  children: React.ReactNode;
}) {
  const parent = useContext(UiContext);
  const value = useMemo<UiContextValue>(
    () => ({
      messages: { ...(locale ? uiMessages[locale] : parent.messages), ...messages },
      Link: Link ?? parent.Link,
      NoAccess: NoAccess ?? parent.NoAccess,
      pageIcon: pageIcon ?? parent.pageIcon,
    }),
    [parent, locale, messages, Link, NoAccess, pageIcon],
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  return useContext(UiContext);
}
