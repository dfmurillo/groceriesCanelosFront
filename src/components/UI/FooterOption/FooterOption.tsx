'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

const FooterOption = ({
  children,
  label,
  path,
  activeOn,
}: {
  children: ReactNode
  label: string
  path: string
  activeOn?: string[]
}) => {
  const pathname = usePathname()
  const isActive = () => {
    const activePaths = [path]

    if (activeOn) {
      activePaths.push(...activeOn)
    }

    return activePaths.includes(pathname)
  }
  return (
    <Link href={path} className={isActive() ? 'active' : ''}>
      {children}
      <span className='btm-nav-label'>{label}</span>
    </Link>
  )
}

export default FooterOption
