"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useUi } from "../provider";
import { Button } from "./button";
import { Dialog, DialogActions } from "./dialog";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  confirmLabel: string;
  /** Resolve `true` to close the dialog, `false` to keep it open (e.g. on error). */
  onConfirm: () => Promise<boolean>;
};

/** Confirmation for destructive actions (revoke, deactivate, rotate). */
export function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) {
  const { messages } = useUi();
  const [pending, setPending] = useState(false);

  async function confirm() {
    setPending(true);
    const done = await onConfirm();
    setPending(false);
    if (done) onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={pending ? () => {} : onClose}
      title={title}
      description={description}
      icon={ExclamationTriangleIcon}
      tone="danger"
      size="sm"
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          {messages.cancel}
        </Button>
        <Button variant="danger" onClick={confirm} loading={pending}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
