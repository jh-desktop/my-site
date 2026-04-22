import { useState, useEffect } from 'react'
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

const ADMIN_PW = 'davao777'

const S = {
  page: { minHeight: '100vh', background: '#0a0f1e', display: 'flex', justifyContent: 'center', padding: '80px 1rem 2rem' },
  card: { background: '#111827', border: '1px solid #1f2937', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '800px', height: 'fit-content' },
  title: { color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' },
  input: { width: '100%', padding: '0.75rem 1rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#f9fafb', fontSize: '1rem', outline: 'none', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', cursor: 'pointer' },
  th: { padding: '0.75rem 1rem', background: '#1f2937', color: '#f59e0b', fontSize: '0.8rem', fontWeight: '600', textAlign: 'left', letterSpacing: '0.05em' },
  td: { padding: '0.875rem 1rem', borderBottom: '1px solid #1f2937', color: '#f9fafb', fontSize: '0.875rem' },
  delBtn: { padding: '0.3rem 0.75rem', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem' },
  error: { background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.875rem', textAlign: 'center' },
}

export default function AdminPage() {
  const [pw, setPw] = useState('')
  const [auth, setAuth] = useState(false)
  const [error, setError] = useState(false)
  const [members, setMembers] = useState([])

  useEffect(() => {
    if (!auth) return
    const q = query(collection(db, 'members'), orderBy('registeredAt', 'desc'))
    return onSnapshot(q, snap => setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [auth])

  const handleLogin = () => {
    if (pw === ADMIN_PW) { setAuth(true); setError(false) }
    else setError(true)
  }

  const handleDelete = async (id) => {
    if (confirm('멤버를 삭제하시겠습니까?')) await deleteDoc(doc(db, 'members', id))
  }

  const formatDate = (ts) => {
    if (!ts?.seconds) return '-'
    return new Date(ts.seconds * 1000).toLocaleDateString('ko-KR')
  }

  if (!auth) {
    return (
      <div style={{ ...S.page, alignItems: 'center' }}>
        <div style={{ ...S.card, maxWidth: '400px' }}>
          <h2 style={S.title}>🔐 관리자</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            관리자 비밀번호를 입력하세요
          </p>
          {error && <div style={S.error}>비밀번호가 틀렸습니다.</div>}
          <input
            style={S.input} type="password" placeholder="비밀번호"
            value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button style={S.btn} onClick={handleLogin}>로그인</button>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' }}>👥 멤버 목록</h2>
          <span style={{ color: '#f59e0b', fontWeight: '700', fontSize: '1.1rem' }}>{members.length}명</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['이름', 'Davao 닉네임', '연락처', '등록일', ''].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    등록된 멤버가 없습니다.
                  </td>
                </tr>
              ) : members.map(m => (
                <tr key={m.id}>
                  <td style={S.td}>{m.name}</td>
                  <td style={{ ...S.td, color: '#f59e0b' }}>{m.nickname}</td>
                  <td style={S.td}>{m.contact}</td>
                  <td style={{ ...S.td, color: '#6b7280' }}>{formatDate(m.registeredAt)}</td>
                  <td style={S.td}>
                    <button style={S.delBtn} onClick={() => handleDelete(m.id)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          style={{ ...S.btn, background: '#1f2937', color: '#9ca3af', marginTop: '1.5rem' }}
          onClick={() => setAuth(false)}
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
