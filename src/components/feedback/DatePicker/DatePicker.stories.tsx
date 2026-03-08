import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./index";

const meta: Meta<typeof DatePicker> = {
  title: "Feedback/DatePicker",
  component: DatePicker,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    question: "When did you start using our product?",
  },
};

export const WithMinMax: Story = {
  args: {
    question: "Select a date for your demo",
    hint: "Demos are available Monday through Friday.",
    min: new Date().toISOString().split("T")[0],
    max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
};

export const Required: Story = {
  args: {
    question: "When did you first experience the issue?",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    question: "When did you sign up?",
    required: true,
    error: "Please select a date to continue.",
  },
};

export const WithHint: Story = {
  args: {
    question: "Your date of birth",
    hint: "Used to verify your account age.",
    max: new Date().toISOString().split("T")[0],
  },
};

export const Preselected: Story = {
  args: {
    question: "Contract start date",
    defaultValue: "2024-01-01",
  },
};

export const Disabled: Story = {
  args: {
    question: "Account creation date",
    value: "2023-06-15",
    disabled: true,
  },
};
