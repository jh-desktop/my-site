import { useState } from 'react'
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
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  const linkStyle = (path) => ({
    textDecoration: 'none',
    color: pathname === path ? '#f59e0b' : '#9ca3af',
    fontWeight: pathname === path ? '600' : '400',
    fontSize: '0.875rem',
    borderBottom: pathname === path ? '2px solid #f59e0b' : '2px solid transparent',
    paddingBottom: '2px',
  })

  const mobileLinkStyle = (path) => ({
    textDecoration: 'none',
    color: pathname === path ? '#f59e0b' : '#d1d5db',
    fontWeight: pathname === path ? '600' : '400',
    fontSize: '1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #1f2937',
    display: 'block',
  })

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10, 15, 30, 0.97)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #1f2937',
        padding: '0 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }} onClick={close}>
          <span style={{ fontSize: '1.2rem', color: '#f59e0b', fontWeight: '900', letterSpacing: '0.1em' }}>
            ♠ DAVAO
          </span>
        </Link>

        {/* Desktop 메뉴 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
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
              <button onClick={logout} style={{ padding: '0.4rem 1rem', background: '#1f2937', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle('/login')}>로그인</Link>
              <Link to="/register" style={{ padding: '0.4rem 1.2rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', borderRadius: '0.4rem', textDecoration: 'none', fontSize: '0.875rem' }}>
                멤버등록
              </Link>
            </>
          )}
        </div>

        {/* 햄버거 버튼 */}
        <button
          onClick={() => setOpen(p => !p)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#f59e0b', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}
          className="hamburger"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* 모바일 드롭다운 메뉴 */}
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {user ? (
          <>
            <div style={{ color: '#f59e0b', fontWeight: '700', padding: '0.5rem 0', borderBottom: '1px solid #1f2937' }}>
              {member?.nickname || member?.name}
            </div>
            {protectedLinks.map(link => (
              <Link key={link.path} to={link.path} style={mobileLinkStyle(link.path)} onClick={close}>
                {link.label}
              </Link>
            ))}
            <button onClick={() => { logout(); close() }} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1rem', padding: '0.75rem 0', cursor: 'pointer', textAlign: 'left' }}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={mobileLinkStyle('/login')} onClick={close}>로그인</Link>
            <Link to="/register" style={mobileLinkStyle('/register')} onClick={close}>멤버등록</Link>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
