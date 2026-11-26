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
import { CheckIcon, ChevronUpDownIcon, ExclamationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useMemo, useState } from "react";

const MAX_RESULTS = 50;

/** The browser's IANA list as is, in its own order (no region is favoured). */
function allTimezones() {
  return typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
}

type TimezoneFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

/** Searchable IANA timezone picker (Headless UI Combobox). */
export function TimezoneField({ label, value, onChange, placeholder, error }: TimezoneFieldProps) {
  const [query, setQuery] = useState("");
  const zones = useMemo(() => allTimezones(), []);

  const results = useMemo(() => {
    const needle = query.toLowerCase().replace(/\s+/g, "_");
    const matches = needle ? zones.filter((zone) => zone.toLowerCase().includes(needle)) : zones;
    return matches.slice(0, MAX_RESULTS);
  }, [query, zones]);

  return (
    <Field className="loose:space-y-1.5 space-y-1">
      <Label className="loose:text-sm text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
        {label}
      </Label>
      <Combobox
        value={value}
        onChange={(zone: string | null) => zone && onChange(zone)}
        onClose={() => setQuery("")}
      >
        <div className="relative">
          <ComboboxInput
            autoComplete="off"
            aria-invalid={Boolean(error) || undefined}
            placeholder={placeholder}
            displayValue={(zone: string) => zone?.replaceAll("_", " ") ?? ""}
            onChange={(event) => setQuery(event.target.value)}
            className={clsx(
              "loose:py-2.5 loose:pr-10 loose:pl-3.5 block w-full rounded-lg bg-white py-1.5 pr-9 pl-3 text-sm text-zinc-900 shadow-xs ring-1 ring-zinc-300 ring-inset placeholder:text-zinc-400",
              "data-focus:ring-brand-600 aria-invalid:ring-danger-500 focus:outline-none data-focus:ring-2",
              "dark:data-focus:ring-brand-400 dark:bg-white/5 dark:text-white dark:ring-white/10",
            )}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 grid w-10 place-items-center">
            <ChevronUpDownIcon aria-hidden="true" className="size-4 text-zinc-400" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom start"
          transition
          className="z-50 max-h-64 w-(--input-width) overflow-auto rounded-xl bg-white p-1 shadow-lg ring-1 ring-zinc-900/5 transition duration-100 ease-out [--anchor-gap:6px] empty:invisible focus:outline-none data-closed:opacity-0 dark:bg-zinc-900 dark:ring-white/10"
        >
          {results.map((zone) => (
            <ComboboxOption
              key={zone}
              value={zone}
              className="group flex cursor-default items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 select-none data-focus:bg-zinc-100 dark:text-zinc-300 dark:data-focus:bg-white/5"
            >
              <CheckIcon
                aria-hidden="true"
                className="text-brand-600 dark:text-brand-400 invisible size-4 shrink-0 group-data-selected:visible"
              />
              {zone.replaceAll("_", " ")}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
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
