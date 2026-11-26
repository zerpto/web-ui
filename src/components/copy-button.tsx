"use client";

import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useUi } from "../provider";
import { Button } from "./button";

export function CopyButton({ value }: { value: string }) {
  const { messages } = useUi();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }

  return (
    <Button variant="secondary" size="sm" onClick={copy} aria-live="polite">
      {copied ? (
        <CheckIcon aria-hidden="true" className="text-accent-600 size-4" />
      ) : (
        <ClipboardDocumentIcon aria-hidden="true" className="size-4" />
      )}
      {copied ? messages.copied : messages.copy}
    </Button>
  );
}
