const LoadingDots = () => {
  return (
    <>
      <div className='flex h-screen items-center justify-center space-x-1 bg-white dark:invert'>
        <span className='sr-only'>Loading...</span>
        <div className='h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.3s]'></div>
        <div className='h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.15s]'></div>
        <div className='h-2 w-2 animate-bounce rounded-full bg-black'></div>
      </div>
    </>
  )
}

export default LoadingDots
