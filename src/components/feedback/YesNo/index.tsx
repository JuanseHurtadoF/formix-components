import { type KeyboardEvent, useId, useState } from "react";
import { cn } from "../../../utils/cn";

type YesNoProps = {
  question?: string;
  value?: boolean | null;
  defaultValue?: boolean | null;
  onChange?: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const YesNo = ({
  question,
  value,
  defaultValue = null,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
  hint,
  error,
  required = false,
  disabled = false,
  className,
}: YesNoProps) => {
  const groupId = useId();
  const legendId = `${groupId}-legend`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<boolean | null>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (selected: boolean) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(selected);
    onChange?.(selected);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    selected: boolean
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(selected);
    }
  };

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      className={cn("min-w-0 border-0 p-0 m-0", className)}
      data-component-part="yes-no"
      disabled={disabled}
    >
      {question && (
        <legend
          className="font-medium text-sm text-stone-900 leading-5 dark:text-stone-100"
          id={legendId}
        >
          {question}
          {required && (
            <>
              <span aria-hidden="true" className="ml-1 text-red-500">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>
          )}
        </legend>
      )}

      {hint && (
        <p
          className="mt-1 text-stone-500 text-xs leading-4 dark:text-stone-400"
          id={hintId}
        >
          {hint}
        </p>
      )}

      <div
        aria-labelledby={question ? legendId : undefined}
        aria-required={required || undefined}
        className="mt-3 flex gap-3"
        role="radiogroup"
      >
        <button
          aria-checked={currentValue === true}
          aria-label={yesLabel}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-4 font-medium text-base transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            currentValue === true
              ? "border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400"
              : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          disabled={disabled}
          onClick={() => handleSelect(true)}
          onKeyDown={(e) => handleKeyDown(e, true)}
          role="radio"
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M4.5 12.75l6 6 9-13.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {yesLabel}
        </button>

        <button
          aria-checked={currentValue === false}
          aria-label={noLabel}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border px-6 py-4 font-medium text-base transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            currentValue === false
              ? "border-red-400 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          disabled={disabled}
          onClick={() => handleSelect(false)}
          onKeyDown={(e) => handleKeyDown(e, false)}
          role="radio"
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {noLabel}
        </button>
      </div>

      {error && (
        <p
          className="mt-2 text-red-500 text-xs leading-4"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
};

export { YesNo };
export type { YesNoProps };
