import { cva, VariantProps } from 'class-variance-authority'
import { ClassProp } from 'class-variance-authority/dist/types'
import { forwardRef, InputHTMLAttributes, useImperativeHandle, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const inputTextClasses = cva(['input', 'input-bordered'], {
  variants: {
    size: {
      fullSize: ['w-full', 'max-w-xs'],
      quarterSize: ['w-1/4'],
      fifthSize: ['w-1/5'],
    },
  },
  defaultVariants: {
    size: 'fullSize',
  },
})

type InputTextPropsType = VariantProps<typeof inputTextClasses> & {
  labelText?: string
  error?: string
  className?: string
  containerClassName?: string
  inputProps: InputHTMLAttributes<HTMLInputElement>
}
export type InputTextFunctionsType = {
  setError: (message: string) => void
}

const InputText = forwardRef<InputTextFunctionsType, InputTextPropsType>(
  ({ error, labelText, inputProps, className, size, containerClassName }, ref) => {
    if (!inputProps.autoComplete) inputProps.autoComplete = 'off'

    const [errorMessage, setErrorMessage] = useState(error ?? null)

    useImperativeHandle(
      ref,
      () => ({
        setError: (message) => {
          setErrorMessage(message)
        },
      }),
      []
    )

    return (
      <label className={containerClassName} htmlFor={inputProps.id}>
        {labelText && (
          <div className='label'>
            <span className='label-text'>{labelText}</span>
          </div>
        )}
        <input {...inputProps} className={twMerge(inputTextClasses({ size, className }))} />
        {errorMessage && (
          <div className='label'>
            <span className='label-text-alt text-red-500'>{errorMessage}</span>
          </div>
        )}
      </label>
    )
  }
)

InputText.displayName = 'InputTextForwardRef'

export default InputText
