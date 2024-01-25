import { cva } from 'class-variance-authority'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { env } from 'env.mjs'

export enum ToastTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type ToastFunctionsType = {
  setMessage: (message: string) => void
  setType: (type: ToastTypeEnum) => void
}

type ToastPropsType = {
  show?: boolean
  message?: string
  type?: ToastTypeEnum
}

const toast = cva(['alert'], {
  variants: {
    typeToast: {
      [ToastTypeEnum.SUCCESS]: ['alert-success'],
      [ToastTypeEnum.ERROR]: ['alert-error'],
    },
  },
  defaultVariants: {
    typeToast: ToastTypeEnum.SUCCESS,
  },
})

const Toast = forwardRef<ToastFunctionsType, ToastPropsType>(({ show = false, message, type }, ref) => {
  const [showToast, setShowToast] = useState(show)
  const [messageToast, setMessageToast] = useState(message)
  const [typeToast, setTypeToast] = useState(type)

  useImperativeHandle(
    ref,
    () => ({
      setMessage: (message: string) => {
        setMessageToast(message)
        setShowToast(true)
        setTimeout(() => {
          setTypeToast(ToastTypeEnum.SUCCESS)
          setMessageToast('')
          setShowToast(false)
        }, env.NEXT_PUBLIC_TOASTER_TIME)
      },
      setType: (type: ToastTypeEnum) => setTypeToast(type),
    }),
    []
  )

  return (
    <>
      {showToast && (
        <div className='toast toast-start'>
          <div className={twMerge(toast({ typeToast }))}>
            <span>{messageToast}</span>
          </div>
        </div>
      )}
    </>
  )
})

Toast.displayName = 'ToastForwardRef'

export default Toast
