import clsx from "clsx";
import { buttonStyles, type Size, type Variant } from "./button-styles";

/** Classes of `TextLink`, for a host that renders its router's link itself. */
export function textLinkStyles(variant?: Variant, className?: string, size?: Size) {
  return variant
    ? buttonStyles(variant, className, size)
    : clsx(
        "hover:text-brand-700 focus-visible:outline-brand-600 dark:hover:text-brand-400 transition-colors focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      );
}
