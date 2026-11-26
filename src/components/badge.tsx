import clsx from "clsx";

const tones = {
  neutral:
    "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:ring-white/10",
  brand:
    "bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20",
  success:
    "bg-accent-50 text-accent-800 ring-accent-200 dark:bg-accent-500/10 dark:text-accent-300 dark:ring-accent-500/20",
  warning:
    "bg-danger-50 text-danger-800 ring-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/20",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
