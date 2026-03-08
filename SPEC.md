# @surveys/components — Architecture Specification

> Written after a full audit of `@mintlify/components` source code.
> All conventions, patterns, and quality standards are derived from that audit.

---

## PART 1: AUDIT FINDINGS — @mintlify/components

### 1.1 Folder / File Structure

```
packages/components/src/
  components/
    badge/
      badge.tsx             ← component implementation + type definitions
      badge.stories.tsx     ← Storybook stories (all variants)
      index.ts              ← re-export component + named types
    tabs/
      tabs.tsx
      tabs.stories.tsx
      index.ts
    accordion/
      accordion.tsx
      accordion-cover.tsx   ← sub-component
      accordion-group.tsx   ← compound child
      accordion-url-utils.ts
      accordion.stories.tsx
      index.ts
    ...
    index.ts                ← barrel: `export * from "./badge"; export * from "./tabs"; ...`
  constants/
  hooks/
  icons/
  utils/
    cn.ts                   ← clsx + tailwind-merge helper
  index.ts                  ← top-level: `export * from "./components"; export { cn }`
  styles.css                ← Tailwind v4 CSS entry
```

### 1.2 Single Component Structure

**`badge.tsx`** — Component file:
- Named union type aliases for variants: `type BadgeSize = "xs" | "sm" | "md" | "lg"`
- Named `[Component]Props` type (not `interface`)
- Named function declaration (not default export, not arrow in most cases)
- Variant maps as `Record<VariantType, string>` constant objects for class lookup
- Bottom of file: `export { Badge }; export type { BadgeSize, BadgeProps, ... }`

**`index.ts`** — Re-export file (always two blocks):
```ts
export type { BadgeColor, BadgeProps, BadgeShape, BadgeSize } from "./badge";
export { Badge } from "./badge";
```

**`badge.stories.tsx`** — Storybook:
```ts
import type { Meta, StoryObj } from "@storybook/react-vite";
const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { color: { control: "select", options: [...] } },
};
export default meta;
type Story = StoryObj<typeof Badge>;
export const Default: Story = { args: { children: "Badge", color: "gray" } };
export const Colors: Story = { render: () => <div>...</div> };
```

### 1.3 Compound / Grouped Components

**Pattern A — `Object.assign` on root component (Tabs, Accordion):**
```ts
// tabs.tsx
const TabsRoot = (...) => { ... };
const TabsItem = (...) => { ... };
export const Tabs = Object.assign(TabsRoot, { Item: TabsItem });
export type { TabsProps, TabsItemProps };

// Usage
<Tabs><Tabs.Item title="x">...</Tabs.Item></Tabs>
```

**Pattern B — Assembled in `index.ts` (Accordion):**
```ts
// accordion/index.ts
import { Accordion as AccordionBase } from "./accordion";
import { AccordionGroup } from "./accordion-group";
export const Accordion = Object.assign(AccordionBase, { Group: AccordionGroup });
```

### 1.4 Tailwind Usage

- **Tailwind v4** — no `tailwind.config.ts`, CSS-first configuration via `styles.css`
- Direct utility classes everywhere. No CSS modules, no inline `style` except for CSS custom properties
- **CSS custom properties for theming** — set per-element via Tailwind's `[--name:value]` JIT syntax:
  ```ts
  "[--color-bg:#F5F5F5] dark:[--color-bg:#262727]"
  // then consumed as:
  "bg-(--color-bg) text-(--color-text)"
  ```
- **Variant maps** as `Record<VariantName, string>` for clean lookup
- `data-*` attribute selectors for state styling:
  ```ts
  "data-[shape='pill']:rounded-full"
  "data-disabled:cursor-not-allowed"
  ```
- `cn()` utility = `twMerge(clsx(...))` for conditional composition

### 1.5 Dark Mode

- Tailwind v4 custom variant in `styles.css`:
  ```css
  @custom-variant dark (&:is(.dark *));
  ```
- Used uniformly via `dark:` prefix: `dark:text-stone-200`, `dark:bg-blue-600/20`
- CSS custom properties set separately for light/dark within one class string:
  ```ts
  "[--color-bg:#F5F5F5] dark:[--color-bg:#262727]"
  ```

### 1.6 Main Barrel Export

```ts
// src/index.ts
export * from "./components";
export { cn } from "./utils/cn";

// src/components/index.ts
export * from "./accordion";
export * from "./badge";
// ...one line per component folder

// src/components/badge/index.ts
export type { BadgeColor, BadgeProps, BadgeShape, BadgeSize } from "./badge";
export { Badge } from "./badge";
```

### 1.7 Storybook Setup

- Package: `@storybook/react-vite`
- Tags: `["autodocs"]` on every component meta
- `parameters.layout`: `"centered"` for small components, `"padded"` for wider ones
- `argTypes` mapped to Storybook controls (`"select"`, `"boolean"`, `"number"`)
- Each story either uses `args` (for Storybook controls) or `render` (for multi-instance showcase)

### 1.8 TypeScript Type Exports

- Types defined in component file with `type` keyword (not `interface`)
- Component folder `index.ts` always has `export type { ... } from "./component"`
- Types are named `[ComponentName]Props` for the main prop type
- Sub-types are named `[ComponentName][Dimension]` (e.g., `BadgeSize`, `BadgeColor`)

---

## PART 2: @surveys/components ARCHITECTURE SPEC

### 2.1 Category System

Mirroring Mintlify's Display / Interactive / Information pattern, adapted for surveys:

| Category | Purpose | Components |
|---|---|---|
| **Structural** | Layout, grouping, flow | `SurveyQuestion`, `SurveySection`, `SurveyProgress` |
| **Input** | Free-form text / numeric input | `ShortAnswer`, `LongAnswer`, `Slider` |
| **Choice** | Selection from options | `MultipleChoice`, `MultiSelect`, `Dropdown`, `PillChoice` |
| **Scale** | Rating and opinion scales | `RatingScale`, `StarRating`, `OpinionScale` |
| **Feedback** | Binary or date responses | `YesNo`, `DatePicker` |

### 2.2 Component Specifications

---

#### STRUCTURAL

##### `SurveyQuestion`
Wrapper that provides consistent question label, hint text, required indicator, and error state for any input component.

```ts
type SurveyQuestionProps = {
  question: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};
```

Usage:
```jsx
<SurveyQuestion question="What is your name?" hint="First and last name" required>
  <ShortAnswer placeholder="John Doe" />
</SurveyQuestion>
```

Accessibility: `<label>` wraps or is associated via `htmlFor` to the child input; `aria-describedby` points to hint/error; `aria-required` on the label element.

---

##### `SurveySection`
Groups questions under a heading with optional description.

```ts
type SurveySectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};
```

Usage:
```jsx
<SurveySection title="About You" description="Tell us a little about yourself.">
  <SurveyQuestion question="Name" required>...</SurveyQuestion>
  <SurveyQuestion question="Age">...</SurveyQuestion>
</SurveySection>
```

Accessibility: `<section>` with `aria-labelledby` pointing to the heading.

---

##### `SurveyProgress`
Progress bar for multi-step surveys.

```ts
type SurveyProgressProps = {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
};
```

Usage:
```jsx
<SurveyProgress current={3} total={10} showLabel />
```

Accessibility: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.

---

#### INPUT

##### `ShortAnswer`
Single-line text input.

```ts
type ShortAnswerProps = {
  question?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  hint?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
};
```

Usage:
```jsx
<ShortAnswer
  question="What is your email?"
  placeholder="you@example.com"
  required
  onChange={(v) => setEmail(v)}
/>
```

Accessibility: `<label>` + `<input type="text">` pair; `aria-required`, `aria-describedby` for hint/error.

---

##### `LongAnswer`
Textarea with optional character counter.

```ts
type LongAnswerProps = {
  question?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  hint?: string;
  disabled?: boolean;
  error?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  id?: string;
  name?: string;
  className?: string;
};
```

Usage:
```jsx
<LongAnswer
  question="Tell us your feedback"
  rows={5}
  maxLength={500}
  showCounter
  onChange={(v) => setFeedback(v)}
/>
```

Accessibility: `<label>` + `<textarea>`; counter region has `aria-live="polite"`.

---

##### `Slider`
Range input with optional tick labels.

```ts
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
```

Usage:
```jsx
<Slider
  question="How satisfied are you?"
  min={0}
  max={100}
  step={10}
  showValue
  labels={["Not at all", "Neutral", "Very satisfied"]}
  onChange={(v) => setScore(v)}
/>
```

Accessibility: `<input type="range">` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-label`.

---

#### CHOICE

##### `MultipleChoice`
Radio group (single selection). Supports both `options` array prop and `<MultipleChoice.Option>` compound children.

```ts
type MultipleChoiceOption = {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
};

type MultipleChoiceProps = {
  question?: string;
  options?: MultipleChoiceOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  layout?: "vertical" | "horizontal";
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
};

// Compound sub-component
type MultipleChoiceOptionProps = MultipleChoiceOption & {
  className?: string;
};
```

Usage (array):
```jsx
<MultipleChoice
  question="What is your role?"
  options={[
    { value: "dev", label: "Developer" },
    { value: "designer", label: "Designer" },
  ]}
  onChange={(v) => setRole(v)}
/>
```

Usage (compound):
```jsx
<MultipleChoice question="What is your role?" onChange={(v) => setRole(v)}>
  <MultipleChoice.Option value="dev" label="Developer" />
  <MultipleChoice.Option value="designer" label="Designer" />
</MultipleChoice>
```

Accessibility: `role="radiogroup"`, `aria-labelledby`; each option is `<input type="radio">` + `<label>`.

---

##### `MultiSelect`
Checkbox group (multiple selections). Same structure as `MultipleChoice` but allows multiple values.

```ts
type MultiSelectProps = {
  question?: string;
  options?: MultipleChoiceOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  layout?: "vertical" | "horizontal";
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
};

// Compound sub-component (same shape as MultipleChoice.Option)
type MultiSelectOptionProps = MultipleChoiceOption & {
  className?: string;
};
```

Usage:
```jsx
<MultiSelect
  question="Which features do you use?"
  options={[{ value: "a", label: "Feature A" }, { value: "b", label: "Feature B" }]}
  onChange={(vals) => setFeatures(vals)}
/>
```

Accessibility: `role="group"`, `aria-labelledby`; each option is `<input type="checkbox">` + `<label>`.

---

##### `Dropdown`
Select input for single choice from a list.

```ts
type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type DropdownProps = {
  question?: string;
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
};
```

Usage:
```jsx
<Dropdown
  question="Select your country"
  placeholder="Choose a country..."
  options={[{ value: "us", label: "United States" }]}
  onChange={(v) => setCountry(v)}
/>
```

Accessibility: `<label>` + `<select>` pairing; `aria-required` when required.

---

##### `PillChoice`
Pill-style single or multi-select. Mode determined by `multiple` prop.

```ts
type PillChoiceOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type PillChoiceProps = {
  question?: string;
  options: PillChoiceOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};
```

Usage:
```jsx
<PillChoice
  question="Select your interests"
  options={[{ value: "tech", label: "Tech" }, { value: "art", label: "Art" }]}
  multiple
  onChange={(v) => setInterests(v as string[])}
/>
```

Accessibility: `role="group"` wrapping pill buttons with `aria-pressed` for multi, `aria-checked` + `role="radio"` for single.

---

#### SCALE

##### `RatingScale`
Numeric scale (e.g., 1–10 NPS).

```ts
type RatingScaleProps = {
  question?: string;
  min?: number;
  max?: number;
  lowLabel?: string;
  highLabel?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};
```

Usage:
```jsx
<RatingScale
  question="How likely are you to recommend us?"
  min={0}
  max={10}
  lowLabel="Not at all likely"
  highLabel="Extremely likely"
  onChange={(v) => setNps(v)}
/>
```

Accessibility: `role="radiogroup"`, `aria-labelledby`; each number is `<button>` with `aria-pressed` or `<input type="radio">`.

---

##### `StarRating`
Star-based rating with optional half-star support.

```ts
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
```

Usage:
```jsx
<StarRating
  question="Rate your experience"
  max={5}
  allowHalf
  onChange={(v) => setRating(v)}
/>
```

Accessibility: `role="radiogroup"`, each star is an `<input type="radio">` with visually hidden labels ("1 star", "2 stars", etc.); keyboard navigable.

---

##### `OpinionScale`
Labeled Likert-style scale.

```ts
type OpinionScaleProps = {
  question?: string;
  options?: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};
```

Default options: `["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]`

Usage:
```jsx
<OpinionScale
  question="The product met my expectations."
  onChange={(v) => setOpinion(v)}
/>
```

Accessibility: `role="radiogroup"`, each option is `<input type="radio">` + `<label>`.

---

#### FEEDBACK

##### `YesNo`
Binary choice with Yes/No buttons.

```ts
type YesNoProps = {
  question?: string;
  value?: boolean | null;
  defaultValue?: boolean | null;
  onChange?: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};
```

Usage:
```jsx
<YesNo
  question="Would you recommend us to a friend?"
  yesLabel="Yes"
  noLabel="No"
  onChange={(v) => setRecommend(v)}
/>
```

Accessibility: `role="radiogroup"`, two `<button>` elements with `aria-pressed` or `<input type="radio">` pattern.

---

##### `DatePicker`
Native date input.

```ts
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
```

Usage:
```jsx
<DatePicker
  question="When did you start using our product?"
  min="2020-01-01"
  onChange={(v) => setDate(v)}
/>
```

Accessibility: `<label>` + `<input type="date">` pair; `aria-required`, `aria-describedby`.

---

### 2.3 MDX Integration Strategy

All components are React components with no special MDX config required. They work in `.mdx` files by importing directly:

```mdx
import { ShortAnswer, SurveyQuestion } from '@surveys/components';

<SurveyQuestion question="What is your name?" required>
  <ShortAnswer placeholder="Your name" />
</SurveyQuestion>
```

Requirements for MDX compatibility:
- No server-only imports (no `fs`, `path`, etc.)
- No `"use client"` assumptions — all interactivity handled via React hooks internally
- All state is self-contained (uncontrolled mode) by default, so components render without external state management in MDX
- CSS is imported separately via `@surveys/components/styles.css` in the MDX host's layout

---

### 2.4 Accessibility Requirements Per Component

| Component | ARIA Role | Keyboard Nav | Label Association |
|---|---|---|---|
| `SurveyQuestion` | None (wrapper) | N/A | `<label htmlFor>` or wrapping |
| `SurveySection` | `region` via `<section>` | N/A | `aria-labelledby` → heading |
| `SurveyProgress` | `progressbar` | N/A | `aria-valuenow/min/max`, `aria-label` |
| `ShortAnswer` | N/A | Standard text input | `<label>` + `htmlFor` |
| `LongAnswer` | N/A | Standard textarea | `<label>` + `htmlFor` |
| `Slider` | N/A | Arrow keys on `<input type="range">` | `<label>` + `htmlFor` |
| `MultipleChoice` | `radiogroup` | Arrow keys between radios | `aria-labelledby` on group |
| `MultiSelect` | `group` | Tab between checkboxes | `aria-labelledby` on group |
| `Dropdown` | N/A | Native `<select>` keyboard | `<label>` + `htmlFor` |
| `PillChoice` (single) | `radiogroup` | Arrow keys | `aria-labelledby` on group |
| `PillChoice` (multi) | `group` | Tab + Space/Enter to toggle | `aria-labelledby` on group |
| `RatingScale` | `radiogroup` | Arrow keys | `aria-labelledby` on group |
| `StarRating` | `radiogroup` | Arrow keys | Visually hidden text labels |
| `OpinionScale` | `radiogroup` | Arrow keys | `aria-labelledby` on group |
| `YesNo` | `radiogroup` | Tab + Enter/Space | `aria-labelledby` on group |
| `DatePicker` | N/A | Native date input keyboard | `<label>` + `htmlFor` |

Focus rings: all interactive elements have visible focus ring via `focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`.

---

### 2.5 File / Folder Structure

```
src/
  components/
    structural/
      SurveyQuestion/
        index.tsx
        SurveyQuestion.stories.tsx
      SurveySection/
        index.tsx
        SurveySection.stories.tsx
      SurveyProgress/
        index.tsx
        SurveyProgress.stories.tsx
    input/
      ShortAnswer/
        index.tsx
        ShortAnswer.stories.tsx
      LongAnswer/
        index.tsx
        LongAnswer.stories.tsx
      Slider/
        index.tsx
        Slider.stories.tsx
    choice/
      MultipleChoice/
        index.tsx
        MultipleChoice.stories.tsx
      MultiSelect/
        index.tsx
        MultiSelect.stories.tsx
      Dropdown/
        index.tsx
        Dropdown.stories.tsx
      PillChoice/
        index.tsx
        PillChoice.stories.tsx
    scale/
      RatingScale/
        index.tsx
        RatingScale.stories.tsx
      StarRating/
        index.tsx
        StarRating.stories.tsx
      OpinionScale/
        index.tsx
        OpinionScale.stories.tsx
    feedback/
      YesNo/
        index.tsx
        YesNo.stories.tsx
      DatePicker/
        index.tsx
        DatePicker.stories.tsx
    index.ts      ← barrel: re-exports all component folders
  utils/
    cn.ts         ← clsx + tailwind-merge (same as Mintlify)
  index.ts        ← top-level: `export * from "./components"; export { cn }`
  styles.css      ← Tailwind v4 CSS entry with @theme, dark variant, base styles
SPEC.md
```

**Note:** Each component is a single `index.tsx` file (not split into `Component.tsx` + `index.ts`) because all survey components are focused enough to not require sub-file decomposition. The `index.ts` pattern (separate re-export file) is not needed at the component level for this library.

---

### 2.6 Barrel Export Shape (`src/index.ts`)

```ts
// src/index.ts
export * from "./components";
export { cn } from "./utils/cn";

// src/components/index.ts
export * from "./structural/SurveyQuestion";
export * from "./structural/SurveySection";
export * from "./structural/SurveyProgress";
export * from "./input/ShortAnswer";
export * from "./input/LongAnswer";
export * from "./input/Slider";
export * from "./choice/MultipleChoice";
export * from "./choice/MultiSelect";
export * from "./choice/Dropdown";
export * from "./choice/PillChoice";
export * from "./scale/RatingScale";
export * from "./scale/StarRating";
export * from "./scale/OpinionScale";
export * from "./feedback/YesNo";
export * from "./feedback/DatePicker";

// src/components/structural/SurveyQuestion/index.tsx (bottom of file)
export { SurveyQuestion };
export type { SurveyQuestionProps };
```

---

### 2.7 Tech Stack

- **React** 18+ / 19 (peer dep)
- **TypeScript** 5.x — strict mode, `type` over `interface`, named exports only
- **Tailwind v4** — CSS-first config, `@import "tailwindcss"` in `styles.css`
- **clsx + tailwind-merge** — `cn()` utility
- **Storybook** with `@storybook/react-vite`
- **Vite** + `vite-plugin-dts` for library build
- **Biome** for linting/formatting

---

### 2.8 Controlled + Uncontrolled Pattern

Every input component supports both modes:

```tsx
// Controlled
const [val, setVal] = useState("");
<ShortAnswer value={val} onChange={setVal} />

// Uncontrolled (works in MDX with no external state)
<ShortAnswer defaultValue="" />
```

Implementation: use React's standard pattern — if `value` is provided externally, use it; otherwise maintain internal state from `defaultValue`.

```tsx
const isControlled = value !== undefined;
const [internalValue, setInternalValue] = useState(defaultValue ?? "");
const currentValue = isControlled ? value : internalValue;
const handleChange = (newVal: string) => {
  if (!isControlled) setInternalValue(newVal);
  onChange?.(newVal);
};
```

---

### 2.9 Theming / CSS Custom Properties

Theme tokens used across the library, defined in `styles.css`:

```css
@theme {
  --color-primary: rgb(99, 102, 241);       /* indigo-500 */
  --color-primary-light: rgb(238, 242, 255); /* indigo-50 */
  --color-primary-dark: rgb(79, 70, 229);   /* indigo-600 */
  --color-error: rgb(239, 68, 68);          /* red-500 */
  --color-error-light: rgb(254, 242, 242);  /* red-50 */
}
```

Components reference these via `text-primary`, `border-primary`, `bg-(--color-primary)` etc. Consumer apps override by redefining the custom properties.
