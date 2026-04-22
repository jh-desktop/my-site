import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

const SUITS = [
  { symbol: '♠', color: '#f59e0b' },
  { symbol: '♥', color: '#ef4444' },
  { symbol: '♦', color: '#ef4444' },
  { symbol: '♣', color: '#f59e0b' },
]

const POSITIONS = [
  { top: '10%', left: '5%' },
  { top: '20%', right: '8%' },
  { top: '60%', left: '3%' },
  { top: '70%', right: '5%' },
  { top: '40%', left: '42%' },
  { top: '85%', left: '25%' },
  { top: '15%', left: '30%' },
  { top: '55%', right: '15%' },
]

const btnPrimary = {
  padding: '0.9rem 2rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
  color: '#000', fontWeight: '700', borderRadius: '0.5rem',
  textDecoration: 'none', fontSize: '1rem',
  boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
  display: 'block', textAlign: 'center',
}

const btnOutline = {
  padding: '0.9rem 2rem', background: 'transparent',
  color: '#f59e0b', fontWeight: '700', borderRadius: '0.5rem',
  textDecoration: 'none', fontSize: '1rem', border: '2px solid #f59e0b',
  display: 'block', textAlign: 'center',
}

export default function MainPage() {
  const [memberCount, setMemberCount] = useState(0)
  const { user, member } = useAuth()

  useEffect(() => {
    getCountFromServer(collection(db, 'members'))
      .then(snap => setMemberCount(snap.data().count))
      .catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', paddingTop: '60px', position: 'relative', overflow: 'hidden' }}>
      {POSITIONS.map((pos, i) => {
        const suit = SUITS[i % SUITS.length]
        return (
          <div key={i} style={{
            position: 'absolute', fontSize: '6rem', color: suit.color,
            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
            userSelect: 'none', pointerEvents: 'none',
            ...pos,
          }}>
            {suit.symbol}
          </div>
        )
      })}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 'calc(100vh - 60px)',
        textAlign: 'center', padding: '2rem 1rem', position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: '0.75rem', color: '#f59e0b', letterSpacing: '0.4em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Welcome to ♠
        </div>

        <h1 style={{
          fontSize: 'clamp(3.5rem, 15vw, 9rem)', fontWeight: '900', margin: 0,
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em', lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(245, 158, 11, 0.4))',
        }}>
          DAVAO
        </h1>

        <div style={{
          fontSize: 'clamp(0.65rem, 2vw, 1rem)', color: '#4b5563',
          letterSpacing: '0.4em', marginTop: '0.75rem', marginBottom: '2.5rem',
          textTransform: 'uppercase',
        }}>
          ♠ HOLDEM CLUB ♠
        </div>

        <div className="stats-box" style={{
          display: 'flex', gap: '3rem', marginBottom: '2.5rem',
          padding: '1.25rem 2.5rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #1f2937', borderRadius: '1rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', lineHeight: 1 }}>{memberCount}</div>
            <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '0.4rem', letterSpacing: '0.1em' }}>MEMBERS</div>
          </div>
          <div style={{ width: '1px', background: '#1f2937' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', lineHeight: 1 }}>♠♥♦♣</div>
            <div style={{ color: '#6b7280', fontSize: '0.7rem', marginTop: '0.4rem', letterSpacing: '0.1em' }}>HOLDEM</div>
          </div>
        </div>

        {user ? (
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <p style={{ color: '#9ca3af', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              환영합니다, <span style={{ color: '#f59e0b', fontWeight: '600' }}>{member?.nickname || member?.name}</span>님!
            </p>
            <div className="cta-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/schedule" style={btnPrimary}>스케줄 보기</Link>
              <Link to="/history" style={btnOutline}>점수 히스토리</Link>
            </div>
          </div>
        ) : (
          <div className="cta-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '360px' }}>
            <Link to="/login" style={btnPrimary}>로그인하기</Link>
            <Link to="/register" style={btnOutline}>멤버 등록</Link>
          </div>
        )}
      </div>
    </div>
  )
}
