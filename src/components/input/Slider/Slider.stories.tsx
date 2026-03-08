import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./index";

const meta: Meta<typeof Slider> = {
  title: "Input/Slider",
  component: Slider,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    showValue: { control: "boolean" },
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    question: "How satisfied are you?",
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true,
  },
};

export const WithLabels: Story = {
  args: {
    question: "How satisfied are you with our service?",
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
    showValue: true,
    labels: ["Not at all", "Neutral", "Very satisfied"],
  },
};

export const Stepped: Story = {
  args: {
    question: "How many team members do you have?",
    min: 1,
    max: 50,
    step: 1,
    defaultValue: 10,
    showValue: true,
    labels: ["1", "10", "25", "50"],
  },
};

export const WithHint: Story = {
  args: {
    question: "Drag the slider to indicate your budget",
    hint: "Approximate annual spend in USD",
    min: 0,
    max: 100000,
    step: 5000,
    defaultValue: 25000,
    showValue: true,
  },
};

export const Disabled: Story = {
  args: {
    question: "Previous rating",
    min: 0,
    max: 100,
    value: 70,
    disabled: true,
    showValue: true,
  },
};
