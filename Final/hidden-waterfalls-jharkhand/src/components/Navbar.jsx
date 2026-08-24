import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconArrow } from './icons'

const LINKS = [
  { to: '../../home.html', label: 'Home', isExternal: true },
  { to: '../../index.html', label: 'Explore', isExternal: true },
  { to: '../../mining.html', label: 'Mining', isExternal: true },
  { to: '#discovery', label: 'Waterfalls', isHash: true },
  { to: '../../jhar.html', label: 'Festivals', isExternal: true }
]

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 34 34" width="32" height="32" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="17" cy="17" r="16" fill="rgba(79,175,91,0.14)" stroke="#176B45" strokeWidth="1.5" />
      <path d="M17 7c-3.5 5.5-8 10-8 14.5a8 8 0 0 0 16 0c0-4.5-4.5-9-8-14.5z" fill="#176B45" />
      <path d="M14 19c0 2 1.5 3.5 3 3.5s3-1.5 3-3.5" stroke="#8EDB68" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap">
        <div className="nav-inner">
          
          {/* LEFT: Master FootprintJH Branding */}
          <div className="nav-left">
            <a href="../../home.html" className="brand" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #4C9A45, #2F6B3C)',
                border: '1px solid rgba(47, 107, 60, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: '#FFF',
                boxShadow: '0 4px 10px rgba(47, 107, 60, 0.18)',
                flexShrink: 0
              }}>
                🌿
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', color: '#4C9A45', lineHeight: 1 }}>
                  Discover
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: '#163B27', lineHeight: 1.2 }}>
                  FootprintJH
                </span>
              </div>
            </a>
          </div>

          {/* CENTER: Master Nav Links */}
          <nav className="nav-links">
            <a href="../../home.html">Home</a>
            
            {/* Explore with Dropdown (Famous Places + Underrated Places) */}
            <div className="nav-dropdown">
              <a href="../../index.html" className="nav-dropdown-btn">
                <span>Explore</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
              </a>
              <div className="nav-dropdown-menu">
                <a href="../../Bhavish_Underrated_test/antigravity/scratch/jharkhand-tourism/index.html" className="nav-dropdown-item">
                  <span>Famous Places</span>
                  <span className="nav-dropdown-badge">Top 5</span>
                </a>
                <a href="../../index.html" className="nav-dropdown-item">
                  <span>Underrated Places</span>
                  <span className="nav-dropdown-badge" style={{ color: '#4C9A45', fontWeight: 700 }}>Proximity</span>
                </a>
              </div>
            </div>

            <a href="../../mining.html">Mining</a>
            <a href="#discovery" className="active" style={{ color: '#4C9A45', fontWeight: 700 }}>Waterfalls</a>
            <a href="../../jhar.html">Festivals</a>
            <a href="../../scheduler.html">My Trip Plan</a>
            <a href="../../feedback.html">Feedback</a>
          </nav>

          {/* RIGHT: Indicator / Portal Badge & Mobile Burger */}
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="nav-portal-badge global-portal-badge">
              <span>🌲</span>
              <span>Eco Tourism Portal</span>
            </div>
            <button className="nav-burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
              <span style={{ fontSize: '1.2rem' }}>☰</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <a href="../../home.html" onClick={() => setOpen(false)}>Home</a>
            <a href="../../Bhavish_Underrated_test/antigravity/scratch/jharkhand-tourism/index.html" onClick={() => setOpen(false)}>Famous Places</a>
            <a href="../../index.html" onClick={() => setOpen(false)}>Underrated Places</a>
            <a href="../../mining.html" onClick={() => setOpen(false)}>Mining</a>
            <a href="#discovery" onClick={() => setOpen(false)} style={{ color: '#4C9A45', fontWeight: 700 }}>Waterfalls</a>
            <a href="../../jhar.html" onClick={() => setOpen(false)}>Festivals</a>
            <a href="../../scheduler.html" onClick={() => setOpen(false)}>My Trip Plan</a>
            <a href="../../feedback.html" onClick={() => setOpen(false)}>Feedback</a>
            <div style={{ marginTop: 12, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
              <a href="#discovery" className="btn full" onClick={() => setOpen(false)}>
                Explore Waterfalls <IconArrow />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
