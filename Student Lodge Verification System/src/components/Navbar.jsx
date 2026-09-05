import { useState, useEffect } from 'react'
import './Navbar.css'

const NAV_LINKS = [
  { page: 'home',   label: 'Home',   icon: '🏠' },
  { page: 'browse', label: 'Lodges', icon: '📋' },
]

export default function Navbar({ page, go }) {
  const [open, setOpen] = useState(false)

  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navigate = (p) => {
    go(p)
    setOpen(false)
  }

  return (
    <>
      <header className="navbar">
        <div className="container navbar__inner">

          {/* Logo — always visible */}
          <button className="navbar__logo" onClick={() => navigate('home')}>
            <span className="navbar__logo-icon">🏠</span>
            <span className="navbar__logo-text">IfiteLodge</span>
            <span className="navbar__logo-badge">NAU</span>
          </button>

          {/* Desktop links — hidden below 990px */}
          <nav className="navbar__desktop">
            {NAV_LINKS.map(({ page: p, label, icon }) => (
              <button
                key={p}
                className={`navbar__link ${page === p ? 'navbar__link--active' : ''}`}
                onClick={() => navigate(p)}
              >
                {icon} {label}
              </button>
            ))}
            <button
              className="navbar__link navbar__link--accent"
              onClick={() => navigate('submit')}
            >✍️ Submit Lodge</button>
            <button
              className="navbar__avatar"
              onClick={() => navigate('login')}
            >👤</button>
          </nav>

          {/* Hamburger — visible below 990px */}
          <button
            className="navbar__burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </header>

      {/* Overlay — always in DOM, opacity toggles */}
      <div
        className={`sidebar-overlay ${open ? 'sidebar-overlay--show' : ''}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar — always in DOM, translateX toggles */}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>

        <div className="sidebar__top">
          <button className="navbar__logo" onClick={() => navigate('home')}>
            <span className="navbar__logo-icon">🏠</span>
            <span className="navbar__logo-text">IfiteLodge</span>
            <span className="navbar__logo-badge">NAU</span>
          </button>
          <button className="sidebar__close" onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav className="sidebar__nav">
          {NAV_LINKS.map(({ page: p, label, icon }) => (
            <button
              key={p}
              className={`sidebar__link ${page === p ? 'sidebar__link--on' : ''}`}
              onClick={() => navigate(p)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}

          <button
            className="sidebar__link sidebar__link--submit"
            onClick={() => navigate('submit')}
          >
            <span>✍️</span>
            <span>Submit a Lodge</span>
          </button>
        </nav>

        <div className="sidebar__bottom">
          <button
            className="sidebar__sign-in"
            onClick={() => navigate('login')}
          >
            👤 Sign In / Register
          </button>
          <p>IfiteLodge · NAU Student Platform</p>
        </div>

      </aside>
    </>
  )
}