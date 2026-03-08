import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "./index";
import { TextInput } from "../../input/TextInput";
import { SingleSelect } from "../../choice/SingleSelect";
import { Option } from "../../shared/Option";

const meta: Meta<typeof Section> = {
  title: "Structural/Section",
  component: Section,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: (args) => (
    <Section {...args} title="About You">
      <TextInput question="First name" placeholder="Jane" />
      <TextInput question="Last name" placeholder="Doe" />
    </Section>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Section
      description="Help us understand your background so we can personalize your experience."
      title="Professional Background"
    >
      <TextInput question="Job title" placeholder="e.g. Product Designer" />
      <TextInput question="Company name" placeholder="Acme Inc." />
      <SingleSelect question="Company size">
        <Option value="solo">Just me</Option>
        <Option value="small">2–10</Option>
        <Option value="medium">11–100</Option>
        <Option value="large">100+</Option>
      </SingleSelect>
    </Section>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <div className="flex flex-col gap-12">
      <Section description="Tell us a little about yourself." title="Personal Information">
        <TextInput question="Full name" placeholder="Jane Doe" required />
        <TextInput question="Email address" placeholder="jane@example.com" required />
      </Section>

      <Section description="Share your professional context." title="Work Experience">
        <TextInput question="Current role" placeholder="Senior Designer" />
        <SingleSelect question="Industry">
          <Option value="tech">Technology</Option>
          <Option value="finance">Finance</Option>
          <Option value="healthcare">Healthcare</Option>
          <Option value="education">Education</Option>
          <Option value="other">Other</Option>
        </SingleSelect>
      </Section>
    </div>
  ),
};
