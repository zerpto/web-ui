"use client";

import {
  Description,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export type SelectOption<V extends string | number> = {
  value: V;
  label: string;
  description?: string;
};

type SelectFieldProps<V extends string | number> = {
  label: string;
  value: V | undefined;
  onChange: (value: V) => void;
  options: SelectOption<V>[];
  placeholder?: string;
  hint?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  name?: string;
  /** Dense variant for table cells: the label becomes screen-reader only. */
  compact?: boolean;
  /** Borderless cell that fills a table cell edge to edge (implies `compact`). */
  seamless?: boolean;
  /** Smaller trigger height, useful in filter bars (implies `compact`). */
  size?: "sm";
};

/** Headless UI Listbox styled like `TextField`. */
export function SelectField<V extends string | number>({
  label,
  value,
  onChange,
  options,
  placeholder,
  hint,
  error,
  disabled,
  name,
  compact: compactProp,
  seamless,
  size,
}: SelectFieldProps<V>) {
  const compact = compactProp || seamless || size === "sm";
  const selected = options.find((option) => option.value === value);

  return (
    <Field className={compact ? undefined : "loose:space-y-1.5 space-y-1"} disabled={disabled}>
      <Label
        className={clsx(
          "loose:text-sm text-[13px] font-medium text-zinc-900 dark:text-zinc-100",
          compact && "sr-only",
        )}
      >
        {label}
      </Label>
      {/* `null` (not undefined) keeps the Listbox controlled while nothing is selected. */}
      <Listbox
        value={value ?? null}
        onChange={(next: V | null) => next !== null && onChange(next)}
        name={name}
        invalid={Boolean(error)}
      >
        <ListboxButton
          className={clsx(
            seamless &&
              "data-focus:ring-brand-600 data-invalid:ring-danger-500 dark:data-focus:ring-brand-400 relative block w-full rounded-none bg-transparent px-3 py-2 pr-9 text-left text-sm text-zinc-900 placeholder:text-zinc-400 hover:bg-zinc-50 focus:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-60 data-focus:ring-2 data-focus:ring-inset data-invalid:ring-2 data-invalid:ring-inset dark:text-white dark:hover:bg-white/5",
            !seamless &&
              clsx(
                "relative block w-full rounded-lg bg-white text-left text-zinc-900 shadow-xs ring-1 ring-zinc-300 ring-inset",
                size === "sm"
                  ? "py-1 pr-7 pl-2.5 text-xs"
                  : "loose:py-2.5 loose:pr-10 loose:pl-3.5 py-1.5 pr-9 pl-3 text-sm",
              ),
            !seamless &&
              "data-focus:ring-brand-600 focus:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-60 data-focus:ring-2",
            !seamless && "data-invalid:ring-danger-500",
            !seamless &&
              "dark:data-focus:ring-brand-400 dark:bg-white/5 dark:text-white dark:ring-white/10",
          )}
        >
          <span className={clsx("block truncate", !selected && "text-zinc-400")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className={clsx(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-zinc-400",
              size === "sm" ? "right-2 size-3.5" : "right-3 size-4",
            )}
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          transition
          className="z-50 max-h-64 w-(--button-width) overflow-auto rounded-xl bg-white p-1 shadow-lg ring-1 ring-zinc-900/5 transition duration-100 ease-out [--anchor-gap:6px] focus:outline-none data-closed:opacity-0 dark:bg-zinc-900 dark:ring-white/10"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="group flex cursor-default items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 select-none data-focus:bg-zinc-100 dark:text-zinc-300 dark:data-focus:bg-white/5"
            >
              <CheckIcon
                aria-hidden="true"
                className="text-brand-600 dark:text-brand-400 invisible mt-0.5 size-4 shrink-0 group-data-selected:visible"
              />
              <span>
                <span className="block group-data-selected:font-medium">{option.label}</span>
                {option.description && (
                  <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                    {option.description}
                  </span>
                )}
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
      {error ? (
        <Description
          role="alert"
          className="text-danger-700 dark:text-danger-400 flex items-center gap-1.5 text-sm"
        >
          <ExclamationCircleIcon aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </Description>
      ) : hint ? (
        <Description className="text-sm text-zinc-500 dark:text-zinc-400">{hint}</Description>
      ) : null}
    </Field>
  );
}
