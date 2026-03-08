import type { Meta, StoryObj } from "@storybook/react-vite";
import { Scale } from "./index";

const meta: Meta<typeof Scale> = {
  title: "Scale/Scale",
  component: Scale,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Scale>;

export const Default: Story = {
  args: {
    question: "How likely are you to recommend us to a friend?",
    min: 0,
    max: 10,
    lowLabel: "Not at all likely",
    highLabel: "Extremely likely",
  },
};

export const FivePoint: Story = {
  args: {
    question: "How satisfied are you with our support?",
    min: 1,
    max: 5,
    lowLabel: "Very unsatisfied",
    highLabel: "Very satisfied",
  },
};

export const WithHint: Story = {
  args: {
    question: "Rate the overall quality",
    hint: "1 = lowest, 10 = highest",
    min: 1,
    max: 10,
  },
};

export const WithError: Story = {
  args: {
    question: "How satisfied are you?",
    min: 1,
    max: 10,
    required: true,
    error: "Please select a rating to continue.",
  },
};

export const Preselected: Story = {
  args: {
    question: "How likely are you to recommend us?",
    min: 0,
    max: 10,
    defaultValue: 8,
    lowLabel: "Not at all likely",
    highLabel: "Extremely likely",
  },
};
