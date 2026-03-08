import type { Meta, StoryObj } from "@storybook/react-vite";
import { SurveyProgress } from "./index";

const meta: Meta<typeof SurveyProgress> = {
  title: "Structural/SurveyProgress",
  component: SurveyProgress,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    current: { control: { type: "number", min: 0 } },
    total: { control: { type: "number", min: 1 } },
    showLabel: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SurveyProgress>;

export const Default: Story = {
  args: { current: 3, total: 10 },
};

export const WithLabel: Story = {
  args: { current: 3, total: 10, showLabel: true },
};

export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SurveyProgress current={1} showLabel total={10} />
      <SurveyProgress current={3} showLabel total={10} />
      <SurveyProgress current={5} showLabel total={10} />
      <SurveyProgress current={7} showLabel total={10} />
      <SurveyProgress current={10} showLabel total={10} />
    </div>
  ),
};

export const Complete: Story = {
  args: { current: 10, total: 10, showLabel: true },
};
