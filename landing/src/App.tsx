import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from './components/PageLayout'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import CasesPage from './pages/CasesPage'
import ProcessPage from './pages/ProcessPage'
import PricingPage from './pages/PricingPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  )
}

export default App
