"use client";

import {
  Description,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from "@headlessui/react";
import clsx from "clsx";
import { useExtensionScope } from "./extension-scope";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: "brand" | "danger";
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

const iconTones = {
  brand:
    "bg-brand-50 text-brand-600 ring-brand-100 dark:bg-brand-500/10 dark:text-brand-400 dark:ring-brand-500/20",
  danger:
    "bg-danger-50 text-danger-600 ring-danger-100 dark:bg-danger-500/10 dark:text-danger-400 dark:ring-danger-500/20",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  tone = "brand",
  children,
  size = "md",
}: DialogProps) {
  // The dialog is portaled out of the extension's subtree, so it carries the CSS scope along.
  const scope = useExtensionScope();
  return (
    <HeadlessDialog {...scope} open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition duration-200 ease-out data-closed:opacity-0 dark:bg-black/60"
      />
      <div className="fixed inset-0 flex items-end justify-center overflow-y-auto p-4 sm:items-center">
        <DialogPanel
          transition
          className={clsx(
            "w-full rounded-2xl bg-white p-5 shadow-xl ring-1 ring-zinc-900/5 transition duration-200 ease-out data-closed:translate-y-4 data-closed:opacity-0 sm:data-closed:translate-y-0 sm:data-closed:scale-95 dark:bg-zinc-900 dark:ring-white/10",
            { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" }[size],
          )}
        >
          <div className="flex gap-4">
            {Icon && (
              <span
                className={clsx(
                  "grid size-10 shrink-0 place-items-center rounded-xl ring-1",
                  iconTones[tone],
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-white">
                {title}
              </DialogTitle>
              {description && (
                <Description className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {description}
                </Description>
              )}
            </div>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}

/** Right-aligned action row for dialog footers. */
export function DialogActions({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{children}</div>
  );
}
