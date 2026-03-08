# @surveys/components — Project Memory

## Project Location
- Survey library source: `/Users/juanse/Desktop/formify/src/`
- Mintlify reference: `/Users/juanse/Desktop/formify/components/`
- Spec document: `/Users/juanse/Desktop/formify/SPEC.md`

## Architecture (CURRENT — after Props vs Children refactor)
- **6 categories**: shared / structural / input / choice / scale / feedback
- Each component: single `index.tsx` + `[Name].stories.tsx`
- `src/utils/cn.ts` → clsx + tailwind-merge
- `src/styles.css` → Tailwind v4 CSS entry
- `src/components/index.ts` → category barrel
- `src/index.ts` → top-level barrel

## Props vs Children Rule (enforced)
- **Props**: configuration — id, question, placeholder, hint, min, max, required, disabled, onChange, etc.
- **Children**: selectable items (Option), grouped content (Section), rich content
- `options={[]}` prop is BANNED — all selectable items must be `<Option>` children
- `Option.value` must be stable snake_case string, never the display label

## Component List (current)
- **Shared**: `Option` (used inside SingleSelect, MultiSelect, OpinionScale)
- **Structural**: `Section` (was SurveySection), `SurveyProgress`
- **Input**: `TextInput` (merged ShortAnswer+LongAnswer, use `multiline` prop), `Slider`
- **Choice**: `SingleSelect` (was MultipleChoice, absorbs PillChoice via `layout="pill"`), `MultiSelect`
- **Scale**: `Scale` (was RatingScale), `StarRating`, `OpinionScale` (uses Option children)
- **Feedback**: `YesNo`, `DatePicker`
- **Internal only (not exported)**: `SurveyQuestion`, `selectionContext`

## SelectionContext Pattern
- `src/components/shared/selectionContext.ts` — internal context shared by SingleSelect, MultiSelect, OpinionScale
- `SelectionLayout = "list" | "horizontal" | "pill" | "scale"`
- `Option` consumes `SelectionContext` to render correctly for the parent's layout
- If no context (standalone): Option renders `<span>{children}</span>`

## Import Conventions
- All imports use relative paths (no `@/` alias)
- React types imported by name: `import { type ChangeEvent, useId, useState } from "react"`
- No `import React from "react"` namespace usage
