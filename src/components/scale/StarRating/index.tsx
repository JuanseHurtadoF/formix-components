import { type KeyboardEvent, type MouseEvent, useId, useState } from "react";
import { cn } from "../../../utils/cn";

type StarRatingProps = {
  question?: string;
  max?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  allowHalf?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

type StarFill = "full" | "half" | "empty";

const StarIcon = ({ fill, id }: { fill: StarFill; id: string }) => {
  const starPath =
    "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

  return (
    <svg
      aria-hidden="true"
      className="size-8"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      {fill === "half" && (
        <defs>
          <clipPath id={`half-clip-${id}`}>
            <rect height="20" width="10" x="0" y="0" />
          </clipPath>
        </defs>
      )}

      {/* Empty/background star */}
      <path
        className="text-stone-200 dark:text-stone-700"
        d={starPath}
        fill="currentColor"
      />

      {/* Filled overlay */}
      {fill !== "empty" && (
        <path
          className="text-yellow-400"
          clipPath={fill === "half" ? `url(#half-clip-${id})` : undefined}
          d={starPath}
          fill="currentColor"
        />
      )}
    </svg>
  );
};

const getStarFill = (
  starIndex: number,
  displayValue: number | undefined,
  allowHalf: boolean
): StarFill => {
  if (displayValue === undefined) return "empty";
  if (displayValue >= starIndex) return "full";
  if (allowHalf && displayValue >= starIndex - 0.5) return "half";
  return "empty";
};

const StarRating = ({
  question,
  max = 5,
  value,
  defaultValue,
  onChange,
  allowHalf = false,
  hint,
  error,
  required = false,
  disabled = false,
  className,
}: StarRatingProps) => {
  const groupId = useId();
  const legendId = `${groupId}-legend`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
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

  const handleMouseMove = (
    e: MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (!allowHalf) {
      setHoverValue(starIndex);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverValue(x < rect.width / 2 ? starIndex - 0.5 : starIndex);
  };

  const handleClick = (
    e: MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    if (!allowHalf) {
      handleSelect(starIndex);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    handleSelect(x < rect.width / 2 ? starIndex - 0.5 : starIndex);
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    const step = allowHalf ? 0.5 : 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      handleSelect(Math.min(max, (currentValue ?? 0) + step));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      handleSelect(Math.max(0, (currentValue ?? 0) - step));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(starIndex);
    }
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <fieldset
      aria-describedby={describedBy || undefined}
      className={cn("min-w-0 border-0 p-0 m-0", className)}
      data-component-part="star-rating"
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
        className="mt-3 flex items-center gap-1"
        role="radiogroup"
      >
        {stars.map((starIndex) => {
          const fill = getStarFill(starIndex, displayValue, allowHalf);
          const starId = `${groupId}-star-${starIndex}`;
          const isSelected = allowHalf
            ? currentValue === starIndex || currentValue === starIndex - 0.5
            : currentValue === starIndex;
          const label = allowHalf
            ? `${starIndex - 0.5} or ${starIndex} star${starIndex !== 1 ? "s" : ""}`
            : `${starIndex} star${starIndex !== 1 ? "s" : ""}`;

          return (
            <button
              aria-checked={isSelected}
              aria-label={label}
              className={cn(
                "cursor-pointer rounded-sm transition-transform hover:scale-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              )}
              disabled={disabled}
              key={starIndex}
              onClick={(e) => handleClick(e, starIndex)}
              onKeyDown={(e) => handleKeyDown(e, starIndex)}
              onMouseEnter={(e) => handleMouseMove(e, starIndex)}
              onMouseLeave={() => setHoverValue(undefined)}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              role="radio"
              type="button"
            >
              <StarIcon fill={fill} id={starId} />
            </button>
          );
        })}

        {currentValue !== undefined && (
          <span
            aria-live="polite"
            className="ml-2 text-sm text-stone-500 dark:text-stone-400"
          >
            {currentValue} / {max}
          </span>
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

export { StarRating };
export type { StarRatingProps };
