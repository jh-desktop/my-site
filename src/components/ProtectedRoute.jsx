import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (user === undefined) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#f59e0b', fontSize: '1.5rem' }}>♠</div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}
