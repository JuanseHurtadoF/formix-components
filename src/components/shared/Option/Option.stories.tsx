import type { Meta, StoryObj } from "@storybook/react-vite";
import { Option } from "./index";
import { SingleSelect } from "../../choice/SingleSelect";
import { MultiSelect } from "../../choice/MultiSelect";

const meta: Meta<typeof Option> = {
  title: "Shared/Option",
  component: Option,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Option>;

export const InSingleSelect: Story = {
  render: () => (
    <SingleSelect question="What is your role?">
      <Option value="engineer">Engineer</Option>
      <Option value="designer">Designer</Option>
      <Option value="founder">Founder</Option>
    </SingleSelect>
  ),
};

export const InMultiSelect: Story = {
  render: () => (
    <MultiSelect question="Which topics interest you?" hint="Select all that apply.">
      <Option value="design">Design</Option>
      <Option value="engineering">Engineering</Option>
      <Option value="product">Product</Option>
    </MultiSelect>
  ),
};

export const PillLayout: Story = {
  render: () => (
    <SingleSelect layout="pill" question="What is your role?">
      <Option value="engineer">Engineer</Option>
      <Option value="designer">Designer</Option>
      <Option value="founder">Founder</Option>
    </SingleSelect>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <SingleSelect question="Select your plan">
      <Option value="free">Free</Option>
      <Option value="pro">Pro</Option>
      <Option disabled value="enterprise">Enterprise (coming soon)</Option>
    </SingleSelect>
  ),
};
