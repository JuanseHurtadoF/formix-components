import { type ReactNode, useId, useState } from "react";
import { cn } from "../../../utils/cn";
import {
  SelectionContext,
  type SelectionLayout,
} from "../../shared/selectionContext";

type MultiSelectProps = {
  id?: string;
  question?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** "list" (default) | "horizontal" | "pill" */
  layout?: SelectionLayout;
  name?: string;
  className?: string;
  children: ReactNode;
};

const MultiSelect = ({
  id,
  question,
  hint,
  error,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  layout = "list",
  name,
  className,
  children,
}: MultiSelectProps) => {
  const groupId = useId();
  const legendId = `${id ?? groupId}-legend`;
  const hintId = hint ? `${id ?? groupId}-hint` : undefined;
  const errorId = error ? `${id ?? groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    const next = currentValue.includes(optionValue)
      ? currentValue.filter((v) => v !== optionValue)
      : [...currentValue, optionValue];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedValues: currentValue,
        onSelect: handleSelect,
        isMultiple: true,
        disabled,
        groupName: name ?? `${id ?? groupId}-group`,
        layout,
        hasError: !!error,
      }}
    >
      <fieldset
        aria-describedby={describedBy || undefined}
        className={cn("min-w-0 border-0 p-0 m-0", className)}
        data-component-part="multi-select"
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
          className={cn(
            "mt-3 flex gap-3",
            layout === "list" ? "flex-col" : "flex-row flex-wrap"
          )}
          role="group"
        >
          {children}
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
    </SelectionContext.Provider>
  );
};

export { MultiSelect };
export type { MultiSelectProps };
