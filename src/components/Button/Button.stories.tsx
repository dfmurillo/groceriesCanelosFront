import type { Meta, StoryObj } from '@storybook/react'
import { ButtonExample } from './Button'

const meta: Meta<typeof ButtonExample> = {
  title: 'Button',
  component: ButtonExample,
  args: {
    intent: 'primary',
    underline: false,
    children: 'Button',
    size: 'lg',
  },
  argTypes: {
    intent: {
      options: ['primary', 'secondary'],
      control: { type: 'select' },
    },
    size: {
      options: ['sm', 'lg'],
      control: { type: 'select' },
    },
  },
}

type Story = StoryObj<typeof ButtonExample>

export const Default: Story = {
  render: (args) => <ButtonExample {...args} />,
}

export default meta
