'use client'

import { cva } from 'class-variance-authority'
import { ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type AddButtonPropsType = {
  textButton: string
  buttonPrefixIcon?: string
  children: ReactNode
  buttonSize?: null | 'xs'
  buttonColor?: 'success' | 'ghost'
  className?: string
}

const buttonAction = cva(['btn', 'm-4', 'whitespace-nowrap'], {
  variants: {
    buttonSize: {
      xs: ['btn-xs'],
      normal: [],
    },
    buttonColor: {
      success: ['btn-success'],
      ghost: ['btn-ghost'],
    },
  },
  defaultVariants: {
    buttonSize: 'normal',
    buttonColor: 'success',
  },
})

const ActionButton = ({
  textButton,
  buttonPrefixIcon,
  children,
  buttonSize = null,
  buttonColor = 'success',
  className,
}: AddButtonPropsType) => {
  const dialogModalRef = useRef<HTMLDialogElement>(null)

  const handleModalOpen = () => {
    dialogModalRef.current?.showModal()
  }

  return (
    <>
      <button onClick={handleModalOpen} className={twMerge(buttonAction({ buttonColor, buttonSize, className }))}>
        {buttonPrefixIcon} {textButton}
      </button>
      <dialog ref={dialogModalRef} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
          </form>
          <h3 className='text-lg font-bold'>{textButton}</h3>
          {children}
        </div>
      </dialog>
    </>
  )
}

export default ActionButton
