'use client'

import { ReactNode, useRef } from 'react'

export type AddButtonPropsType = {
  textButton: string
  buttonPrefixIcon?: string
  children: ReactNode
  buttonSize?: '' | 'xs'
  buttonColor?: 'success' | 'ghost'
}

const ActionButton = ({
  textButton,
  buttonPrefixIcon,
  children,
  buttonSize,
  buttonColor = 'success',
}: AddButtonPropsType) => {
  const dialogModalRef = useRef<HTMLDialogElement>(null)

  const handleModalOpen = () => {
    dialogModalRef.current?.showModal()
  }

  return (
    <>
      <button
        onClick={handleModalOpen}
        className={`btn ${buttonSize ? `btn-${buttonSize}` : ``} btn-${buttonColor} m-4 whitespace-nowrap`}
      >
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
