import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SupabaseHost } from '../../supabase.js'
import { useAuthStore } from '../store/authstore.js'

const SignUp = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [notice, setNotice] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const setUser = useAuthStore((state) => state.setUser)

    const signUp = async (event) => {
        event.preventDefault()
        setErrorMessage('')
        setNotice('')
        setIsSubmitting(true)

        const { data, error } = await SupabaseHost.from('User').insert({
            username: username,
            password: password,
            balance: 0,
        })
        console.log('SignUp data:', data)


        setIsSubmitting(false)

        if (error) {
            console.error('Error creating account:', error.message)
            setErrorMessage(error.message)
            return
        }

        if (data.User) {
            setUser(data.User.id)
            console.log('Account created and signed in:', data.User)
            navigate('/home')
            return
        }

        setNotice('Account created. Check your email to confirm your account, then sign in.')
    }

    return (
        <form style={styles.main} onSubmit={signUp}>
            <h1 style={styles.title}>Create account</h1>
            <input
                style={styles.input}
                type="text"
                placeholder="Username"
                autoComplete="username"
                minLength={3}
                maxLength={32}
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />

            <input
                style={styles.input}
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            {errorMessage && <p role="alert" style={styles.message}>{errorMessage}</p>}
            {notice && <p role="status" style={styles.message}>{notice}</p>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>
            <p>Already have an account? <Link to="/">Sign in</Link></p>
        </form>
    )
}

const styles = {
    main: {
        background: 'var(--surface)',
        boxShadow: '0 12px 30px var(--card-shadow)',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        margin: '100px auto 0',
        padding: 24,
        width: 'min(340px, calc(100% - 32px))',
        boxSizing: 'border-box',
        borderRadius: 10
    },
    title: {
        fontSize: 24,
        margin: '0 0 8px'
    },
    input: {
        padding: 8,
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: 5,
        border: '1px solid var(--card-border)'
    },
    message: {
        margin: 0,
        overflowWrap: 'anywhere'
    }
}

export default SignUp
