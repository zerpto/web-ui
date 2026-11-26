"use client";

import { Description, Field, Label, Textarea } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

type TextAreaFieldProps = Omit<React.ComponentProps<"textarea">, "className"> & {
  label?: string;
  error?: string;
  hint?: React.ReactNode;
  /** Borderless cell that fills a table cell edge to edge and grows with its text. */
  seamless?: boolean;
};

export function TextAreaField({
  label,
  error,
  hint,
  seamless,
  rows = seamless ? 1 : 3,
  ...props
}: TextAreaFieldProps) {
  return (
    <Field className={seamless ? undefined : "loose:space-y-1.5 space-y-1"}>
      {label && (
        <Label
          className={clsx(
            seamless
              ? "sr-only"
              : "loose:text-sm text-[13px] font-medium text-zinc-900 dark:text-zinc-100",
          )}
        >
          {label}
        </Label>
      )}
      <Textarea
        autoComplete="off"
        {...props}
        rows={rows}
        invalid={Boolean(error)}
        className={clsx(
          "data-focus:ring-brand-600 data-invalid:ring-danger-500 dark:data-focus:ring-brand-400 block w-full text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white",
          seamless
            ? // `field-sizing: content` makes the box grow with its text, so long text is never hidden.
              "field-sizing-content resize-none rounded-none bg-transparent px-3 py-2 hover:bg-zinc-50 data-focus:ring-2 data-focus:ring-inset data-invalid:ring-2 data-invalid:ring-inset dark:hover:bg-white/5"
            : "loose:px-3.5 loose:py-2.5 resize-y rounded-lg bg-white px-3 py-1.5 shadow-xs ring-1 ring-zinc-300 ring-inset data-focus:ring-2 dark:bg-white/5 dark:ring-white/10 dark:placeholder:text-zinc-500",
        )}
      />
      {error ? (
        <Description
          role="alert"
          className={clsx(
            "text-danger-700 dark:text-danger-400 flex items-center gap-1.5",
            seamless ? "px-3 pb-1 text-xs" : "text-sm",
          )}
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
