import React from 'react'

const Header = ({ pageTitle, children }: { pageTitle: string, children?: React.ReactNode}) => {
  return (
    <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md ">
      <div className="flex-1">
          <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
      </div>

      {children}
    </div>
  )
}

export default Header