import type { Meta, StoryObj } from "@storybook/react-vite";
import { SingleSelect } from "./index";
import { Option } from "../../shared/Option";

const meta: Meta<typeof SingleSelect> = {
  title: "Choice/SingleSelect",
  component: SingleSelect,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    layout: { control: "select", options: ["list", "horizontal", "pill"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SingleSelect>;

export const Default: Story = {
  render: (args) => (
    <SingleSelect {...args} question="What is your role?">
      <Option value="engineer">Engineer</Option>
      <Option value="designer">Designer</Option>
      <Option value="product_manager">Product Manager</Option>
      <Option value="founder">Founder</Option>
      <Option value="other">Other</Option>
    </SingleSelect>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <SingleSelect layout="horizontal" question="How often do you use our product?">
      <Option value="daily">Daily</Option>
      <Option value="weekly">Weekly</Option>
      <Option value="monthly">Monthly</Option>
      <Option value="rarely">Rarely</Option>
    </SingleSelect>
  ),
};

export const Pill: Story = {
  render: () => (
    <SingleSelect layout="pill" question="What is your primary role?">
      <Option value="engineer">Engineering</Option>
      <Option value="design">Design</Option>
      <Option value="product">Product</Option>
      <Option value="marketing">Marketing</Option>
      <Option value="data">Data</Option>
    </SingleSelect>
  ),
};

export const WithHint: Story = {
  render: () => (
    <SingleSelect
      hint="This helps us personalize your experience."
      question="Which plan are you on?"
    >
      <Option value="free">Free</Option>
      <Option value="pro">Pro</Option>
      <Option value="enterprise">Enterprise</Option>
    </SingleSelect>
  ),
};

export const Required: Story = {
  render: () => (
    <SingleSelect question="What is your role?" required>
      <Option value="engineer">Engineer</Option>
      <Option value="designer">Designer</Option>
      <Option value="founder">Founder</Option>
    </SingleSelect>
  ),
};

export const WithError: Story = {
  render: () => (
    <SingleSelect
      error="Please select an option to continue."
      question="What is your role?"
      required
    >
      <Option value="engineer">Engineer</Option>
      <Option value="designer">Designer</Option>
      <Option value="founder">Founder</Option>
    </SingleSelect>
  ),
};

export const WithDisabledOption: Story = {
  render: () => (
    <SingleSelect question="Select your plan">
      <Option value="free">Free</Option>
      <Option value="pro">Pro</Option>
      <Option disabled value="enterprise">Enterprise (coming soon)</Option>
    </SingleSelect>
  ),
};

export const Preselected: Story = {
  render: () => (
    <SingleSelect defaultValue="designer" question="What is your role?">
      <Option value="engineer">Engineer</Option>
      <Option value="designer">Designer</Option>
      <Option value="founder">Founder</Option>
    </SingleSelect>
  ),
};
