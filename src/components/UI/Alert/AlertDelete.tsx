import { forwardRef, useImperativeHandle, useState } from 'react'

export type AlertDeleteFunctionsType = {
  setVisibility: (visibility: boolean) => void
}

type AlertDeletePropsType = {
  handleAction: Function
  alertText: string
}

const AlertDelete = forwardRef<AlertDeleteFunctionsType, AlertDeletePropsType>(({ handleAction, alertText }, ref) => {
  const [visible, setVisible] = useState<boolean>(false)

  useImperativeHandle(
    ref,
    () => ({
      setVisibility: (visibility: boolean) => setVisible(visibility),
    }),
    []
  )
  return (
    <>
      {visible && (
        <div role='alert' className='alert alert-warning'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 shrink-0 stroke-current'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
          <span>{alertText}</span>
          <button onClick={() => setVisible(false)} className='btn btn-sm'>
            Cancel
          </button>
          <button onClick={() => handleAction()} className='btn btn-error btn-sm'>
            I&apos;m sure
          </button>
        </div>
      )}
    </>
  )
})

AlertDelete.displayName = 'AlertDeleteForwardRef'

export default AlertDelete
