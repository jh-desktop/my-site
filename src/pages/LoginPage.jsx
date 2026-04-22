import { useState } from 'react'
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'

const googleProvider = new GoogleAuthProvider()
const DOMAIN = '@davao-club.com'

const S = {
  page: { minHeight: '100vh', background: '#0a0f1e', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' },
  card: { background: '#111827', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '420px' },
  title: { color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.25rem' },
  subtitle: { color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' },
  label: { display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.4rem' },
  group: { marginBottom: '1.25rem' },
  btn: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer' },
  googleBtn: { width: '100%', padding: '0.875rem', background: '#fff', color: '#1f2937', fontWeight: '600', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
  divider: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0' },
  dividerLine: { flex: 1, height: '1px', background: '#1f2937' },
  dividerText: { color: '#6b7280', fontSize: '0.8rem', whiteSpace: 'nowrap' },
  generalError: { background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem', textAlign: 'center' },
  fieldError: { color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' },
}

const input = (hasError) => ({
  width: '100%', padding: '0.75rem 1rem',
  background: '#1f2937', border: `1px solid ${hasError ? '#ef4444' : '#374151'}`,
  borderRadius: '0.5rem', color: '#f9fafb', fontSize: '1rem', outline: 'none',
})

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.username.trim()) errs.username = '아이디를 입력해주세요.'
    if (!form.password) errs.password = '비밀번호를 입력해주세요.'
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.username.trim() + DOMAIN, form.password)
      navigate('/')
    } catch {
      setErrors({ general: '아이디 또는 비밀번호가 올바르지 않습니다.' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      const { user } = await signInWithPopup(auth, googleProvider)
      const snap = await getDoc(doc(db, 'members', user.uid))
      if (!snap.exists()) {
        await setDoc(doc(db, 'members', user.uid), {
          name: user.displayName || '',
          nickname: '',
          contact: '',
          username: user.email || '',
          loginType: 'google',
          registeredAt: serverTimestamp(),
        })
      }
      navigate('/')
    } catch {
      setErrors({ general: '구글 로그인에 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.title}>♠ DAVAO</h2>
        <p style={S.subtitle}>홀덤 클럽 로그인</p>

        {errors.general && <div style={S.generalError}>{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.group}>
            <label style={S.label}>아이디</label>
            <input style={input(errors.username)} value={form.username} onChange={set('username')} placeholder="아이디 입력" autoComplete="username" />
            {errors.username && <div style={S.fieldError}>{errors.username}</div>}
          </div>
          <div style={S.group}>
            <label style={S.label}>비밀번호</label>
            <input style={input(errors.password)} type="password" value={form.password} onChange={set('password')} placeholder="비밀번호 입력" autoComplete="current-password"
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e)} />
            {errors.password && <div style={S.fieldError}>{errors.password}</div>}
          </div>
          <button style={{ ...S.btn, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>또는</span>
          <div style={S.dividerLine} />
        </div>

        <button style={{ ...S.googleBtn, opacity: loading ? 0.6 : 1 }} onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Google로 로그인
        </button>

        <div style={S.footer}>
          아직 회원이 아니신가요? <Link to="/register" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '600' }}>멤버 등록</Link>
        </div>
      </div>
    </div>
  )
}
