import { cva, VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export enum ButtonActionEnum {
  SAVE = 'save',
  DELETE = 'delete',
}

const button = cva(['btn', 'btn-outline'], {
  variants: {
    action: {
      save: ['btn-success'],
      delete: ['btn-error'],
    },
    size: {
      xs: ['btn-xs'],
    },
  },
  defaultVariants: {
    action: 'save',
  },
})

type ButtonPropsType = VariantProps<typeof button> & {
  label: string
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement>
}

const Button = ({ label, action, buttonProps, size }: ButtonPropsType) => {
  return (
    <button {...buttonProps} className={twMerge(button({ action, size }))}>
      {label}
    </button>
  )
}

export default Button
