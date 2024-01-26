import { forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useState } from 'react'

type InputTextPropsType = {
  labelText?: string
  error?: string
  inputProps: InputHTMLAttributes<HTMLInputElement>
}
export type InputTextFunctionsType = {
  setError: (message: string) => void
}

const InputText = forwardRef<InputTextFunctionsType, InputTextPropsType>(({ error, labelText, inputProps }, ref) => {
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
    <label htmlFor={inputProps.id}>
      {labelText && (
        <div className='label'>
          <span className='label-text'>{labelText}</span>
        </div>
      )}
      <input {...inputProps} className='input input-bordered w-full max-w-xs' />
      {errorMessage && (
        <div className='label'>
          <span className='label-text-alt text-red-500'>{errorMessage}</span>
        </div>
      )}
    </label>
  )
})

InputText.displayName = 'InputTextForwardRef'

export default InputText
