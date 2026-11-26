"use client";

import { Checkbox } from "@headlessui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsUpDownIcon,
  CheckIcon,
  MinusIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useState } from "react";
import { useUi } from "../provider";
import { Button } from "./button";
import { QueryError, TableSkeleton } from "./page";
import { SearchField } from "./search-field";

export type Column<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  align?: "right";
  /** Hidden below this breakpoint; put the essentials in the first column for phones. */
  hideBelow?: "sm" | "md" | "lg" | "xl";
  /** Header is visually hidden (e.g. an actions column). */
  srOnly?: boolean;
  /** Allow this column to be sorted. */
  sortable?: boolean;
  /** Shrinks the column to its content (e.g. a checkbox) instead of an even share of the row. */
  narrow?: boolean;
};

/** One column's sort state. */
export type SortItem = { id: string; direction: "asc" | "desc" };

/** A paginated list: its loaded rows, request state and "load more". */
export type TableList<T> = {
  rows: T[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
};

/**
 * Shared look of every list table: compact rows, and the first/last cell padded with the page
 * gutter so their text lines up with the page title while the row rules run edge to edge.
 */
export const tableStyles = {
  table: "min-w-full divide-y divide-zinc-200 text-[13px] dark:divide-white/10",
  thead:
    "bg-zinc-50 text-left text-xs font-medium text-zinc-500 dark:bg-white/5 dark:text-zinc-400",
  tbody: "divide-y-0 [&>tr:nth-child(odd)]:bg-zinc-50 dark:[&>tr:nth-child(odd)]:bg-white/[0.02]",
  row: "hover:!bg-zinc-100 dark:hover:!bg-white/[0.06]",
  th: "px-3 py-2 whitespace-nowrap first:pl-(--row-start) last:pr-(--gutter)",
  td: "px-3 py-1 whitespace-nowrap first:pl-(--row-start) last:pr-(--gutter)",
};

/**
 * Full-bleed container for a list table. No border of its own — wrap in `Section` when a bold
 * section frame is needed. On the left it runs under the frosted sidebar (`bleed`); cells pad
 * with `--row-start` so text lines up with the page title.
 */
export function TableFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("bg-white dark:bg-white/5", className)}>{children}</div>;
}

const hide = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

/** Opt-in row selection: the ids of the selected rows, and how to change them. */
export type TableSelection = {
  selected: ReadonlySet<string>;
  onChange: (selected: Set<string>) => void;
};

function SelectBox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={onChange}
      aria-label={label}
      className="group data-checked:bg-brand-600 data-checked:ring-brand-600 data-indeterminate:bg-brand-600 data-indeterminate:ring-brand-600 data-focus:outline-brand-600 grid size-4 cursor-pointer place-items-center rounded-[5px] bg-white ring-1 ring-zinc-300 ring-inset data-focus:outline-2 data-focus:outline-offset-2 dark:bg-white/5 dark:ring-white/20"
    >
      <CheckIcon
        aria-hidden="true"
        className="col-start-1 row-start-1 size-3.5 text-white opacity-0 group-data-checked:opacity-100"
      />
      <MinusIcon
        aria-hidden="true"
        className="col-start-1 row-start-1 size-3.5 text-white opacity-0 group-data-indeterminate:opacity-100"
      />
    </Checkbox>
  );
}

/**
 * Full-bleed table that handles loading, error, empty, "no matches" and "load more" for a
 * cursor-paginated list.
 */
export function DataTable<T>({
  list,
  columns,
  rowKey,
  empty,
  filtered = false,
  rowClassName,
  selection,
  bulkAction,
  canSelect,
  toolbar,
  search,
  isSearchable = false,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchLabel,
  actions,
  filters,
  sort = [],
  onSortChange,
}: {
  list: TableList<T>;
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Shown when the list is empty and no filter is active. */
  empty: React.ReactNode;
  /** True when a search or filter is active, so an empty list means "no matches". */
  filtered?: boolean;
  rowClassName?: (row: T) => string | undefined;
  /** Adds a checkbox column (and a select-all in the header), controlled by the caller. */
  selection?: TableSelection;
  /**
   * Adds a checkbox column with selection state managed internally, and a bar above the table
   * ("N selected · actions · Clear") once any row is checked. Receives the selected rows and a
   * `clear` callback to reset the selection once the action has run. Ignored if `selection` is
   * passed instead (the caller owns selection state in that case).
   */
  bulkAction?: (selectedRows: T[], clear: () => void) => React.ReactNode;
  /**
   * Restricts which rows show a checkbox, for `selection` or `bulkAction` (e.g. only draft rows,
   * or only rows matching an already-selected value). Rows it rejects are left out of "select all".
   */
  canSelect?: (row: T) => boolean;
  /** Search field, filters, or other controls rendered above the table inside the section frame. */
  toolbar?: React.ReactNode;
  /** Search input rendered on the left of the top bar. Use this to customize the search control. */
  search?: React.ReactNode;
  /**
   * Renders the standard `SearchField` as the search control, wired to `searchValue`/
   * `onSearchChange`, when `search` isn't passed. Ignored if `search` is passed instead.
   */
  isSearchable?: boolean;
  /** Current text of the built-in search field (ignored unless `isSearchable` is set). */
  searchValue?: string;
  /** Called as the user types in the built-in search field. */
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Accessible label for the built-in search field; defaults to "Search". */
  searchLabel?: string;
  /** Action buttons rendered on the right of the top bar. */
  actions?: React.ReactNode;
  /** Filter controls rendered in the second row below the top bar. */
  filters?: React.ReactNode;
  /** Current multi-column sort state. */
  sort?: SortItem[];
  /** Called when the user clicks a sortable column header. */
  onSortChange?: (sort: SortItem[]) => void;
}) {
  const { messages } = useUi();
  const { rows } = list;
  const searchNode =
    search ??
    (isSearchable ? (
      <SearchField
        value={searchValue ?? ""}
        onChange={onSearchChange ?? (() => {})}
        placeholder={searchPlaceholder ?? messages.search}
        label={searchLabel ?? messages.search}
      />
    ) : undefined);
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
  const activeSelection: TableSelection | undefined =
    selection ??
    (bulkAction ? { selected: internalSelected, onChange: setInternalSelected } : undefined);
  const selectableRows = canSelect ? rows.filter(canSelect) : rows;
  const selectedRows = activeSelection
    ? rows.filter((row) => activeSelection.selected.has(rowKey(row)))
    : [];
  const chosen = selectedRows.length;
  const clearSelection = () => activeSelection?.onChange(new Set());

  function handleSortClick(id: string) {
    if (!onSortChange) return;
    const existing = sort.find((s) => s.id === id);
    if (!existing) {
      onSortChange([...sort, { id, direction: "asc" }]);
    } else if (existing.direction === "asc") {
      onSortChange(sort.map((s) => (s.id === id ? { ...s, direction: "desc" } : s)));
    } else {
      onSortChange(sort.filter((s) => s.id !== id));
    }
  }

  function SortIcon({ id }: { id: string }) {
    const item = sort.find((s) => s.id === id);
    const orderIndex = sort.indexOf(item!);
    return (
      <span className="ml-1 inline-flex items-center gap-0.5">
        {item?.direction === "asc" ? (
          <ArrowUpIcon className="text-brand-600 dark:text-brand-400 size-3" />
        ) : item?.direction === "desc" ? (
          <ArrowDownIcon className="text-brand-600 dark:text-brand-400 size-3" />
        ) : (
          <ArrowsUpDownIcon className="size-3 text-zinc-400 opacity-0 group-hover:opacity-100" />
        )}
        {item && sort.length > 1 && (
          <span className="text-brand-600 dark:text-brand-400 text-[10px] font-semibold tabular-nums">
            {orderIndex + 1}
          </span>
        )}
      </span>
    );
  }
  const toggle = (id: string, on: boolean) => {
    if (!activeSelection) return;
    const next = new Set(activeSelection.selected);
    if (on) next.add(id);
    else next.delete(id);
    activeSelection.onChange(next);
  };

  // The search and filter bars always stay: a list opened on a default filter (drafts only) can be
  // empty while other filters have data, and the user needs the controls to change it.
  const hasBulkBar = Boolean(bulkAction && activeSelection && chosen > 0);

  return (
    <>
      {(searchNode || actions) && (
        <div
          className={clsx(
            "flex items-center gap-3 pr-(--gutter) pl-(--row-start)",
            filters || hasBulkBar
              ? "pt-2.5 pb-0"
              : "border-b border-zinc-200 py-2.5 dark:border-white/10",
          )}
        >
          {searchNode && <div className="min-w-0 flex-1">{searchNode}</div>}
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {filters && (
        <div
          className={clsx(
            "flex flex-wrap items-center gap-2 pr-(--gutter) pl-(--row-start)",
            hasBulkBar ? "pt-2 pb-0" : "border-b border-zinc-200 py-2 dark:border-white/10",
          )}
        >
          {filters}
        </div>
      )}
      {bulkAction && activeSelection && chosen > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-zinc-200 py-2 pr-(--gutter) pl-(--row-start) dark:border-white/10">
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {messages.selectedCount(chosen)}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkAction(selectedRows, clearSelection)}
          </div>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={clearSelection}>
            {messages.clearSelection}
          </Button>
        </div>
      )}
      <TableFrame>
        {toolbar && (
          <div className="flex flex-col gap-3 border-b border-zinc-200 py-3 pr-(--gutter) pl-(--row-start) sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            {toolbar}
          </div>
        )}
        {list.isPending ? (
          <TableSkeleton rows={4} />
        ) : list.isError ? (
          <QueryError error={list.error} onRetry={() => list.refetch()} />
        ) : rows.length === 0 ? (
          filtered ? (
            <div className="py-10 pr-(--gutter) pl-(--row-start) text-center">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {messages.noResults}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {messages.noResultsBody}
              </p>
            </div>
          ) : (
            empty
          )
        ) : (
          <div className="overflow-x-auto">
            <table className={tableStyles.table}>
              <thead className={tableStyles.thead}>
                <tr>
                  {activeSelection && (
                    <th scope="col" className={clsx(tableStyles.th, "w-px pr-0!")}>
                      <SelectBox
                        label={messages.selectAll}
                        checked={chosen > 0 && chosen === selectableRows.length}
                        indeterminate={chosen > 0 && chosen < selectableRows.length}
                        onChange={(on) =>
                          activeSelection.onChange(
                            on ? new Set(selectableRows.map(rowKey)) : new Set(),
                          )
                        }
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className={clsx(
                        tableStyles.th,
                        column.align === "right" && "text-right",
                        column.hideBelow && hide[column.hideBelow],
                        column.narrow && "w-px pr-0!",
                        column.sortable &&
                          onSortChange &&
                          "group cursor-pointer select-none hover:text-zinc-700 dark:hover:text-zinc-200",
                      )}
                      onClick={
                        column.sortable && onSortChange
                          ? () => handleSortClick(column.id)
                          : undefined
                      }
                    >
                      {column.srOnly ? (
                        <span className="sr-only">{column.header}</span>
                      ) : column.sortable && onSortChange ? (
                        <span className="inline-flex items-center">
                          {column.header}
                          <SortIcon id={column.id} />
                        </span>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={tableStyles.tbody}>
                {rows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className={clsx(
                      activeSelection?.selected.has(rowKey(row))
                        ? "!bg-danger-50 hover:!bg-danger-100 dark:!bg-danger-500/10 dark:hover:!bg-danger-500/20"
                        : tableStyles.row,
                      rowClassName?.(row),
                    )}
                  >
                    {activeSelection && (
                      <td className={clsx(tableStyles.td, "w-px pr-0!")}>
                        {(!canSelect || canSelect(row)) && (
                          <SelectBox
                            label={messages.selectRow}
                            checked={activeSelection.selected.has(rowKey(row))}
                            onChange={(on) => toggle(rowKey(row), on)}
                          />
                        )}
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={clsx(
                          tableStyles.td,
                          column.align === "right" && "text-right tabular-nums",
                          column.hideBelow && hide[column.hideBelow],
                          column.narrow && "w-px pr-0!",
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {list.hasNextPage && (
          <div className="border-t border-zinc-200 py-2 pr-(--gutter) pl-(--row-start) text-center dark:border-white/10">
            <Button
              variant="ghost"
              size="sm"
              loading={list.isFetchingNextPage}
              onClick={() => list.fetchNextPage()}
            >
              {messages.loadMore}
            </Button>
          </div>
        )}
      </TableFrame>
    </>
  );
}
