"use client";

import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useUi } from "../provider";
import { Button } from "./button";

/**
 * Page body wrapper. Every page is full width now, so `wide` is on by default and the app shell
 * no longer caps the content width; pass `wide={false}` only to opt a page into a narrow column.
 */
export function PageContainer({
  wide = true,
  className,
  children,
}: {
  wide?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={clsx("", !wide && "mx-auto max-w-5xl", className)}>{children}</div>;
}

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
};

/**
 * Title row for app pages. The icon before the title is the host's menu icon for the page
 * (`UiProvider`'s `pageIcon`); pass `icon` to override it, or `icon={null}` for none.
 */
export function PageHeader({ title, description, actions, icon }: PageHeaderProps) {
  const { pageIcon } = useUi();
  const Icon = icon === undefined ? pageIcon : icon;
  return (
    <div className="my-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* From `lg` the description sits right of the title and wraps there; below, it goes under it. */}
      <div className="min-w-0 lg:flex lg:flex-1 lg:items-center lg:gap-6">
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-zinc-900 lg:shrink-0 dark:text-white">
          {Icon && (
            <Icon
              aria-hidden="true"
              className="text-brand-600 dark:text-brand-400 size-6 shrink-0"
            />
          )}
          <span className="min-w-0">{title}</span>
        </h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-600 lg:mt-0 lg:max-w-2xl dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}

/** Bottom row for app pages (e.g. save/cancel actions), mirroring `PageHeader`'s spacing. */
export function PageFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("my-3 flex items-center justify-end gap-2", className)}>{children}</div>
  );
}

/** Settings block: heading + description on the left, content card on the right. */
export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3 border-t border-zinc-200 pt-4 first:border-t-0 first:pt-0 lg:grid-cols-3 dark:border-white/10">
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <div className="space-y-3 lg:col-span-2">{children}</div>
    </section>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-white ring-1 ring-zinc-200 dark:bg-white/5 dark:ring-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="ml-(--rail-offset) px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-xl bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/**
 * Error state for failed queries; 403 gets a "no access" message instead of a retry. `compact` is
 * for narrow spots such as the sidebar: a line of text with the retry button, or (`icon`, the
 * collapsed sidebar) just the button.
 */
export function QueryError({
  error,
  onRetry,
  compact,
}: {
  error: unknown;
  onRetry: () => void;
  compact?: "text" | "icon";
}) {
  const { messages, NoAccess } = useUi();
  const forbidden =
    typeof error === "object" && error !== null && "status" in error && error.status === 403;

  if (compact === "icon") {
    const label = `${messages.loadErrorTitle}. ${messages.retry}`;
    return (
      <div role="alert" className="flex justify-center">
        <Button variant="ghost" size="sm" aria-label={label} title={label} onClick={onRetry}>
          <ArrowPathIcon aria-hidden="true" className="size-4" />
        </Button>
      </div>
    );
  }
  if (compact) {
    return (
      <div role="alert" className="space-y-2 px-2.5 py-2">
        <p className="text-[13px] text-zinc-600 dark:text-zinc-400">{messages.loadErrorTitle}</p>
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {messages.retry}
        </Button>
      </div>
    );
  }

  // The host's own 403 screen when it provides one, so every "no access" looks alike.
  if (forbidden) {
    return NoAccess ? (
      <NoAccess />
    ) : (
      <EmptyState
        icon={LockClosedIcon}
        title={messages.noAccessTitle}
        description={messages.noAccessBody}
      />
    );
  }

  return (
    <EmptyState
      icon={ExclamationTriangleIcon}
      title={messages.loadErrorTitle}
      description={messages.loadErrorBody}
      action={
        <Button variant="secondary" onClick={onRetry}>
          {messages.retry}
        </Button>
      }
    />
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div aria-busy="true" className="animate-pulse divide-y divide-zinc-200 dark:divide-white/10">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 py-2.5 pr-(--gutter) pl-(--row-start)">
          <div className="size-7 rounded-full bg-zinc-200 dark:bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-40 rounded bg-zinc-200 dark:bg-white/10" />
            <div className="h-3 w-56 rounded bg-zinc-200 dark:bg-white/10" />
          </div>
          <div className="h-5 w-16 rounded-md bg-zinc-200 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}
