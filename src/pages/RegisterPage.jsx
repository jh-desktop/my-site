import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'

const DOMAIN = '@davao-club.com'

const S = {
  page: { minHeight: '100vh', background: '#0a0f1e', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '80px 1rem 2rem' },
  card: { background: '#111827', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '480px' },
  title: { color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' },
  subtitle: { color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' },
  label: { display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.4rem' },
  group: { marginBottom: '1.25rem' },
  btn: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  alertError: { background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' },
  fieldError: { color: '#f87171', fontSize: '0.75rem', marginTop: '0.3rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' },
}

const input = (hasError) => ({
  width: '100%', padding: '0.75rem 1rem',
  background: '#1f2937', border: `1px solid ${hasError ? '#ef4444' : '#374151'}`,
  borderRadius: '0.5rem', color: '#f9fafb', fontSize: '1rem', outline: 'none',
})

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const EMPTY = { name: '', nickname: '', contact: '', username: '', password: '', confirm: '' }

const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) errors.name = '이름을 입력해주세요.'
  else if (form.name.trim().length < 2) errors.name = '이름은 2자 이상이어야 합니다.'

  if (!form.nickname.trim()) errors.nickname = '닉네임을 입력해주세요.'
  else if (form.nickname.trim().length < 2) errors.nickname = '닉네임은 2자 이상이어야 합니다.'

  const phoneDigits = form.contact.replace(/-/g, '')
  if (!form.contact) errors.contact = '연락처를 입력해주세요.'
  else if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) errors.contact = '올바른 전화번호를 입력해주세요. (예: 010-1234-5678)'

  if (!form.username.trim()) errors.username = '아이디를 입력해주세요.'
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) errors.username = '영문, 숫자, _ 조합 3~20자로 입력해주세요.'

  if (!form.password) errors.password = '비밀번호를 입력해주세요.'
  else if (form.password.length < 6) errors.password = '비밀번호는 6자 이상이어야 합니다.'

  if (!form.confirm) errors.confirm = '비밀번호 확인을 입력해주세요.'
  else if (form.password !== form.confirm) errors.confirm = '비밀번호가 일치하지 않습니다.'

  return errors
}

export default function RegisterPage() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const navigate = useNavigate()

  const set = (key) => (e) => {
    const value = key === 'contact' ? formatPhone(e.target.value) : e.target.value
    setForm(p => ({ ...p, [key]: value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  const requiredFields = ['name', 'nickname', 'contact', 'username', 'password']
  const filled = requiredFields.filter(k => form[k].trim() !== '').length
  const progress = Math.round((filled / requiredFields.length) * 100)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('loading')
    try {
      const dup = await getDocs(query(collection(db, 'members'), where('username', '==', form.username.trim())))
      if (!dup.empty) {
        setErrors(p => ({ ...p, username: '이미 사용 중인 아이디입니다.' }))
        setStatus(null)
        return
      }
      const { user } = await createUserWithEmailAndPassword(auth, form.username.trim() + DOMAIN, form.password)
      await setDoc(doc(db, 'members', user.uid), {
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        contact: form.contact,
        username: form.username.trim(),
        loginType: 'email',
        registeredAt: serverTimestamp(),
      })
      navigate('/')
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrors(p => ({ ...p, username: '이미 사용 중인 아이디입니다.' }))
        setStatus(null)
      } else {
        setStatus('error')
      }
    }
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.title}>♠ 멤버 등록</h2>
        <p style={S.subtitle}>DAVAO 홀덤 클럽에 참여하세요</p>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>입력 진행도</span>
            <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: '600' }}>{progress}%</span>
          </div>
          <div style={{ background: '#1f2937', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px', width: `${progress}%`,
              background: progress === 100 ? 'linear-gradient(90deg, #059669, #34d399)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        {status === 'error' && <div style={S.alertError}>오류가 발생했습니다. 다시 시도해주세요.</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.group}>
            <label style={S.label}>이름</label>
            <input style={input(errors.name)} value={form.name} onChange={set('name')} placeholder="실명 입력" />
            {errors.name && <div style={S.fieldError}>{errors.name}</div>}
          </div>
          <div style={S.group}>
            <label style={S.label}>Davao 닉네임</label>
            <input style={input(errors.nickname)} value={form.nickname} onChange={set('nickname')} placeholder="게임에서 사용하는 닉네임" />
            {errors.nickname && <div style={S.fieldError}>{errors.nickname}</div>}
          </div>
          <div style={S.group}>
            <label style={S.label}>연락처</label>
            <input style={input(errors.contact)} value={form.contact} onChange={set('contact')} placeholder="010-1234-5678" />
            {errors.contact && <div style={S.fieldError}>{errors.contact}</div>}
          </div>
          <div style={S.group}>
            <label style={S.label}>아이디</label>
            <input style={input(errors.username)} value={form.username} onChange={set('username')} placeholder="영문, 숫자, _ 3~20자" autoComplete="username" />
            {errors.username && <div style={S.fieldError}>{errors.username}</div>}
          </div>
          <div style={S.group}>
            <label style={S.label}>비밀번호</label>
            <input style={input(errors.password)} type="password" value={form.password} onChange={set('password')} placeholder="6자 이상" autoComplete="new-password" />
            {errors.password && <div style={S.fieldError}>{errors.password}</div>}
          </div>
          <div style={S.group}>
            <label style={S.label}>비밀번호 확인</label>
            <input style={input(errors.confirm)} type="password" value={form.confirm} onChange={set('confirm')} placeholder="비밀번호 재입력" autoComplete="new-password" />
            {errors.confirm && <div style={S.fieldError}>{errors.confirm}</div>}
          </div>
          <button style={{ ...S.btn, opacity: status === 'loading' ? 0.6 : 1 }} disabled={status === 'loading'}>
            {status === 'loading' ? '등록 중...' : '등록하기'}
          </button>
        </form>

        <div style={S.footer}>
          이미 계정이 있으신가요? <Link to="/login" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: '600' }}>로그인</Link>
        </div>
      </div>
    </div>
  )
}
