import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [feedback, setFeedback] = useState('')
    const [feedbackType, setFeedbackType] = useState('')

    const navigate = useNavigate()
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
                navigate('/home')
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
            {feedback ? (
                <p className={`feedback ${feedbackType === 'success' ? 'feedback-success' : 'feedback-error'}`}>
                    {feedback}
                </p>
            ) : null}

            <form onSubmit={handleLoginSubmit} className='FormLogin'>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Youremail@gmail.com' autoComplete='email' required/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' autoComplete="current-password" required/>
                <button type='submit'>Sign in</button>
            </form>
        </>
    )
}
