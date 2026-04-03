import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const navLinks = [
  { name: '首页', path: '/' },
  { name: '服务', path: '/services' },
  { name: '案例', path: '/cases' },
  { name: '流程', path: '/process' },
  { name: '定价', path: '/pricing' },
  { name: '关于', path: '/about' },
]

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: '16px',
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1152px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              className="font-heading"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: '#fff',
              }}
            >
              A
            </div>
          </div>
        </Link>

        {/* Center Nav Pill */}
        <div
          className="liquid-glass"
          style={{
            borderRadius: '9999px',
            padding: '6px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                fontFamily: "'Barlow', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                padding: '8px 16px',
                borderRadius: '9999px',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/pricing" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: '#fff',
                color: '#000',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                padding: '8px 20px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              开始体验
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </button>
          </Link>
        </div>

        {/* Spacer */}
        <div style={{ width: '48px' }} />
      </div>
    </nav>
  )
}
