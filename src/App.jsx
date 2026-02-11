import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import PromoCards from './components/PromoCards'
import BestSellers from './components/BestSellers'
import SaleBanner from './components/SaleBanner'
import TrendyClothes from './components/TrendyClothes'
import FeaturedCollection from './components/FeaturedCollection'
import LeadCollection from './components/LeadCollection'
import Footer from './components/Footer'

const Section = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <div className="min-h-screen font-['Outfit'] antialiased bg-white selection:bg-pink-100 selection:text-pink-600">
      <Header />
      <main>
        <Hero />
        <Section><Features /></Section>
        <Section><PromoCards /></Section>
        <Section><BestSellers /></Section>
        <Section><SaleBanner /></Section>
        <Section><TrendyClothes /></Section>
        <Section><FeaturedCollection /></Section>
        <Section><LeadCollection /></Section>
      </main>
      <Footer />
    </div>
  )
}

export default App
