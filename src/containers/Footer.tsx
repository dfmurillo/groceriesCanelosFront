import React from 'react'
import FooterOption from '@/components/FooterOption/FooterOption'

const Footer = () => {
  return (
    <div className='btm-nav'>
      <FooterOption label='Calendar' path='/'>
        <span className='h-5 w-5'>🗓️</span>
      </FooterOption>

      <FooterOption label='Menus' path='/menus' activeOn={['/ingredients', '/meals']}>
        <span className='h-5 w-5'>👨‍🍳</span>
      </FooterOption>

      <FooterOption label='Checklist' path='/checklist'>
        <span className='h-5 w-5'>📋</span>
      </FooterOption>

      <FooterOption label='Settings' path='/settings'>
        <span className='h-5 w-5'>🛠️</span>
      </FooterOption>
    </div>
  )
}

export default Footer
