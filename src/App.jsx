import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Care from './pages/Care.jsx'
import Fabrics from './pages/Fabrics.jsx'
import Order from './pages/Order.jsx'
import Admin from './pages/Admin.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname === '/admin'
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Nav />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/care" element={<Care />} />
          <Route path="/fabrics" element={<Fabrics />} />
          <Route path="/order" element={<Order />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}
