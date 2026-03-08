import type { Meta, StoryObj } from "@storybook/react-vite";
import { YesNo } from "./index";

const meta: Meta<typeof YesNo> = {
  title: "Feedback/YesNo",
  component: YesNo,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof YesNo>;

export const Default: Story = {
  args: {
    question: "Would you recommend us to a friend?",
  },
};

export const CustomLabels: Story = {
  args: {
    question: "Did our support team resolve your issue?",
    yesLabel: "Resolved",
    noLabel: "Not resolved",
  },
};

export const PreselectedYes: Story = {
  args: {
    question: "Are you currently on a paid plan?",
    defaultValue: true,
  },
};

export const PreselectedNo: Story = {
  args: {
    question: "Have you used our mobile app?",
    defaultValue: false,
  },
};

export const WithHint: Story = {
  args: {
    question: "Do you use our product every week?",
    hint: "Based on your usage over the past 30 days.",
  },
};

export const WithError: Story = {
  args: {
    question: "Would you recommend us?",
    required: true,
    error: "Please answer this question to continue.",
  },
};

export const Disabled: Story = {
  args: {
    question: "Previous response",
    value: true,
    disabled: true,
  },
};
