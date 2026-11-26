"use client";

import { Description, Field, Input, Label } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export type TextFieldProps = Omit<React.ComponentProps<"input">, "className"> & {
  label: string;
  error?: string;
  hint?: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Rendered inside the input on the right (e.g. a show/hide toggle). */
  trailing?: React.ReactNode;
  /** Rendered on the right of the label (e.g. a "Forgot password?" link). */
  labelAction?: React.ReactNode;
  children?: React.ReactNode;
  /** Dense variant for table-like rows: label is screen-reader only, smaller padding. */
  compact?: boolean;
  /** Borderless cell that fills a table cell edge to edge (implies `compact`). */
  seamless?: boolean;
  /** Right-align the value (amounts). */
  align?: "right";
};

export function TextField({
  label,
  error,
  hint,
  icon: Icon,
  trailing,
  labelAction,
  children,
  compact: compactProp,
  seamless,
  align,
  ...props
}: TextFieldProps) {
  const compact = compactProp || seamless;
  return (
    <Field className={compact ? undefined : "loose:space-y-1.5 space-y-1"}>
      <div className={clsx("flex items-center justify-between gap-2", compact && "sr-only")}>
        <Label className="loose:text-sm text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </Label>
        {labelAction}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="loose:left-3.5 loose:size-5 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
          />
        )}
        <Input
          autoComplete="off"
          {...props}
          invalid={Boolean(error)}
          className={clsx(
            seamless &&
              "data-focus:ring-brand-600 data-invalid:ring-danger-500 dark:data-focus:ring-brand-400 block w-full rounded-none bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 hover:bg-zinc-50 focus:outline-none data-focus:ring-2 data-focus:ring-inset data-invalid:ring-2 data-invalid:ring-inset dark:text-white dark:hover:bg-white/5",
            !seamless &&
              "loose:px-3.5 block w-full rounded-lg bg-white px-3 text-sm text-zinc-900 shadow-xs ring-1 ring-zinc-300 transition-shadow ring-inset placeholder:text-zinc-400",
            !seamless && "data-focus:ring-brand-600 focus:outline-none data-focus:ring-2",
            !seamless && "data-invalid:ring-danger-500 data-invalid:data-focus:ring-danger-500",
            !seamless &&
              "dark:data-focus:ring-brand-400 dark:data-invalid:ring-danger-400 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:placeholder:text-zinc-500",
            !seamless && (compact ? "py-1" : "loose:py-2.5 py-1.5"),
            align === "right" && "text-right tabular-nums",
            Icon && "loose:pl-11 pl-9",
            trailing && "loose:pr-11 pr-10",
          )}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">{trailing}</div>
        )}
      </div>

      {children}

      {error ? (
        <Description
          role="alert"
          className={
            seamless
              ? "text-danger-700 dark:text-danger-400 flex items-center gap-1 px-3 pb-1 text-xs"
              : "text-danger-700 dark:text-danger-400 flex items-center gap-1.5 text-sm"
          }
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
