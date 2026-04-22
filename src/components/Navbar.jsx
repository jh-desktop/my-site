import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const protectedLinks = [
  { path: '/schedule', label: '스케줄' },
  { path: '/history', label: '점수히스토리' },
  { path: '/admin', label: '관리자' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, member, logout } = useAuth()

  const isActive = (path) => pathname === path

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: isActive(path) ? '#f59e0b' : '#9ca3af',
    fontWeight: isActive(path) ? '600' : '400',
    fontSize: '0.875rem',
    borderBottom: isActive(path) ? '2px solid #f59e0b' : '2px solid transparent',
    paddingBottom: '2px',
  })

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10, 15, 30, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #1f2937',
      padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '60px',
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '1.2rem', color: '#f59e0b', fontWeight: '900', letterSpacing: '0.1em' }}>
          ♠ DAVAO
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            {protectedLinks.map(link => (
              <Link key={link.path} to={link.path} style={linkStyle(link.path)}>
                {link.label}
              </Link>
            ))}
            <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: '600' }}>
              {member?.nickname || member?.name || ''}
            </span>
            <button
              onClick={logout}
              style={{ padding: '0.4rem 1rem', background: '#1f2937', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>로그인</Link>
            <Link to="/register" style={{
              padding: '0.4rem 1.2rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', fontWeight: '700', borderRadius: '0.4rem',
              textDecoration: 'none', fontSize: '0.875rem',
            }}>
              멤버등록
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
