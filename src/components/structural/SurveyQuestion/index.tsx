import { createContext, type ReactNode, useContext, useId } from "react";
import { cn } from "../../../utils/cn";

type SurveyQuestionContextValue = {
  inputId: string;
  hintId: string | undefined;
  errorId: string | undefined;
  required: boolean;
  hasError: boolean;
};

const SurveyQuestionContext = createContext<SurveyQuestionContextValue | null>(
  null
);

const useSurveyQuestion = () => useContext(SurveyQuestionContext);

type SurveyQuestionProps = {
  question: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
  id?: string;
};

const SurveyQuestion = ({
  question,
  hint,
  required = false,
  error,
  children,
  className,
  id,
}: SurveyQuestionProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <SurveyQuestionContext.Provider
      value={{ inputId, hintId, errorId, required, hasError: !!error }}
    >
      <div
        className={cn("flex flex-col gap-2", className)}
        data-component-part="survey-question"
      >
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

        {hint && (
          <p
            className="text-stone-500 text-xs leading-4 dark:text-stone-400"
            id={hintId}
          >
            {hint}
          </p>
        )}

        {children}

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
    </SurveyQuestionContext.Provider>
  );
};

export { SurveyQuestion, SurveyQuestionContext, useSurveyQuestion };
export type { SurveyQuestionProps, SurveyQuestionContextValue };
