import { ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const tones = {
  error: {
    icon: ExclamationTriangleIcon,
    className:
      "bg-danger-50 text-danger-800 ring-danger-200 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/20",
    iconClassName: "text-danger-600 dark:text-danger-400",
  },
  // Neutral on purpose: a red (brand) info banner would read as an error.
  info: {
    icon: InformationCircleIcon,
    className:
      "bg-zinc-50 text-zinc-700 ring-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10",
    iconClassName: "text-accent-600 dark:text-accent-400",
  },
};

export function Alert({
  tone = "error",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: toneClass, iconClassName } = tones[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={clsx(
        "motion-safe:animate-fade-up flex gap-2.5 rounded-lg px-3.5 py-3 text-sm ring-1 ring-inset",
        toneClass,
        className,
      )}
    >
      <Icon aria-hidden="true" className={clsx("mt-0.5 size-4 shrink-0", iconClassName)} />
      <div>{children}</div>
    </div>
  );
}
