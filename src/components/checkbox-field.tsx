"use client";

import { Checkbox, Description, Field, Label } from "@headlessui/react";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

type CheckboxFieldProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  error?: string;
  name?: string;
  disabled?: boolean;
};

export function CheckboxField({
  checked,
  onChange,
  label,
  error,
  name,
  disabled,
}: CheckboxFieldProps) {
  return (
    <Field className="loose:space-y-1.5 space-y-1">
      <div className="flex items-start gap-3">
        <Checkbox
          name={name}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          aria-invalid={Boolean(error) || undefined}
          className={clsx(
            "group mt-0.5 grid size-4.5 shrink-0 cursor-pointer place-items-center rounded-[5px] bg-white ring-1 ring-zinc-300 transition-colors ring-inset data-disabled:cursor-not-allowed data-disabled:opacity-50",
            "data-checked:bg-brand-600 data-checked:ring-brand-600",
            "data-focus:outline-brand-600 data-focus:outline-2 data-focus:outline-offset-2",
            "aria-invalid:ring-danger-500 dark:aria-invalid:ring-danger-400",
            "dark:data-checked:bg-brand-500 dark:data-checked:ring-brand-500 dark:bg-white/5 dark:ring-white/20",
          )}
        >
          <CheckIcon
            aria-hidden="true"
            className="size-3.5 text-white opacity-0 transition-opacity group-data-checked:opacity-100"
          />
        </Checkbox>
        <Label className="cursor-pointer text-sm text-zinc-600 select-none dark:text-zinc-400">
          {label}
        </Label>
      </div>
      {error && (
        <Description
          role="alert"
          className="text-danger-700 dark:text-danger-400 flex items-center gap-1.5 text-sm"
        >
          <ExclamationCircleIcon aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </Description>
      )}
    </Field>
  );
}
