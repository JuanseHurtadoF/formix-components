import { type ChangeEvent, useId, useState } from "react";
import { cn } from "../../../utils/cn";

type TextInputProps = {
  id?: string;
  question?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Renders a textarea instead of a single-line input */
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
};

const TextInput = ({
  id,
  question,
  placeholder,
  hint,
  error,
  required = false,
  disabled = false,
  multiline = false,
  rows = 4,
  maxLength,
  showCounter = false,
  value,
  defaultValue,
  onChange,
  name,
  className,
}: TextInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  };

  const charCount = currentValue.length;
  const isNearLimit = maxLength ? charCount / maxLength >= 0.8 : false;
  const isAtLimit = maxLength ? charCount >= maxLength : false;

  const sharedInputClass = cn(
    "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-stone-50",
    error && "border-red-400 focus-visible:ring-red-400",
    "dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:disabled:bg-stone-800"
  );

  return (
    <div className={cn("flex flex-col gap-2", className)} data-component-part="text-input">
      {question && (
        <label
          className="font-medium text-sm text-stone-900 leading-5 dark:text-stone-100"
          htmlFor={inputId}
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
        </label>
      )}

      {hint && (
        <p
          className="text-stone-500 text-xs leading-4 dark:text-stone-400"
          id={hintId}
        >
          {hint}
        </p>
      )}

      {multiline ? (
        <div className="flex flex-col gap-1">
          <textarea
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            className={cn(sharedInputClass, "resize-y")}
            disabled={disabled}
            id={inputId}
            maxLength={maxLength}
            name={name}
            onChange={handleChange}
            placeholder={placeholder}
            rows={rows}
            value={currentValue}
          />
          {showCounter && maxLength && (
            <p
              aria-live="polite"
              className={cn(
                "self-end text-xs tabular-nums",
                isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-stone-400 dark:text-stone-500"
              )}
            >
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      ) : (
        <input
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          className={sharedInputClass}
          disabled={disabled}
          id={inputId}
          name={name}
          onChange={handleChange}
          placeholder={placeholder}
          type="text"
          value={currentValue}
        />
      )}

      {error && (
        <p
          className="text-red-500 text-xs leading-4"
          id={errorId}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export { TextInput };
export type { TextInputProps };
