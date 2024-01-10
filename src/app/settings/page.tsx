import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Menus - Settings',
}

const settingsPage = () => {
  return (
    <>
      <section className='border-1 m-2 w-full rounded border-solid border-black bg-slate-50 p-3 shadow-md'>
        <h2>Categories and Tags</h2>
        <button className='btn btn-success m-4'>+ New Category</button>
        <div className='flex flex-row flex-wrap'>
          <div className='w-full overflow-x-auto'>
            <table className='table table-zebra'>
              {/* head */}
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className='badge gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        className='inline-block h-4 w-4 stroke-current'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M6 18L18 6M6 6l12 12'
                        ></path>
                      </svg>
                      info
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Quality Control Specialist</td>
                  <td>
                    <div className='badge gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        className='inline-block h-4 w-4 stroke-current'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M6 18L18 6M6 6l12 12'
                        ></path>
                      </svg>
                      info
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

export default settingsPage
