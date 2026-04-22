import { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const S = {
  page: { minHeight: '100vh', background: '#0a0f1e', padding: '80px 1rem 2rem' },
  container: { maxWidth: '700px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' },
  addBtn: { padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontWeight: '700', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' },
  card: { background: '#111827', border: '1px solid #1f2937', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1rem' },
  input: { width: '100%', padding: '0.65rem 0.875rem', background: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#f9fafb', fontSize: '0.9rem', outline: 'none', marginBottom: '0.75rem' },
  row: { display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' },
  cancelBtn: { padding: '0.4rem 0.9rem', background: '#1f2937', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' },
  saveBtn: { padding: '0.4rem 0.9rem', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' },
  editBtn: { padding: '0.4rem 0.9rem', background: '#1f2937', color: '#9ca3af', border: '1px solid #374151', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' },
  delBtn: { padding: '0.4rem 0.9rem', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' },
  empty: { textAlign: 'center', color: '#6b7280', padding: '3rem' },
}

function ScheduleForm({ initial = {}, onSave, onCancel }) {
  const [form, setForm] = useState({ title: '', date: '', location: '', note: '', ...initial })
  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))
  return (
    <div>
      <input style={S.input} placeholder="모임 제목" value={form.title} onChange={set('title')} />
      <input style={S.input} type="datetime-local" value={form.date} onChange={set('date')} />
      <input style={S.input} placeholder="장소" value={form.location} onChange={set('location')} />
      <input style={S.input} placeholder="메모 (선택)" value={form.note} onChange={set('note')} />
      <div style={S.row}>
        <button style={S.cancelBtn} onClick={onCancel}>취소</button>
        <button style={S.saveBtn} onClick={() => onSave(form)}>저장</button>
      </div>
    </div>
  )
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'schedules'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => setSchedules(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  const handleAdd = async (form) => {
    await addDoc(collection(db, 'schedules'), { ...form, createdAt: serverTimestamp() })
    setAdding(false)
  }

  const handleEdit = async (form) => {
    await updateDoc(doc(db, 'schedules', editing), form)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (confirm('삭제하시겠습니까?')) await deleteDoc(doc(db, 'schedules', id))
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <h2 style={S.title}>📅 스케줄</h2>
          <button style={S.addBtn} onClick={() => setAdding(true)}>+ 일정 추가</button>
        </div>

        {adding && (
          <div style={{ ...S.card, borderColor: '#f59e0b' }}>
            <ScheduleForm onSave={handleAdd} onCancel={() => setAdding(false)} />
          </div>
        )}

        {schedules.length === 0 && !adding && <div style={S.empty}>등록된 일정이 없습니다.</div>}

        {schedules.map(s => (
          <div key={s.id} style={S.card}>
            {editing === s.id ? (
              <ScheduleForm initial={s} onSave={handleEdit} onCancel={() => setEditing(null)} />
            ) : (
              <>
                <div style={{ fontWeight: '600', color: '#f9fafb', marginBottom: '0.4rem' }}>{s.title}</div>
                <div style={{ color: '#f59e0b', fontSize: '0.875rem', marginBottom: '0.3rem' }}>📅 {s.date}</div>
                {s.location && <div style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.3rem' }}>📍 {s.location}</div>}
                {s.note && <div style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{s.note}</div>}
                <div style={S.row}>
                  <button style={S.editBtn} onClick={() => setEditing(s.id)}>수정</button>
                  <button style={S.delBtn} onClick={() => handleDelete(s.id)}>삭제</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
