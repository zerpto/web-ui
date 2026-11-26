"use client";

import { Description, Field, Label, Switch } from "@headlessui/react";

/** Headless UI Switch with a label and description on the left. */
export function SwitchField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Field className="flex items-start justify-between gap-6">
      <div>
        <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</Label>
        {description && (
          <Description className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </Description>
        )}
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className="group data-checked:bg-brand-600 data-focus:outline-brand-600 relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-zinc-200 p-0.5 transition-colors duration-200 ease-in-out focus:outline-none data-focus:outline-2 data-focus:outline-offset-2 dark:bg-white/10"
      >
        <span
          aria-hidden="true"
          className="size-5 translate-x-0 rounded-full bg-white shadow-sm ring-1 ring-zinc-900/5 transition duration-200 ease-in-out group-data-checked:translate-x-5"
        />
      </Switch>
    </Field>
  );
}
