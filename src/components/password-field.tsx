"use client";

import { EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useUi } from "../provider";
import { TextField, type TextFieldProps } from "./text-field";

type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing" | "icon">;

export function PasswordField(props: PasswordFieldProps) {
  const { messages } = useUi();
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeSlashIcon : EyeIcon;

  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      icon={LockClosedIcon}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? messages.hidePassword : messages.showPassword}
          aria-pressed={visible}
          className="focus-visible:outline-brand-600 rounded-md p-1.5 text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-2 dark:hover:text-zinc-200"
        >
          <Icon aria-hidden="true" className="size-5" />
        </button>
      }
    />
  );
}
