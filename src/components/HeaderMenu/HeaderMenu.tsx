'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const HeaderMenu = () => {
  const pathname = usePathname()
  return (
    <>
      <Link href={'/ingredients'} className={`btn ${pathname === '/ingredients' ? 'btn-active' : ''}`}>
        <span className='text-lg'>🥕</span>
        Ingredients
      </Link>
      <Link href={'/'} className={`btn ${pathname === '/meals' ? 'btn-active' : ''}`}>
        <span className='text-lg'>🍱</span>
        Meals Ingredients
      </Link>
    </>
  )
}

export default HeaderMenu
