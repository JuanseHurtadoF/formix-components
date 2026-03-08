import { useId, type ReactNode } from "react";
import { cn } from "../../../utils/cn";
import { useSelection } from "../selectionContext";

type OptionProps = {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

const Option = ({
  value,
  disabled: optionDisabled = false,
  className,
  children,
}: OptionProps) => {
  const ctx = useSelection();
  const optionId = useId();

  // Outside a parent context (e.g. standalone Storybook preview)
  if (!ctx) {
    return <span className={cn("text-sm text-stone-900 dark:text-stone-100", className)}>{children}</span>;
  }

  const { selectedValues, onSelect, isMultiple, disabled, groupName, layout } = ctx;
  const isDisabled = disabled || optionDisabled;
  const isSelected = selectedValues.includes(value);

  // ── Pill layout ────────────────────────────────────────────────────────────
  if (layout === "pill") {
    return (
      <button
        aria-checked={isSelected}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isSelected
            ? "border-primary bg-primary text-white"
            : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800",
          isDisabled && "pointer-events-none cursor-not-allowed opacity-50",
          className
        )}
        disabled={isDisabled}
        onClick={() => onSelect(value)}
        role={isMultiple ? "checkbox" : "radio"}
        type="button"
      >
        {children}
      </button>
    );
  }

  // ── Scale layout (OpinionScale) ────────────────────────────────────────────
  if (layout === "scale") {
    return (
      <label
        className={cn(
          "flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border px-3 py-3 text-center transition-colors min-w-[72px]",
          isSelected
            ? "border-primary bg-primary-light text-primary dark:bg-primary/10 dark:text-primary-light dark:border-primary"
            : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800",
          isDisabled && "cursor-not-allowed opacity-50",
          className
        )}
        htmlFor={optionId}
      >
        <input
          checked={isSelected}
          className="sr-only"
          disabled={isDisabled}
          id={optionId}
          name={groupName}
          onChange={() => onSelect(value)}
          type="radio"
          value={value}
        />
        <span className="text-xs font-medium leading-tight">{children}</span>
      </label>
    );
  }

  // ── List / horizontal layout (default) ────────────────────────────────────
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
        isSelected
          ? "border-primary bg-primary-light dark:bg-primary/10"
          : "border-stone-200 bg-white hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:hover:border-stone-600",
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
      htmlFor={optionId}
    >
      <input
        checked={isSelected}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        disabled={isDisabled}
        id={optionId}
        name={groupName}
        onChange={() => onSelect(value)}
        type={isMultiple ? "checkbox" : "radio"}
        value={value}
      />
      <span className="flex min-w-0 items-center gap-2 text-sm text-stone-900 leading-5 dark:text-stone-100">
        {children}
      </span>
    </label>
  );
};

export { Option };
export type { OptionProps };
