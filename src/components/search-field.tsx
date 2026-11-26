import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

/** Compact search box for list toolbars. */
export function SearchField({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
      />
      <input
        type="search"
        autoComplete="off"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="focus:ring-brand-600 dark:focus:ring-brand-400 block w-full rounded-lg bg-white py-1.5 pr-3 pl-9 text-sm text-zinc-900 shadow-xs ring-1 ring-zinc-300 ring-inset placeholder:text-zinc-400 focus:ring-2 focus:outline-none dark:bg-white/5 dark:text-white dark:ring-white/10"
      />
    </div>
  );
}
