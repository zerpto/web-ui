import clsx from "clsx";

/**
 * Compact spacing for detail pages (invoice, order, payment, journal…). Use these instead of
 * hand-picking paddings, so every detail page has the same density (CLAUDE.md rule 11).
 */
export const detailStyles = {
  /** Gap between the blocks of a detail page. */
  stack: "",
  /** Page title: smaller than a list page's, since the facts below it matter more. */
  title: "text-xl font-semibold tracking-tight text-zinc-900 dark:text-white",
  subtitle: "mt-0.5 text-sm text-zinc-600 dark:text-zinc-400",
  /**
   * Padding inside a section (facts grid, totals, notes). Sections run to the right edge of the
   * content area and, on the left, under the frosted sidebar (`bleed`), so the left edge pads with
   * `--row-start` and the right with `--gutter`: text lines up with the page title.
   */
  block: "pr-(--gutter) pl-(--row-start) py-3",
  /** Facts laid out in columns inside a block. */
  grid: "grid gap-x-6 gap-y-3 pr-(--gutter) pl-(--row-start) py-3",
  /** Table cells inside a section: the first cell pads with `--row-start`, the last with the gutter. */
  th: "px-3 py-2 text-xs font-medium last:pr-(--gutter)",
  td: "px-3 py-2 last:pr-(--gutter)",
  /**
   * Cell of an editable table inside a section (line items, deliveries): borderless fields fill it
   * edge to edge, and the first cell's text starts at `--row-start`, in line with the section title.
   */
  editCell:
    "border-b border-zinc-200 p-0 align-top first:pl-(--row-start) dark:border-white/10 [&:first-child_input]:pl-0",
  /** Rows of a list inside a section. */
  row: "pr-(--gutter) pl-(--row-start) py-2.5",
  /** Alert-like banners. */
  banner: "rounded-xl p-3 text-sm ring-1 ring-inset",
} as const;

/**
 * Full-bleed section frame: top and bottom rules heavier than row dividers (`border-zinc-300` vs
 * `divide-zinc-200`), so stacked sections are clearly separated when scanning down the page. Runs
 * under the frosted sidebar — pad content with `--row-start` / `--gutter`.
 */
function SectionContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx(detailStyles.block, className)}>{children}</div>;
}
SectionContent.className = detailStyles.block;

export function Section({
  children,
  className,
  title,
  subtitle,
  actions,
  background = true,
}: {
  children?: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Controls on the right of the title row (a view switch, a small button). */
  actions?: React.ReactNode;
  /** Set false for a section that sits on the page background instead of a white block. */
  background?: boolean;
}) {
  return (
    <div
      className={clsx(
        "bleed",
        background && "bg-white dark:bg-white/5",
        "border-t border-b border-t-zinc-300 border-b-zinc-300",
        "[&+&]:-mt-px",
        "dark:border-t-white/20 dark:border-b-white/10 dark:last:border-b-white/20",
        className,
      )}
    >
      {(title || subtitle || actions) && (
        <div
          className={clsx(
            "pt-3 pr-(--gutter) pb-2 pl-(--row-start)",
            actions && "flex flex-wrap items-center justify-between gap-x-4 gap-y-2",
          )}
        >
          <div className="min-w-0">
            {title && (
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</p>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

Section.Content = SectionContent;

function SectionWrapper({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("space-y-3", className)}>{children}</div>;
}
Section.Wrapper = SectionWrapper;

/**
 * A block of a detail page: full width of the content area with rules above and below, no card
 * frame and no side margin. Put `detailStyles.block`/`grid`/`row` inside for padding.
 */
export function DetailSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "bleed border-y border-zinc-300 bg-white dark:border-white/20 dark:bg-white/5",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** One fact: small label over its value. Put several in a `<dl className={detailStyles.grid}>`. */
export function DetailMeta({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("min-w-0", className)}>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-zinc-900 dark:text-white">{children}</dd>
    </div>
  );
}

/** Two or more panels side by side inside one bleed section; they stack on small screens. */
export function DetailSplit({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // The section runs on under the sidebar; padding by `--rail-offset` keeps the columns equal in the
    // visible area, and each panel pads with the plain gutter.
    <DetailSection
      className={clsx(
        "grid divide-y divide-zinc-200 pl-(--rail-offset) *:[--row-start:var(--gutter)] lg:grid-cols-2 lg:divide-x lg:divide-y-0 dark:divide-white/10",
        className,
      )}
    >
      {children}
    </DetailSection>
  );
}

/** Headline figures in a row (cost, book value…), separated by rules instead of cards. */
export function DetailStats({
  items,
  columns = 3,
  nested = false,
}: {
  items: { label: string; value: React.ReactNode; note?: React.ReactNode }[];
  columns?: 3 | 4;
  /** Inside another `DetailSection`: no frame of its own (a second bleed would overshoot). */
  nested?: boolean;
}) {
  const Frame = nested ? "div" : DetailSection;
  return (
    <Frame
      className={clsx(
        // Columns sit in the visible area (see `DetailSplit`), not under the sidebar.
        "grid divide-y divide-zinc-200 pl-(--rail-offset) *:[--row-start:var(--gutter)] sm:divide-x sm:divide-y-0 dark:divide-white/10",
        columns === 3 ? "sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="py-3 pr-(--gutter) pl-(--row-start) sm:px-4 sm:first:pl-(--row-start)"
        >
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.label}</p>
          <p className="mt-0.5 text-lg font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-white">
            {item.value}
          </p>
          {item.note && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{item.note}</p>
          )}
        </div>
      ))}
    </Frame>
  );
}

type SectionSideProps = {
  children?: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Set false for a panel that sits on the page background instead of a white block. */
  background?: boolean;
  /** `SectionRight` only: bleed on both sides (e.g. when it isn't actually beside a left panel). */
  fullBleed?: boolean;
};

function SectionLeft({
  children,
  className,
  title,
  subtitle,
  background = true,
}: SectionSideProps) {
  return (
    <div
      className={clsx(
        "bleed-left",
        background && "bg-white dark:bg-white/5",
        "border-t border-r border-b border-t-zinc-300 border-r-zinc-300 border-b-zinc-300",
        "[&+&]:-mt-px",
        "dark:border-t-white/20 dark:border-r-white/20 dark:border-b-white/10 dark:last:border-b-white/20",
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="pt-3 pr-(--gutter) pb-2 pl-(--row-start)">
          {title && <p className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</p>}
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function SectionLeftContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("py-3 pr-(--gutter) pl-(--row-start)", className)}>{children}</div>;
}
SectionLeft.Content = SectionLeftContent;
Section.Left = SectionLeft;

function SectionRight({
  children,
  className,
  title,
  subtitle,
  background = true,
  fullBleed = false,
}: SectionSideProps) {
  return (
    <div
      className={clsx(
        fullBleed ? "bleed" : "bleed-right",
        background && "bg-white dark:bg-white/5",
        "border-t border-b border-l border-t-zinc-300 border-b-zinc-300 border-l-zinc-300",
        "[&+&]:-mt-px",
        "dark:border-t-white/20 dark:border-b-white/10 dark:border-l-white/20 dark:last:border-b-white/20",
        className,
      )}
    >
      {(title || subtitle) && (
        <div
          className={clsx(
            fullBleed ? "pr-(--gutter) pl-(--row-start)" : "px-(--gutter)",
            "pt-3 pb-2",
          )}
        >
          {title && <p className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</p>}
          {subtitle && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function SectionRightContent({
  children,
  className,
  fullBleed = false,
}: {
  children?: React.ReactNode;
  className?: string;
  fullBleed?: boolean;
}) {
  return (
    <div
      className={clsx(
        "py-3",
        fullBleed ? "pr-(--gutter) pl-(--row-start)" : "px-(--gutter)",
        className,
      )}
    >
      {children}
    </div>
  );
}
SectionRight.Content = SectionRightContent;
Section.Right = SectionRight;
