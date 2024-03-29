import React from 'react'

const Header = ({ pageTitle, children }: { pageTitle: string; children?: React.ReactNode }) => {
  return (
    <div className='navbar sticky top-0 z-10  bg-base-100 shadow-md '>
      <div className='flex-1'>
        <h1 className='ml-2 text-2xl font-semibold'>{pageTitle}</h1>
      </div>

      {children}
    </div>
  )
}

export default Header
