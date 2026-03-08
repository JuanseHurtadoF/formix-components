import type { Meta, StoryObj } from "@storybook/react-vite";
import { StarRating } from "./index";

const meta: Meta<typeof StarRating> = {
  title: "Scale/StarRating",
  component: StarRating,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    max: { control: { type: "number", min: 1, max: 10 } },
    allowHalf: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Default: Story = {
  args: {
    question: "Rate your experience",
    max: 5,
  },
};

export const WithHalfStars: Story = {
  args: {
    question: "Rate this product",
    max: 5,
    allowHalf: true,
  },
};

export const TenStars: Story = {
  args: {
    question: "Overall rating",
    max: 10,
  },
};

export const WithHint: Story = {
  args: {
    question: "How would you rate our documentation?",
    hint: "Hover over the stars and click to rate.",
    max: 5,
  },
};

export const Preselected: Story = {
  args: {
    question: "Your previous rating",
    max: 5,
    defaultValue: 4,
  },
};

export const WithHalfPreselected: Story = {
  args: {
    question: "Rate this article",
    max: 5,
    allowHalf: true,
    defaultValue: 3.5,
  },
};

export const Disabled: Story = {
  args: {
    question: "Average community rating",
    max: 5,
    value: 4,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    question: "Rate your experience",
    max: 5,
    required: true,
    error: "A rating is required before you can submit.",
  },
};
