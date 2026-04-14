import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/preAuth-header'
import { useAuth } from '../routing/auth-context'
import { Link, useLocation } from 'react-router-dom';
import './login-regis.css'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [feedback, setFeedback] = useState('')
    const [feedbackType, setFeedbackType] = useState('')

    const navigate = useNavigate()
    const { markAuthenticated } = useAuth()
    const apiBaseUrl = `http://${window.location.hostname}:8000`

    async function handleLoginSubmit(e){
        e.preventDefault()
        setFeedback('')
        setFeedbackType('')

        try{
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

            if (!xsrfToken) {
                throw new Error('XSRF-TOKEN nao encontrado. Verifique o host usado no frontend e backend.')
            }

            const response = await fetch(`${apiBaseUrl}/api/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json',
                    'X-XSRF-TOKEN' : xsrfToken,
                    Accept: 'application/json'
                },
                body: JSON.stringify({email,password})

            })

            let result = {}

            try {
                result = await response.json()
            }
            catch {
                result = {}
            }

            const authenticated = response.ok && result.success === true
            setFeedback(result.message || (authenticated ? 'login attempt successful' : 'login attempt failed'))
            setFeedbackType(authenticated ? 'success' : 'error')

            if (authenticated) {
                markAuthenticated(result.user ?? { email })
                navigate('/home', { replace: true })
            }
        }
        catch(error){
            console.error(error)
            setFeedback('login attempt failed')
            setFeedbackType('error')
        }
    }
    return(
        <>  
        <div className="auth-page">
            <Header />
            <main className="auth-inner">
            <div className="auth-card">
                <p className="auth-eyebrow">Member access</p>
                <h1 className="auth-heading">Welcome back.</h1>
                <p className="auth-subtext">
                No account yet? <Link to="/register">Create one free</Link>
                </p>

                {feedback && (
                <p className={`feedback-msg ${feedbackType === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                    {feedback}
                </p>
                )}

                <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input id="email" type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" required />
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="current-password" required />
                </div>
                <button type="submit" className="auth-btn">Sign in</button>
                </form>
            </div>
            </main>
        </div>
        </>
    )
}
