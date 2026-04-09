import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth-context'

export default function GuestRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}
