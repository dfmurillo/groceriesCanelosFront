import { cva } from 'class-variance-authority'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export enum ButtonActionEnum {
  SAVE = 'save',
  DELETE = 'delete',
}

type ButtonPropsType = {
  label: string
  action: ButtonActionEnum
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement>
}

const button = cva(['btn', 'btn-outline'], {
  variants: {
    action: {
      save: ['btn-success'],
      delete: ['btn-error'],
    },
  },
  defaultVariants: {
    action: 'save',
  },
})

const Button = ({ label, action, buttonProps }: ButtonPropsType) => {
  return (
    <button {...buttonProps} className={twMerge(button({ action }))}>
      {label}
    </button>
  )
}

export default Button
