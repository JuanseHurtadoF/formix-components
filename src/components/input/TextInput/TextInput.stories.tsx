import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "./index";

const meta: Meta<typeof TextInput> = {
  title: "Input/TextInput",
  component: TextInput,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    multiline: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    showCounter: { control: "boolean" },
    rows: { control: { type: "number", min: 2, max: 20 } },
    maxLength: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    question: "What is your name?",
    placeholder: "John Doe",
  },
};

export const WithHint: Story = {
  args: {
    question: "Email address",
    hint: "We'll only use this to send your results.",
    placeholder: "you@example.com",
  },
};

export const Required: Story = {
  args: {
    question: "Job title",
    placeholder: "Software Engineer",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    question: "Email address",
    placeholder: "you@example.com",
    required: true,
    error: "Please enter a valid email address.",
    value: "not-an-email",
  },
};

export const Multiline: Story = {
  args: {
    question: "Tell us about yourself",
    placeholder: "Share your background, interests, and goals...",
    multiline: true,
    rows: 5,
  },
};

export const MultilineWithCounter: Story = {
  args: {
    question: "Share your feedback",
    placeholder: "What did you think?",
    multiline: true,
    maxLength: 300,
    showCounter: true,
  },
};

export const Disabled: Story = {
  args: {
    question: "Pre-filled field",
    value: "This cannot be changed",
    disabled: true,
  },
};

export const Standalone: Story = {
  render: () => <TextInput placeholder="No question label, just the input" />,
};
