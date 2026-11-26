"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import { buttonStyles, type Size, type Variant } from "./button-styles";
import { Spinner } from "./spinner";

type ButtonProps = Omit<React.ComponentProps<"button">, "className"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <HeadlessButton
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles(variant, className, size)}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </HeadlessButton>
  );
}

/**
 * Joins related buttons (or links styled with `buttonStyles`) into one segmented control: shared
 * edges, outer corners rounded only. Put `secondary` buttons inside it.
 */
export function ButtonGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="group"
      className={clsx(
        "isolate inline-flex",
        "[&>*]:rounded-none [&>:first-child]:rounded-l-lg [&>:last-child]:rounded-r-lg [&>:not(:first-child)]:-ml-px",
        "[&>*:focus-visible]:z-10 [&>*:hover]:z-10",
        className,
      )}
    >
      {children}
    </div>
  );
}
