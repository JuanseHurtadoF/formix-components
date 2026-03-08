import { type ChangeEvent, useId, useState } from "react";
import { SurveyQuestion, useSurveyQuestion } from "../../structural/SurveyQuestion";
import { cn } from "../../../utils/cn";

type SliderProps = {
  question?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  labels?: string[];
  showValue?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string;
  id?: string;
  className?: string;
};

type SliderCoreProps = Omit<SliderProps, "question" | "hint" | "error">;

const SliderCore = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  labels,
  showValue = false,
  disabled,
  id,
  className,
}: SliderCoreProps) => {
  const ctx = useSurveyQuestion();
  const generatedId = useId();
  const inputId = id ?? ctx?.inputId ?? generatedId;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? min);
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (!isControlled) setInternalValue(newVal);
    onChange?.(newVal);
  };

  const percentage = ((currentValue - min) / (max - min)) * 100;
  const describedBy = [ctx?.hintId, ctx?.errorId].filter(Boolean).join(" ");

  return (
    <div className={cn("flex flex-col gap-3", className)} data-component-part="slider">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          {/* Track background */}
          <div className="absolute inset-y-1/2 h-2 w-full -translate-y-1/2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <input
            aria-describedby={describedBy || undefined}
            aria-invalid={ctx?.hasError || undefined}
            aria-required={ctx?.required || undefined}
            aria-valuemax={max}
            aria-valuemin={min}
            aria-valuenow={currentValue}
            className={cn(
              "relative w-full cursor-pointer appearance-none bg-transparent",
              "h-5",
              "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
              "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
              "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary",
              "[&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform",
              "[&::-webkit-slider-thumb]:hover:scale-110",
              "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full",
              "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white",
              "focus-visible:outline-none",
              "[&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-primary [&:focus-visible::-webkit-slider-thumb]:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            disabled={disabled}
            id={inputId}
            max={max}
            min={min}
            onChange={handleChange}
            step={step}
            type="range"
            value={currentValue}
          />
        </div>

        {showValue && (
          <span
            aria-live="polite"
            className="w-10 text-right font-medium text-sm text-stone-900 tabular-nums dark:text-stone-100"
          >
            {currentValue}
          </span>
        )}
      </div>

      {labels && labels.length > 0 && (
        <div className="flex justify-between">
          {labels.map((label, i) => (
            <span
              className="text-stone-500 text-xs dark:text-stone-400"
              key={i}
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const Slider = (props: SliderProps) => {
  const ctx = useSurveyQuestion();

  if (!ctx && props.question !== undefined) {
    const { question, hint, error, required, ...inputProps } = props;
    return (
      <SurveyQuestion error={error} hint={hint} question={question} required={required}>
        <SliderCore {...inputProps} />
      </SurveyQuestion>
    );
  }

  return <SliderCore {...props} />;
};

export { Slider };
export type { SliderProps };
