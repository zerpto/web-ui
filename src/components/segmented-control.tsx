"use client";

import { Radio, RadioGroup } from "@headlessui/react";

/** Pill-shaped single choice (e.g. Monthly / Annual). */
export function SegmentedControl<V extends string>({
  label,
  value,
  onChange,
  options,
  size,
}: {
  label: string;
  value: V;
  onChange: (value: V) => void;
  options: { value: V; label: string; badge?: string }[];
  /** Compact variant for filter bars. */
  size?: "sm";
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onChange={onChange}
      className={
        size === "sm"
          ? "inline-flex max-w-full overflow-x-auto rounded-md bg-zinc-100 p-0.5 ring-1 ring-zinc-200 ring-inset dark:bg-white/5 dark:ring-white/10"
          : "inline-flex max-w-full overflow-x-auto rounded-full bg-zinc-100 p-1 ring-1 ring-zinc-200 ring-inset dark:bg-white/5 dark:ring-white/10"
      }
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          className={
            size === "sm"
              ? "data-focus:outline-brand-600 flex cursor-pointer items-center gap-1.5 rounded-[5px] px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-zinc-600 transition focus:outline-none data-checked:bg-white data-checked:text-zinc-900 data-checked:shadow-sm data-focus:outline-2 data-focus:outline-offset-2 dark:text-zinc-400 dark:data-checked:bg-zinc-800 dark:data-checked:text-white"
              : "data-focus:outline-brand-600 flex cursor-pointer items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap text-zinc-600 transition focus:outline-none data-checked:bg-white data-checked:text-zinc-900 data-checked:shadow-sm data-focus:outline-2 data-focus:outline-offset-2 dark:text-zinc-400 dark:data-checked:bg-zinc-800 dark:data-checked:text-white"
          }
        >
          {option.label}
          {option.badge && (
            <span className="bg-accent-100 text-accent-800 dark:bg-accent-500/15 dark:text-accent-300 rounded-full px-2 py-0.5 text-xs font-semibold">
              {option.badge}
            </span>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );
}
