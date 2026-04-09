import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const apiBaseUrl = `http://${window.location.hostname}:8000`

async function validateSession() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/user`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })

    return response.ok
  } catch {
    return false
  }
}

export default function GuestRoute() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let active = true

    async function check() {
      const isAuthenticated = await validateSession()

      if (!active) {
        return
      }

      setAuthenticated(isAuthenticated)
      setCheckingSession(false)
    }

    check()

    return () => {
      active = false
    }
  }, [])

  if (checkingSession) {
    return null
  }

  return authenticated ? <Navigate to="/home" replace /> : <Outlet />
}
