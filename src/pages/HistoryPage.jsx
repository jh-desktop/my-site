import { useState, useEffect } from 'react'
import { collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const badge = (type) => ({
  display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '0.3rem',
  fontSize: '0.75rem', fontWeight: '600',
  background: type === '구매' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(239, 68, 68, 0.2)',
  color: type === '구매' ? '#34d399' : '#f87171',
  border: `1px solid ${type === '구매' ? '#059669' : '#ef4444'}`,
})

const S = {
  page: { minHeight: '100vh', background: '#0a0f1e', padding: '80px 1rem 2rem' },
  container: { maxWidth: '700px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' },
  addBtn: { padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' },
  card: { background: '#111827', border: '1px solid #1f2937', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' },
  select: { width: '100%', padding: '0.65rem 0.875rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#f9fafb', fontSize: '0.9rem', outline: 'none', marginBottom: '0.75rem' },
  row: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' },
  cancelBtn: { padding: '0.4rem 0.9rem', background: '#1f2937', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' },
  saveBtn: { padding: '0.4rem 0.9rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  delBtn: { padding: '0.3rem 0.75rem', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '0.3rem', cursor: 'pointer', fontSize: '0.75rem' },
  empty: { textAlign: 'center', color: '#6b7280', padding: '3rem' },
  fieldError: { color: '#f87171', fontSize: '0.75rem', marginTop: '-0.5rem', marginBottom: '0.75rem' },
}

const input = (hasError) => ({
  width: '100%', padding: '0.65rem 0.875rem',
  background: '#1f2937',
  border: `1px solid ${hasError ? '#ef4444' : '#374151'}`,
  borderRadius: '0.5rem', color: '#f9fafb', fontSize: '0.9rem', outline: 'none',
  marginBottom: hasError ? '0.25rem' : '0.75rem',
})

const validate = (form) => {
  const errors = {}
  if (!form.date) errors.date = '날짜를 선택해주세요.'
  if (!form.buyer.trim()) errors.buyer = '구매자 닉네임을 입력해주세요.'
  if (!form.seller.trim()) errors.seller = '판매자 닉네임을 입력해주세요.'
  if (!form.amount.trim()) errors.amount = '금액을 입력해주세요.'
  else if (!/^\d+$/.test(form.amount.replace(/,/g, ''))) errors.amount = '숫자만 입력해주세요.'
  return errors
}

const EMPTY = { type: '구매', date: '', buyer: '', seller: '', amount: '', note: '' }

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const set = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  useEffect(() => {
    const q = query(collection(db, 'scoreHistory'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  const handleSave = async () => {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    await addDoc(collection(db, 'scoreHistory'), { ...form, createdAt: serverTimestamp() })
    setAdding(false)
    setForm(EMPTY)
    setErrors({})
  }

  const handleCancel = () => {
    setAdding(false)
    setForm(EMPTY)
    setErrors({})
  }

  const handleDelete = async (id) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, 'scoreHistory', id))
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <h2 style={S.title}>💰 점수 히스토리</h2>
          <button style={S.addBtn} onClick={() => setAdding(true)}>+ 내역 추가</button>
        </div>

        {adding && (
          <div style={{ ...S.card, borderColor: '#f59e0b' }}>
            <select style={S.select} value={form.type} onChange={set('type')}>
              <option value="구매">구매</option>
              <option value="판매">판매</option>
            </select>

            <input style={input(errors.date)} type="date" value={form.date} onChange={set('date')} />
            {errors.date && <div style={S.fieldError}>{errors.date}</div>}

            <input style={input(errors.buyer)} placeholder="구매자 닉네임" value={form.buyer} onChange={set('buyer')} />
            {errors.buyer && <div style={S.fieldError}>{errors.buyer}</div>}

            <input style={input(errors.seller)} placeholder="판매자 닉네임" value={form.seller} onChange={set('seller')} />
            {errors.seller && <div style={S.fieldError}>{errors.seller}</div>}

            <input style={input(errors.amount)} placeholder="금액 (숫자만 입력)" value={form.amount} onChange={set('amount')} />
            {errors.amount && <div style={S.fieldError}>{errors.amount}</div>}

            <input style={input(false)} placeholder="메모 (선택)" value={form.note} onChange={set('note')} />

            <div style={S.row}>
              <button style={S.cancelBtn} onClick={handleCancel}>취소</button>
              <button style={S.saveBtn} onClick={handleSave}>저장</button>
            </div>
          </div>
        )}

        {history.length === 0 && !adding && <div style={S.empty}>등록된 내역이 없습니다.</div>}

        {history.map(h => (
          <div key={h.id} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={badge(h.type)}>{h.type}</span>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', marginLeft: '0.75rem' }}>{h.date}</span>
                <div style={{ marginTop: '0.5rem', fontWeight: '600', color: '#f59e0b', fontSize: '1.1rem' }}>{h.amount}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.3rem' }}>
                  {h.buyer} → {h.seller}
                </div>
                {h.note && <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.3rem' }}>{h.note}</div>}
              </div>
              <button style={S.delBtn} onClick={() => handleDelete(h.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
