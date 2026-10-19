import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SupabaseHost } from '../../supabase.js'
import { useAuthStore } from '../store/authstore.js'

const SignIn = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { setUser, isAuthenticated } = useAuthStore()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home')
        }
    }, [isAuthenticated, navigate])

    const Signin = async (event) => {
        event.preventDefault()
        setErrorMessage('')
        setIsSubmitting(true)

        const { data, error } = await SupabaseHost.
            from('User')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single()
        console.log('SignIn data:', data)
        console.log('SignIn error:', error)

        setIsSubmitting(false)

        if (error) {
            //setErrorMessage(error.message)
            setErrorMessage('Invalid username or password')
            return
        }
        console.log('User found:', data.id)
        setUser(data.id)
        navigate('/home')
    }

    return (
        <form style={{ ...styles.main }} onSubmit={Signin}>
            <input
                style={{ ...styles.input }}
                type="text"
                placeholder="Username"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                style={{ ...styles.input }}
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <button style={{ ...styles.btn }} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
        </form>
    )



}
const styles = {
    main: {
        background: 'var(--surface)',
        boxShadow: '0 12px 30px var(--card-shadow)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '100px',
        width: '300px',
        alignSelf: 'center',
        justifySelf: 'center',
        height: '300px',
        borderRadius: 10

    },
    input: {
        padding: '10px',
        marginTop: '5px',
        marginBottom: '5px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#f0f0f0'

    },
    btn: {
        padding: '10px',
        marginTop: '5px',
        marginBottom: '5px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#88ff34'

    },
    p: {
        marginTop: '10px',
        marginBottom: '10px',
        textAlign: 'center',

    }
}

export default SignIn
