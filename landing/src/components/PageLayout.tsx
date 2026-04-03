import React from 'react'
import Navbar from './Navbar'
import CtaFooter from './CtaFooter'
import ScrollToTop from './ScrollToTop'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <CtaFooter />
    </>
  )
}
