import React from 'react'
import Hero from '../components/Hero'
import StartSection from '../components/StartSection'
import FeaturesChess from '../components/FeaturesChess'
import FeaturesGrid from '../components/FeaturesGrid'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StartSection />
      <FeaturesChess />
      <FeaturesGrid />
      <Stats />
      <Testimonials />
    </>
  )
}
