import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelect } from "./index";
import { Option } from "../../shared/Option";

const meta: Meta<typeof MultiSelect> = {
  title: "Choice/MultiSelect",
  component: MultiSelect,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    layout: { control: "select", options: ["list", "horizontal", "pill"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = {
  render: (args) => (
    <MultiSelect
      {...args}
      hint="Select all that apply."
      question="Which features do you use most?"
    >
      <Option value="analytics">Analytics</Option>
      <Option value="api_access">API Access</Option>
      <Option value="collaboration">Team Collaboration</Option>
      <Option value="export">Export</Option>
      <Option value="sso">Single Sign-On</Option>
    </MultiSelect>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <MultiSelect layout="horizontal" question="Which platforms do you use?">
      <Option value="web">Web</Option>
      <Option value="ios">iOS</Option>
      <Option value="android">Android</Option>
      <Option value="desktop">Desktop</Option>
    </MultiSelect>
  ),
};

export const Pill: Story = {
  render: () => (
    <MultiSelect
      hint="Select all that apply."
      layout="pill"
      question="Which topics interest you?"
    >
      <Option value="design">Design</Option>
      <Option value="engineering">Engineering</Option>
      <Option value="product">Product</Option>
      <Option value="marketing">Marketing</Option>
      <Option value="data">Data</Option>
      <Option value="devops">DevOps</Option>
    </MultiSelect>
  ),
};

export const WithError: Story = {
  render: () => (
    <MultiSelect
      error="Please select at least one option."
      question="Which features do you need?"
      required
    >
      <Option value="analytics">Analytics</Option>
      <Option value="api_access">API Access</Option>
      <Option value="collaboration">Team Collaboration</Option>
    </MultiSelect>
  ),
};

export const Preselected: Story = {
  render: () => (
    <MultiSelect
      defaultValue={["analytics", "api_access"]}
      question="Which features do you use most?"
    >
      <Option value="analytics">Analytics</Option>
      <Option value="api_access">API Access</Option>
      <Option value="collaboration">Team Collaboration</Option>
      <Option value="export">Export</Option>
    </MultiSelect>
  ),
};
