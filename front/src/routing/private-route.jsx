import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth-context'

export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}
