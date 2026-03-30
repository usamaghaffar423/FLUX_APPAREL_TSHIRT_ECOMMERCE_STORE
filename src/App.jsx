import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import PromoCards from './components/PromoCards'
import BestSellers from './components/BestSellers'
import SaleBanner from './components/SaleBanner'
import TrendyClothes from './components/TrendyClothes'
import FeaturedCollection from './components/FeaturedCollection'
import LeadCollection from './components/LeadCollection'
import Footer from './components/Footer'
import Shop from './components/Shop'
import Categories from './components/Categories'
import Checkout from './components/Checkout'
import AdminPanel from './components/AdminPanel'
import ProductDetail from './components/ProductDetail'
import CartSidebar from './components/CartSidebar'
import AuthPage from './components/AuthPage'
import UserProfile from './components/UserProfile'

const Section = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

const HomePage = () => (
  <>
    <Hero />
    <Section><PromoCards /></Section>
    <Section><BestSellers /></Section>
    <Section><SaleBanner /></Section>
    <Section><TrendyClothes /></Section>
    <Section><FeaturedCollection /></Section>
    <Section><LeadCollection /></Section>
  </>
)

// ── Admin route: full-screen, no store header/footer ─────────────────────────
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
    </div>
  )

  if (!user || !isAdmin) return <Navigate to="/login" replace />

  return children
}

// ── Auth pages: full-screen, no store header/footer ──────────────────────────
const AuthRoute = ({ tab }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-100 border-t-[#EB3461] rounded-full animate-spin" />
    </div>
  )

  // Already logged in — redirect away from auth pages
  if (user) return <Navigate to={isAdmin ? '/admin' : '/'} replace />

  return <AuthPage defaultTab={tab} />
}

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname === '/admin'
  const isAuthRoute  = location.pathname === '/login' || location.pathname === '/register'

  // Admin and auth pages get their own full-screen layout
  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={
          <ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>
        } />
      </Routes>
    )
  }

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/login"    element={<AuthRoute tab="login" />} />
        <Route path="/register" element={<AuthRoute tab="register" />} />
      </Routes>
    )
  }

  // Store layout: header + footer + animated page content
  return (
    <div className="min-h-screen font-['Outfit'] antialiased bg-white selection:bg-pink-100 selection:text-pink-600">
      <Header />
      <CartSidebar />
      <main className="pt-[100px] md:pt-[110px]">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"           element={<HomePage />} />
            <Route path="/shop"       element={<Shop />} />
            <Route path="/category"   element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout"   element={<Checkout />} />
            <Route path="/profile"    element={<UserProfile />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default App
