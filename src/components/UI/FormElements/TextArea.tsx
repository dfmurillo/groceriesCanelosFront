import { forwardRef, InputHTMLAttributes, useImperativeHandle, useState } from 'react'

type TextAreaPropsType = {
  labelText?: string
  error?: string
  inputProps: InputHTMLAttributes<HTMLTextAreaElement>
}
export type TextAreaFunctionsType = {
  setError: (message: string) => void
}

const TextArea = forwardRef<TextAreaFunctionsType, TextAreaPropsType>(({ error, labelText, inputProps }, ref) => {
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
      <textarea {...inputProps} className='textarea textarea-bordered textarea-sm w-full max-w-xs'></textarea>
      {errorMessage && (
        <div className='label'>
          <span className='label-text-alt text-red-500'>{errorMessage}</span>
        </div>
      )}
    </label>
  )
})

TextArea.displayName = 'InputTextForwardRef'

export default TextArea
