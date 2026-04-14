import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import Header from  './components/preAuth-header'
import { Link, useLocation } from 'react-router-dom';

export default function RegisForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmed, setConfirmed] = useState('')
    const [feedback, setFeedback] = useState('')
    const [feedbackType, setFeedbackType] = useState('')

    const navigate = useNavigate()
    const apiBaseUrl = `http://${window.location.hostname}:8000`

    async function handleRegisSubmit(e) {
        e.preventDefault()
        setFeedback('')
        setFeedbackType('')

        if(password !== confirmed){
            setFeedback('As senhas nao coincidem')
            setFeedbackType('error')
            return
        }

        const data = {
            name,
            email,
            password,
            password_confirmation: confirmed,
        }

        try{
            await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, {
                method: 'GET',
                credentials: 'include'
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

            const response = await fetch(`${apiBaseUrl}/api/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json',
                    'X-XSRF-TOKEN' : xsrfToken,
                    Accept: 'application/json'
                },
                body: JSON.stringify(data)
            })

            let result = {}

            try {
                result = await response.json()
            } catch {
                result = {}
            }

            const success = response.ok && result.success === true

            setFeedback(result.message || (success ? 'register attempt successful' : 'register attempt failed'))
            setFeedbackType(success ? 'success' : 'error')

            if (success) {
                navigate('/')
            }
        } catch (error) {
            console.error(error)
            setFeedback('register attempt failed')
            setFeedbackType('error')
        }
    }

    return (
        <>
        <div className="auth-page">
            <Header />
            <main className="auth-inner">
            <div className="auth-card">
                <p className="auth-eyebrow">New membership</p>
                <h1 className="auth-heading">Open your account.</h1>
                <p className="auth-subtext">
                Already a member? <Link to="/">Sign in here</Link>
                </p>

                {feedback && (
                <p className={`feedback-msg ${feedbackType === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                    {feedback}
                </p>
                )}

                <form onSubmit={handleRegisSubmit} className="auth-form">
                <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" type="text" value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name" autoComplete="name" required />
                </div>
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
                    placeholder="••••••••" autoComplete="new-password" required />
                </div>
                <div className="field">
                    <label htmlFor="confirmed">Confirm password</label>
                    <input id="confirmed" type="password" value={confirmed}
                    onChange={e => setConfirmed(e.target.value)}
                    placeholder="••••••••" autoComplete="new-password" required />
                </div>
                <button type="submit" className="auth-btn">Create account</button>
                </form>
            </div>
            </main>
        </div>
        </>
    )
}
