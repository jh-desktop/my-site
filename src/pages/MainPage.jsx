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
        textAlign: 'center', padding: '2rem', position: 'relative', zIndex: 1,
      }}>
        <div style={{ fontSize: '0.8rem', color: '#f59e0b', letterSpacing: '0.5em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Welcome to ♠
        </div>

        <h1 style={{
          fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: '900', margin: 0,
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.1em', lineHeight: 1,
          filter: 'drop-shadow(0 0 40px rgba(245, 158, 11, 0.4))',
        }}>
          DAVAO
        </h1>

        <div style={{
          fontSize: 'clamp(0.75rem, 2vw, 1rem)', color: '#4b5563',
          letterSpacing: '0.6em', marginTop: '0.75rem', marginBottom: '3rem',
          textTransform: 'uppercase',
        }}>
          ♠ HOLDEM CLUB ♠
        </div>

        <div style={{
          display: 'flex', gap: '4rem', marginBottom: '3.5rem',
          padding: '1.5rem 3rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid #1f2937', borderRadius: '1rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', lineHeight: 1 }}>{memberCount}</div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.4rem', letterSpacing: '0.1em' }}>MEMBERS</div>
          </div>
          <div style={{ width: '1px', background: '#1f2937' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', lineHeight: 1 }}>♠♥♦♣</div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.4rem', letterSpacing: '0.1em' }}>HOLDEM</div>
          </div>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>
              환영합니다, <span style={{ color: '#f59e0b', fontWeight: '600' }}>{member?.nickname || member?.name}</span>님!
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/schedule" style={{
                padding: '0.9rem 2.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000', fontWeight: '700', borderRadius: '0.5rem',
                textDecoration: 'none', fontSize: '1rem',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
              }}>
                스케줄 보기
              </Link>
              <Link to="/history" style={{
                padding: '0.9rem 2.5rem', background: 'transparent',
                color: '#f59e0b', fontWeight: '700', borderRadius: '0.5rem',
                textDecoration: 'none', fontSize: '1rem', border: '2px solid #f59e0b',
              }}>
                점수 히스토리
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login" style={{
              padding: '0.9rem 2.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', fontWeight: '700', borderRadius: '0.5rem',
              textDecoration: 'none', fontSize: '1rem',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
            }}>
              로그인하기
            </Link>
            <Link to="/register" style={{
              padding: '0.9rem 2.5rem', background: 'transparent',
              color: '#f59e0b', fontWeight: '700', borderRadius: '0.5rem',
              textDecoration: 'none', fontSize: '1rem', border: '2px solid #f59e0b',
            }}>
              멤버 등록
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
