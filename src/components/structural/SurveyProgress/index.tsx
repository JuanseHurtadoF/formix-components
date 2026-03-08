import { cn } from "../../../utils/cn";

type SurveyProgressProps = {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
};

const SurveyProgress = ({
  current,
  total,
  showLabel = false,
  className,
}: SurveyProgressProps) => {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  const label = `Question ${current} of ${total}`;

  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-component-part="survey-progress"
    >
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-stone-500 text-xs dark:text-stone-400">
            {label}
          </span>
          <span className="font-medium text-stone-700 text-xs dark:text-stone-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        aria-label={label}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={current}
        className="h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700"
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { SurveyProgress };
export type { SurveyProgressProps };
