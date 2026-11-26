import clsx from "clsx";
import { Card } from "./page";

/** One headline figure: small label, large value, optional note underneath. */
export function Stat({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  tone?: "good" | "bad";
}) {
  return (
    <Card className="p-5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p
        className={clsx(
          "mt-1 text-2xl font-semibold tracking-tight tabular-nums",
          tone === "good" && "text-accent-700 dark:text-accent-400",
          tone === "bad" && "text-danger-700 dark:text-danger-400",
          !tone && "text-zinc-900 dark:text-white",
        )}
      >
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{note}</p>}
    </Card>
  );
}
