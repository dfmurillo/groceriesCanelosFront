'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type FooterOptionPropsType = {
  children: ReactNode
  label: string
  path: string
  activeOn?: string[]
  linkProps?: HTMLLinkElement
}

const activeLinkClass = 'active bg-gray-200'

const FooterOption = ({ children, label, path, activeOn, linkProps }: FooterOptionPropsType) => {
  const pathname = usePathname()
  const isActive = () => {
    const activePaths = [path]

    if (activeOn) {
      activePaths.push(...activeOn)
    }

    return activePaths.includes(pathname)
  }
  return (
    <Link
      href={path}
      className={cn(
        'group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800',
        isActive() ? activeLinkClass : '',
        linkProps?.className
      )}
    >
      {children}
      <span className='btm-nav-label'>{label}</span>
    </Link>
  )
}

export default FooterOption
