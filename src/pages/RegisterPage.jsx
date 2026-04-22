import { useState } from 'react'
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

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
}

const input = (hasError) => ({
  width: '100%', padding: '0.75rem 1rem',
  background: '#1f2937',
  border: `1px solid ${hasError ? '#ef4444' : '#374151'}`,
  borderRadius: '0.5rem', color: '#f9fafb', fontSize: '1rem', outline: 'none',
})

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) errors.name = '이름을 입력해주세요.'
  else if (form.name.trim().length < 2) errors.name = '이름은 2자 이상이어야 합니다.'

  if (!form.nickname.trim()) errors.nickname = '닉네임을 입력해주세요.'
  else if (form.nickname.trim().length < 2) errors.nickname = '닉네임은 2자 이상이어야 합니다.'

  const phoneDigits = form.contact.replace(/-/g, '')
  if (!form.contact) errors.contact = '연락처를 입력해주세요.'
  else if (!/^01[016789]\d{7,8}$/.test(phoneDigits)) errors.contact = '올바른 전화번호를 입력해주세요. (예: 010-1234-5678)'

  return errors
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', nickname: '', contact: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)

  const set = (key) => (e) => {
    const value = key === 'contact' ? formatPhone(e.target.value) : e.target.value
    setForm(p => ({ ...p, [key]: value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  const filled = Object.values(form).filter(v => v.trim() !== '').length
  const progress = Math.round((filled / 3) * 100)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('loading')
    try {
      const dup = await getDocs(query(collection(db, 'members'), where('contact', '==', form.contact)))
      if (!dup.empty) { setStatus('duplicate'); return }
      await addDoc(collection(db, 'members'), { ...form, registeredAt: serverTimestamp() })
      setStatus('success')
      setForm({ name: '', nickname: '', contact: '' })
      setErrors({})
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={S.page}>
        <div style={{ ...S.card, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🃏</div>
          <h2 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>등록 완료!</h2>
          <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>DAVAO 홀덤 클럽에 오신걸 환영합니다.</p>
          <button style={S.btn} onClick={() => setStatus(null)}>다시 등록하기</button>
        </div>
      </div>
    )
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

        {status === 'duplicate' && <div style={S.alertError}>이미 등록된 연락처입니다.</div>}
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
          <button style={{ ...S.btn, opacity: status === 'loading' ? 0.6 : 1 }} disabled={status === 'loading'}>
            {status === 'loading' ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
