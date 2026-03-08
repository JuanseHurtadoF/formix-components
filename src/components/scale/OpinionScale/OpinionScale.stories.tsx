import type { Meta, StoryObj } from "@storybook/react-vite";
import { OpinionScale } from "./index";
import { Option } from "../../shared/Option";

const meta: Meta<typeof OpinionScale> = {
  title: "Scale/OpinionScale",
  component: OpinionScale,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof OpinionScale>;

export const Default: Story = {
  render: (args) => (
    <OpinionScale {...args} question="The product met my expectations.">
      <Option value="strongly_disagree">Strongly Disagree</Option>
      <Option value="disagree">Disagree</Option>
      <Option value="neutral">Neutral</Option>
      <Option value="agree">Agree</Option>
      <Option value="strongly_agree">Strongly Agree</Option>
    </OpinionScale>
  ),
};

export const ThreePoint: Story = {
  render: () => (
    <OpinionScale question="Would you use this feature again?">
      <Option value="no">No</Option>
      <Option value="maybe">Maybe</Option>
      <Option value="yes">Yes</Option>
    </OpinionScale>
  ),
};

export const SevenPoint: Story = {
  render: () => (
    <OpinionScale
      hint="1 = Very unclear, 7 = Very clear"
      question="Rate the clarity of our documentation."
    >
      <Option value="1">1</Option>
      <Option value="2">2</Option>
      <Option value="3">3</Option>
      <Option value="4">4</Option>
      <Option value="5">5</Option>
      <Option value="6">6</Option>
      <Option value="7">7</Option>
    </OpinionScale>
  ),
};

export const WithError: Story = {
  render: () => (
    <OpinionScale
      error="Please select an option to continue."
      question="The product met my expectations."
      required
    >
      <Option value="strongly_disagree">Strongly Disagree</Option>
      <Option value="disagree">Disagree</Option>
      <Option value="neutral">Neutral</Option>
      <Option value="agree">Agree</Option>
      <Option value="strongly_agree">Strongly Agree</Option>
    </OpinionScale>
  ),
};

export const Preselected: Story = {
  render: () => (
    <OpinionScale defaultValue="agree" question="The product met my expectations.">
      <Option value="strongly_disagree">Strongly Disagree</Option>
      <Option value="disagree">Disagree</Option>
      <Option value="neutral">Neutral</Option>
      <Option value="agree">Agree</Option>
      <Option value="strongly_agree">Strongly Agree</Option>
    </OpinionScale>
  ),
};
