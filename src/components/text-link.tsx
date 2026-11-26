"use client";

import type { ExtensionLinkProps } from "../extension";
import { useUi } from "../provider";
import type { Size, Variant } from "./button-styles";
import { textLinkStyles } from "./text-link-styles";

export type TextLinkProps = ExtensionLinkProps & {
  /** Renders the link as a button (same looks as `Button`); without it, a plain text link. */
  variant?: Variant;
  /** Button size, only with `variant`. */
  size?: Size;
};

/**
 * The one link component. A text link looks like the text around it (same colour, size and
 * weight, no underline) and turns brand purple on hover; with `variant` it looks like a `Button`
 * but still navigates. The link itself comes from `UiProvider`.
 */
export function TextLink({ variant, size, className, ...props }: TextLinkProps) {
  const { Link } = useUi();
  return <Link {...props} className={textLinkStyles(variant, className, size)} />;
}
