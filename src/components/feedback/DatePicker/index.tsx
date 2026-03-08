import { type ChangeEvent, useId, useState } from "react";
import { SurveyQuestion, useSurveyQuestion } from "../../structural/SurveyQuestion";
import { cn } from "../../../utils/cn";

type DatePickerProps = {
  question?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
};

type DatePickerCoreProps = Omit<DatePickerProps, "question" | "hint" | "error">;

const DatePickerCore = ({
  value,
  defaultValue,
  onChange,
  min,
  max,
  required,
  disabled,
  id,
  name,
  className,
}: DatePickerCoreProps) => {
  const ctx = useSurveyQuestion();
  const generatedId = useId();
  const inputId = id ?? ctx?.inputId ?? generatedId;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  };

  const describedBy = [ctx?.hintId, ctx?.errorId].filter(Boolean).join(" ");

  return (
    <input
      aria-describedby={describedBy || undefined}
      aria-invalid={ctx?.hasError || undefined}
      aria-required={(ctx?.required ?? required) || undefined}
      className={cn(
        "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-stone-50",
        ctx?.hasError && "border-red-400 focus-visible:ring-red-400",
        "dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:disabled:bg-stone-800",
        "[color-scheme:light] dark:[color-scheme:dark]",
        className
      )}
      disabled={disabled}
      id={inputId}
      max={max}
      min={min}
      name={name}
      onChange={handleChange}
      required={required}
      type="date"
      value={currentValue}
    />
  );
};

const DatePicker = (props: DatePickerProps) => {
  const ctx = useSurveyQuestion();

  if (!ctx && props.question !== undefined) {
    const { question, hint, error, ...inputProps } = props;
    return (
      <SurveyQuestion error={error} hint={hint} question={question} required={props.required}>
        <DatePickerCore {...inputProps} />
      </SurveyQuestion>
    );
  }

  return <DatePickerCore {...props} />;
};

export { DatePicker };
export type { DatePickerProps };
