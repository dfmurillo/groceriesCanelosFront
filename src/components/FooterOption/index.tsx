'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'



const FooterOption = ({children, label, path}: {children: ReactNode, label: string, path: string}) => {
  const pathname = usePathname()
  return (
    <Link href={path} className={pathname === path ? 'active': ''}>
      {children}
      <span className="btm-nav-label">{label}</span>
    </Link>
  )
}

export default FooterOption