"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useUi } from "../provider";

export type RowMenuItem = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  tone?: "danger";
  hidden?: boolean;
};

/** "…" actions menu for a table row or card header. Renders nothing when every item is hidden. */
export function RowMenu({ items, label }: { items: RowMenuItem[]; label?: string }) {
  const { messages } = useUi();
  const visible = items.filter((item) => !item.hidden);
  if (visible.length === 0) return null;

  return (
    <Menu>
      <MenuButton
        aria-label={label ?? messages.actions}
        className="data-focus:outline-brand-600 rounded-lg px-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none data-focus:outline-2 dark:hover:bg-white/10 dark:hover:text-zinc-200"
      >
        <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        transition
        className="z-50 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-zinc-900/5 transition duration-100 ease-out [--anchor-gap:4px] focus:outline-none data-closed:scale-95 data-closed:opacity-0 dark:bg-zinc-900 dark:ring-white/10"
      >
        {visible.map(({ label: text, icon: Icon, onClick, tone }) => (
          <MenuItem key={text}>
            <button
              type="button"
              onClick={onClick}
              className={clsx(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm",
                tone === "danger"
                  ? "text-danger-700 data-focus:bg-danger-50 dark:text-danger-400 dark:data-focus:bg-danger-500/10"
                  : "text-zinc-700 data-focus:bg-zinc-100 dark:text-zinc-300 dark:data-focus:bg-white/5",
              )}
            >
              <Icon
                aria-hidden="true"
                className={clsx("size-4", tone !== "danger" && "text-zinc-400")}
              />
              {text}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
