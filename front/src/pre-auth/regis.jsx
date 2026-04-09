import { useState } from 'react'
import { useNavigate } from "react-router-dom"

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
            {feedback ? (
                <p className={`feedback ${feedbackType === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                    {feedback}
                </p>
            ) : null}

            <form onSubmit={handleRegisSubmit}>
                <input type="text" value={name}onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Youremail@gmail.com' autoComplete='email' required/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' autoComplete="new-password" required/>
                <input type="password" value={confirmed} onChange={(e) => setConfirmed(e.target.value)} placeholder="Repeat password" autoComplete="new-password" required />

                <button type='submit'>Sign Up</button>
            </form>
        </>
    )
}
