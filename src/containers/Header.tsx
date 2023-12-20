import React from 'react'

const Header = ({ pageTitle, children }: { pageTitle: string, children?: React.ReactNode}) => {
  return (
    <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md ">
      <div className="flex-1">
          <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
      </div>

      {children}
      {/* Profile icon, opening menu on click */}
      {/* <div className="dropdown dropdown-end ml-4">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
              <img src="https://placeimg.com/80/80/people" alt="profile" />
              </div>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              <li className="justify-between">
              <a href=''>
                  Profile Settings
                  <span className="badge">New</span>
                  </a>
              </li>
              <li className=''>Another link</li>
              <div className="divider my-0"></div>
              <li><a href=''>Logout</a></li>
          </ul>
      </div> */}
    </div>
  )
}

export default Header