import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import PromoCards from './components/PromoCards'
import BestSellers from './components/BestSellers'
import SaleBanner from './components/SaleBanner'
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

      {/* ── WhatsApp Floating Button ── */}
      <a
        href="https://wa.me/923481099433"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{ backgroundColor: '#25D366' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

export default App
