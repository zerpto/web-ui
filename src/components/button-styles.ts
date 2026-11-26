import clsx from "clsx";

export type Variant = "primary" | "secondary" | "ghost" | "danger";
export type Size = "md" | "sm";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150 data-disabled:cursor-not-allowed data-disabled:opacity-60 data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-brand-600 dark:data-focus:outline-brand-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:focus-visible:outline-brand-400";

const sizes: Record<Size, string> = {
  md: "px-3.5 py-1.5 text-sm loose:px-4 loose:py-2.5",
  sm: "px-2.5 py-1 text-[13px]",
};

const variants: Record<Variant, string> = {
  primary:
    // brand-600 in both themes keeps white text at WCAG AA contrast; hover goes darker, not lighter.
    "bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700 data-hover:bg-brand-700 data-active:bg-brand-800",
  secondary:
    "bg-white text-zinc-900 shadow-xs ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 data-hover:bg-zinc-50 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10 dark:data-hover:bg-white/10",
  ghost:
    "text-zinc-700 hover:bg-zinc-100 data-hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5 dark:data-hover:bg-white/5",
  // Destructive actions and confirmations: red, distinct from the purple brand.
  danger:
    "bg-danger-600 text-white shadow-sm hover:bg-danger-700 data-hover:bg-danger-700 data-active:bg-danger-800",
};

/** Shared classes so links (e.g. Next.js `<Link>`) can look like buttons. */
export function buttonStyles(variant: Variant = "primary", className?: string, size: Size = "md") {
  return clsx(base, sizes[size], variants[variant], className);
}
