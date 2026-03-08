import { type ReactNode, useId } from "react";
import { cn } from "../../../utils/cn";

type SectionProps = {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

const Section = ({
  id,
  title,
  description,
  children,
  className,
}: SectionProps) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn("flex flex-col gap-6", className)}
      data-component-part="section"
      id={id}
    >
      <div className="flex flex-col gap-1">
        <h2
          className="font-semibold text-base text-stone-900 leading-6 dark:text-stone-100"
          id={headingId}
        >
          {title}
        </h2>
        {description && (
          <p className="text-sm text-stone-500 leading-5 dark:text-stone-400">
            {description}
          </p>
        )}
      </div>

      <div
        className="flex flex-col gap-6"
        data-component-part="section-content"
      >
        {children}
      </div>
    </section>
  );
};

export { Section };
export type { SectionProps };
