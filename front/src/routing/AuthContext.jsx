import { useCallback, useEffect, useMemo, useState } from 'react'
import AuthContext from './auth-context'
const apiBaseUrl = `http://${window.location.hostname}:8000`

async function fetchCurrentUser() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      return { authenticated: false, user: null }
    }

    let payload = null

    try {
      payload = await response.json()
    } catch {
      payload = null
    }

    return { authenticated: true, user: payload ?? {} }
  } catch {
    return { authenticated: false, user: null }
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const refreshAuth = useCallback(async () => {
    setLoading(true)

    const { authenticated, user: currentUser } = await fetchCurrentUser()

    setIsAuthenticated(authenticated)
    setUser(currentUser)
    setLoading(false)

    return authenticated
  }, [])

  const markAuthenticated = useCallback((currentUser = {}) => {
    setIsAuthenticated(true)
    setUser(currentUser)
  }, [])

  const clearAuth = useCallback(() => {
    setIsAuthenticated(false)
    setUser(null)
  }, [])

  useEffect(() => {
    let active = true

    async function initializeAuth() {
      const { authenticated, user: currentUser } = await fetchCurrentUser()

      if (!active) {
        return
      }

      setIsAuthenticated(authenticated)
      setUser(currentUser)
      setLoading(false)
    }

    initializeAuth()

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      refreshAuth,
      markAuthenticated,
      clearAuth,
    }),
    [user, isAuthenticated, loading, refreshAuth, markAuthenticated, clearAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
