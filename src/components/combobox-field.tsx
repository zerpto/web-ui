"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Description,
  Field,
  Label,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useMemo, useState } from "react";

export type ComboOption = { value: string; label: string; description?: string };

type ComboboxFieldProps = {
  label: string;
  /** Selected id, or "" for none. */
  value: string;
  onChange: (value: string) => void;
  options: ComboOption[];
  /**
   * The selected option when it may not be in `options` (remote search results). Without it,
   * the label is looked up in `options`.
   */
  selected?: ComboOption | null;
  /** Remote search: called with the typed text, and `options` are then used as-is (no local filter). */
  onSearch?: (query: string) => void;
  /** Raw text as the person types it, for a field that also accepts free text (e.g. a payee). */
  onTextChange?: (text: string) => void;
  loading?: boolean;
  placeholder?: string;
  emptyText: string;
  hint?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  /** Focus the input when the page opens (a form's first field). */
  autoFocus?: boolean;
  /** Dense variant for table cells: the label becomes screen-reader only. */
  compact?: boolean;
  /** Borderless cell that fills a table cell edge to edge (implies `compact`). */
  seamless?: boolean;
  /** Cap on locally filtered options shown at once (default 100); raise it for short fixed lists. */
  maxResults?: number;
  /** Pinned at the bottom of the open list, e.g. "Add new item". Receives what was typed so far. */
  footer?: { label: string; onClick: (query: string) => void };
};

const MAX_LOCAL_RESULTS = 100;

/** Searchable select (Headless UI Combobox), with local or remote filtering. */
export function ComboboxField({
  label,
  value,
  onChange,
  options,
  selected,
  onSearch,
  onTextChange,
  loading,
  placeholder,
  emptyText,
  hint,
  error,
  disabled,
  autoFocus,
  compact: compactProp,
  seamless,
  maxResults = MAX_LOCAL_RESULTS,
  footer,
}: ComboboxFieldProps) {
  const [query, setQuery] = useState("");
  const compact = compactProp || seamless;
  const current = selected ?? options.find((option) => option.value === value) ?? null;

  const results = useMemo(() => {
    if (onSearch) return options;
    const needle = query.trim().toLowerCase();
    const matches = needle
      ? options.filter((option) =>
          `${option.label} ${option.description ?? ""}`.toLowerCase().includes(needle),
        )
      : options;
    return matches.slice(0, maxResults);
  }, [options, query, onSearch, maxResults]);

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
      <Combobox
        value={current}
        by="value"
        immediate
        onChange={(option: ComboOption | null) => onChange(option?.value ?? "")}
        onClose={() => {
          setQuery("");
          onSearch?.("");
        }}
      >
        <div className="relative">
          <ComboboxInput
            autoComplete="off"
            autoFocus={autoFocus}
            aria-invalid={Boolean(error) || undefined}
            placeholder={placeholder}
            displayValue={(option: ComboOption | null) => option?.label ?? ""}
            onChange={(event) => {
              setQuery(event.target.value);
              onSearch?.(event.target.value);
              onTextChange?.(event.target.value);
            }}
            className={clsx(
              seamless &&
                "data-focus:ring-brand-600 data-invalid:ring-danger-500 dark:data-focus:ring-brand-400 block w-full rounded-none bg-transparent px-3 py-2 pr-9 text-sm text-zinc-900 placeholder:text-zinc-400 hover:bg-zinc-50 focus:outline-none data-focus:ring-2 data-focus:ring-inset data-invalid:ring-2 data-invalid:ring-inset dark:text-white dark:hover:bg-white/5",
              !seamless &&
                "block w-full rounded-lg bg-white pr-9 pl-3 text-sm text-zinc-900 shadow-xs ring-1 ring-zinc-300 ring-inset placeholder:text-zinc-400",
              !seamless && (compact ? "py-1" : "loose:py-2.5 loose:pl-3.5 py-1.5 pl-3"),
              !seamless &&
                "data-focus:ring-brand-600 aria-invalid:ring-danger-500 focus:outline-none data-disabled:opacity-60 data-focus:ring-2",
              !seamless &&
                "dark:data-focus:ring-brand-400 dark:bg-white/5 dark:text-white dark:ring-white/10",
              seamless &&
                "aria-invalid:ring-danger-500 aria-invalid:ring-2 aria-invalid:ring-inset",
            )}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 grid w-9 place-items-center">
            <ChevronUpDownIcon aria-hidden="true" className="size-4 text-zinc-400" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom start"
          transition
          className="z-50 max-h-64 w-(--input-width) min-w-56 overflow-auto rounded-xl bg-white p-1 shadow-lg ring-1 ring-zinc-900/5 transition duration-100 ease-out [--anchor-gap:6px] focus:outline-none data-closed:opacity-0 dark:bg-zinc-900 dark:ring-white/10"
        >
          {results.length === 0 && (
            <p className="px-2.5 py-2 text-sm text-zinc-500 dark:text-zinc-400">
              {loading ? "…" : emptyText}
            </p>
          )}
          {results.map((option) => (
            <ComboboxOption
              key={option.value}
              value={option}
              className="group flex cursor-default items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 select-none data-focus:bg-zinc-100 dark:text-zinc-300 dark:data-focus:bg-white/5"
            >
              <CheckIcon
                aria-hidden="true"
                className="text-brand-600 dark:text-brand-400 invisible mt-0.5 size-4 shrink-0 group-data-selected:visible"
              />
              <span className="min-w-0">
                <span className="block truncate group-data-selected:font-medium">
                  {option.label}
                </span>
                {option.description && (
                  <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {option.description}
                  </span>
                )}
              </span>
            </ComboboxOption>
          ))}
          {footer && (
            <div className="sticky bottom-0 -mx-1 mt-1 -mb-1 border-t border-zinc-200 bg-white p-1 dark:border-white/10 dark:bg-zinc-900">
              <button
                type="button"
                // Keep focus in the input so the list isn't closed before the click lands.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => footer.onClick(query)}
                className="text-brand-700 dark:text-brand-400 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium hover:bg-zinc-100 focus:outline-none focus-visible:bg-zinc-100 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
              >
                <PlusIcon aria-hidden="true" className="size-4 shrink-0" />
                {footer.label}
              </button>
            </div>
          )}
        </ComboboxOptions>
      </Combobox>
      {error ? (
        <Description
          role="alert"
          className={
            seamless
              ? "text-danger-700 dark:text-danger-400 flex items-center gap-1 px-3 pb-1 text-xs"
              : "text-danger-700 dark:text-danger-400 mt-1.5 flex items-center gap-1.5 text-sm"
          }
        >
          <ExclamationCircleIcon aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </Description>
      ) : hint ? (
        <Description className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          {hint}
        </Description>
      ) : null}
    </Field>
  );
}
