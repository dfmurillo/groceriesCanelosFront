import React from 'react'
import Header from '@/containers/Header'

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header pageTitle='Settings'></Header>
      {children}
    </>
  )
}

export default SettingsLayout
