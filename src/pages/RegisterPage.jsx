import { useState } from 'react'
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

const S = {
  page: { minHeight: '100vh', background: '#0a0f1e', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '80px 1rem 2rem' },
  card: { background: '#111827', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '480px' },
  title: { color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' },
  subtitle: { color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginBottom: '2rem' },
  label: { display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.4rem' },
  input: { width: '100%', padding: '0.75rem 1rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#f9fafb', fontSize: '1rem', outline: 'none' },
  group: { marginBottom: '1.25rem' },
  btn: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  error: { background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem' },
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', nickname: '', contact: '' })
  const [status, setStatus] = useState(null)

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.nickname || !form.contact) return
    setStatus('loading')
    try {
      const dup = await getDocs(query(collection(db, 'members'), where('contact', '==', form.contact)))
      if (!dup.empty) { setStatus('duplicate'); return }
      await addDoc(collection(db, 'members'), { ...form, registeredAt: serverTimestamp() })
      setStatus('success')
      setForm({ name: '', nickname: '', contact: '' })
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

        {status === 'duplicate' && <div style={S.error}>이미 등록된 연락처입니다.</div>}
        {status === 'error' && <div style={S.error}>오류가 발생했습니다. 다시 시도해주세요.</div>}

        <form onSubmit={handleSubmit}>
          <div style={S.group}>
            <label style={S.label}>이름</label>
            <input style={S.input} value={form.name} onChange={set('name')} placeholder="실명 입력" />
          </div>
          <div style={S.group}>
            <label style={S.label}>Davao 닉네임</label>
            <input style={S.input} value={form.nickname} onChange={set('nickname')} placeholder="게임에서 사용하는 닉네임" />
          </div>
          <div style={S.group}>
            <label style={S.label}>연락처</label>
            <input style={S.input} value={form.contact} onChange={set('contact')} placeholder="010-0000-0000" />
          </div>
          <button style={{ ...S.btn, opacity: status === 'loading' ? 0.6 : 1 }} disabled={status === 'loading'}>
            {status === 'loading' ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
