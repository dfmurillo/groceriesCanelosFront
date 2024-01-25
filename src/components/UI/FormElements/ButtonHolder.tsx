import { cva } from 'class-variance-authority'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonHolderClasses = cva(['modal-action'], {
  variants: {
    multipleButtons: {
      true: ['place-content-between'],
      false: [],
    },
  },
})

const ButtonHolder = ({ children }: { children: ReactNode }) => {
  const multipleButtons = Array.isArray(children) && children.length > 1
  return <div className={twMerge(buttonHolderClasses({ multipleButtons }))}>{children}</div>
}

export default ButtonHolder
