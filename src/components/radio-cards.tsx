"use client";

import { Description, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

type RadioCardOption<V extends string> = { value: V; label: string; description: string };

/** Headless UI RadioGroup rendered as selectable cards. */
export function RadioCards<V extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: V;
  onChange: (value: V) => void;
  options: RadioCardOption<V>[];
}) {
  return (
    <Field className="space-y-1.5">
      <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</Label>
      <RadioGroup value={value} onChange={onChange} className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className="group data-checked:ring-brand-600 data-focus:outline-brand-600 dark:data-checked:ring-brand-500 relative flex cursor-pointer rounded-xl bg-white p-4 ring-1 ring-zinc-300 transition focus:outline-none data-checked:ring-2 data-focus:outline-2 data-focus:outline-offset-2 dark:bg-white/5 dark:ring-white/10"
          >
            <div className="flex-1">
              <Label className="block text-sm font-semibold text-zinc-900 dark:text-white">
                {option.label}
              </Label>
              <Description className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                {option.description}
              </Description>
            </div>
            <CheckCircleIcon
              aria-hidden="true"
              className="text-brand-600 dark:text-brand-500 size-5 opacity-0 group-data-checked:opacity-100"
            />
          </Radio>
        ))}
      </RadioGroup>
    </Field>
  );
}
