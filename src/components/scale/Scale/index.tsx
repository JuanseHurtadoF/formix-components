import { useId, useState } from "react";
import { cn } from "../../../utils/cn";

type ScaleProps = {
  id?: string;
  question?: string;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
};

const Scale = ({
  id,
  question,
  min = 0,
  max = 10,
  lowLabel,
  highLabel,
  hint,
  error,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  className,
}: ScaleProps) => {
  const groupId = useId();
  const legendId = `${id ?? groupId}-legend`;
  const hintId = hint ? `${id ?? groupId}-hint` : undefined;
  const errorId = error ? `${id ?? groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<number | undefined>(defaultValue);
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
  const currentValue = isControlled ? value : internalValue;
  const displayValue = hoverValue ?? currentValue;

  const handleSelect = (rating: number) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(rating);
    onChange?.(rating);
  };

  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      className={cn("min-w-0 border-0 p-0 m-0", className)}
      data-component-part="scale"
      disabled={disabled}
      id={id ?? groupId}
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
        className="mt-3 flex flex-col gap-2"
        role="radiogroup"
      >
        <div className="flex flex-wrap gap-2">
          {steps.map((rating) => {
            const isSelected = currentValue === rating;
            const isHighlighted =
              displayValue !== undefined && rating <= displayValue;

            return (
              <button
                aria-checked={isSelected}
                aria-label={`${rating}`}
                className={cn(
                  "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 font-medium text-sm transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : isHighlighted
                      ? "border-primary/40 bg-primary-light text-primary dark:bg-primary/10 dark:text-primary-light"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={disabled}
                key={rating}
                onClick={() => handleSelect(rating)}
                onMouseEnter={() => setHoverValue(rating)}
                onMouseLeave={() => setHoverValue(undefined)}
                role="radio"
                type="button"
              >
                {rating}
              </button>
            );
          })}
        </div>

        {(lowLabel || highLabel) && (
          <div className="flex justify-between">
            {lowLabel && (
              <span className="text-stone-500 text-xs dark:text-stone-400">
                {lowLabel}
              </span>
            )}
            {highLabel && (
              <span className="text-stone-500 text-xs dark:text-stone-400">
                {highLabel}
              </span>
            )}
          </div>
        )}
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

export { Scale };
export type { ScaleProps };
