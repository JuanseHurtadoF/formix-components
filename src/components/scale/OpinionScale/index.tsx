import { type ReactNode, useId, useState } from "react";
import { cn } from "../../../utils/cn";
import { SelectionContext } from "../../shared/selectionContext";

type OpinionScaleProps = {
  id?: string;
  question?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

const OpinionScale = ({
  id,
  question,
  hint,
  error,
  required = false,
  disabled = false,
  value,
  defaultValue,
  onChange,
  className,
  children,
}: OpinionScaleProps) => {
  const groupId = useId();
  const legendId = `${id ?? groupId}-legend`;
  const hintId = hint ? `${id ?? groupId}-hint` : undefined;
  const errorId = error ? `${id ?? groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(optionValue);
    onChange?.(optionValue);
  };

  return (
    <SelectionContext.Provider
      value={{
        selectedValues: currentValue ? [currentValue] : [],
        onSelect: handleSelect,
        isMultiple: false,
        disabled,
        groupName: `${id ?? groupId}-group`,
        layout: "scale",
        hasError: !!error,
      }}
    >
      <fieldset
        aria-describedby={describedBy || undefined}
        className={cn("min-w-0 border-0 p-0 m-0", className)}
        data-component-part="opinion-scale"
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
          className="mt-3 flex flex-wrap gap-2"
          role="radiogroup"
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

export { OpinionScale };
export type { OpinionScaleProps };
