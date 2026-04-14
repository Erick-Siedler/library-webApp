import { useNavigate } from 'react-router-dom'
import { useAuth } from '../routing/auth-context'

export default function Home() {
  const navigate = useNavigate()
  const { clearAuth } = useAuth()
  const apiBaseUrl = `http://${window.location.hostname}:8000`

  async function handleLogout() {
    try {
      await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
        method: 'GET',
        credentials: 'include',
      })

      const xsrfToken = decodeURIComponent(
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1] || ''
      )

      await fetch(`${apiBaseUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
          Accept: 'application/json',
        },
      })
    } finally {
      clearAuth()
      navigate('/', { replace: true })
    }
  }

  return (
    <main>
      <h1>Home</h1>
      <button type="button" onClick={handleLogout}>
        Sair
      </button>
    </main>
  )
}
