"use client";

import { Description, Field, Input, Label } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useUi } from "../provider";

/** Whole-number input with − / + buttons (e.g. seat count). */
export function StepperField({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hint?: React.ReactNode;
}) {
  const { messages } = useUi();
  const clamp = (next: number) => Math.min(max, Math.max(min, Math.round(next)));
  const buttonClass =
    "grid size-10 place-items-center text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white";

  return (
    <Field className="space-y-1">
      <Label className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">{label}</Label>
      <div className="focus-within:ring-brand-600 flex w-fit items-stretch overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-zinc-300 ring-inset focus-within:ring-2 dark:bg-white/5 dark:ring-white/10">
        <button
          type="button"
          aria-label={messages.decrease}
          disabled={value <= min}
          onClick={() => onChange(clamp(value - 1))}
          className={buttonClass}
        >
          <MinusIcon aria-hidden="true" className="size-4" />
        </button>
        <Input
          autoComplete="off"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            if (!Number.isNaN(next)) onChange(clamp(next));
          }}
          className="w-16 [appearance:textfield] border-x border-zinc-200 bg-transparent text-center text-sm font-semibold text-zinc-900 tabular-nums focus:outline-none dark:border-white/10 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={messages.increase}
          disabled={value >= max}
          onClick={() => onChange(clamp(value + 1))}
          className={buttonClass}
        >
          <PlusIcon aria-hidden="true" className="size-4" />
        </button>
      </div>
      {hint && (
        <Description className="text-sm text-zinc-500 dark:text-zinc-400">{hint}</Description>
      )}
    </Field>
  );
}
