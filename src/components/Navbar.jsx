import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { path: '/', label: '홈' },
  { path: '/register', label: '멤버등록' },
  { path: '/schedule', label: '스케줄' },
  { path: '/history', label: '점수히스토리' },
  { path: '/admin', label: '관리자' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #1f2937',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '60px',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '1.2rem', color: '#f59e0b', fontWeight: '900', letterSpacing: '0.1em' }}>
          ♠ DAVAO
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              textDecoration: 'none',
              color: pathname === link.path ? '#f59e0b' : '#9ca3af',
              fontWeight: pathname === link.path ? '600' : '400',
              fontSize: '0.875rem',
              borderBottom: pathname === link.path ? '2px solid #f59e0b' : '2px solid transparent',
              paddingBottom: '2px',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
