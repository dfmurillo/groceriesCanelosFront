import React from 'react'
import FooterOption from '@/components/FooterOption/FooterOption'

const Footer = () => {
  return (
    <div className='fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'>
      <div className='mx-auto grid h-full grid-cols-4 shadow'>
        <FooterOption label='Calendar' path='/'>
          <span className='m-2 h-5 w-5'>🗓️</span>
        </FooterOption>

        <FooterOption label='Menus' path='/menus' activeOn={['/ingredients', '/meals']}>
          <span className='m-2 h-5 w-5'>👨‍🍳</span>
        </FooterOption>

        <FooterOption label='Checklist' path='/checklist'>
          <span className='m-2 h-5 w-5'>📋</span>
        </FooterOption>

        <FooterOption label='Settings' path='/settings'>
          <span className='m-2 h-5 w-5'>🛠️</span>
        </FooterOption>
      </div>
    </div>
  )
}

export default Footer
