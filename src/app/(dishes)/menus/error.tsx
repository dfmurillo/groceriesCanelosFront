'use client'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Menus - Error',
}

const menuError = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <div data-testid='error-container' className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='max-w-md'>
          <h1 className='text-5xl font-bold'>{error.message}</h1>
        </div>
      </div>
    </div>
  )
}

export default menuError
