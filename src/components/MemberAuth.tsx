import { useState } from 'react'
import '../styles/MemberAuth.css'

interface Props {
  onBack: () => void
  onLoginSuccess: (userId: string, name: string) => void
}

export default function MemberAuth({ onBack, onLoginSuccess }: Props) {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password || !name) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      // Store user data in localStorage (for demo)
      const users = JSON.parse(localStorage.getItem('members_auth') || '{}')
      
      if (users[email]) {
        setError('Email already registered')
        setLoading(false)
        return
      }

      users[email] = { password, name, id: Date.now().toString() }
      localStorage.setItem('members_auth', JSON.stringify(users))
      
      // Auto-login after signup
      localStorage.setItem('currentUser', JSON.stringify({ email, name, id: users[email].id }))
      onLoginSuccess(users[email].id, name)
    } catch (err) {
      setError('Signup failed. Please try again.')
    }

    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !password) {
        setError('Please enter email and password')
        setLoading(false)
        return
      }

      const users = JSON.parse(localStorage.getItem('members_auth') || '{}')
      
      if (!users[email] || users[email].password !== password) {
        setError('Invalid email or password')
        setLoading(false)
        return
      }

      localStorage.setItem('currentUser', JSON.stringify({ 
        email, 
        name: users[email].name, 
        id: users[email].id 
      }))
      onLoginSuccess(users[email].id, users[email].name)
    } catch (err) {
      setError('Login failed. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📅 Service Scheduler</h1>
        <p>{isSignup ? 'Create Account' : 'Member Login'}</p>

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="login-form">
          {isSignup && (
            <input
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="auth-toggle">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup)
                setError('')
                setEmail('')
                setPassword('')
                setName('')
              }}
              className="toggle-link"
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>

        <button type="button" className="back-btn" onClick={onBack} style={{ display: 'none' }}>
          ← Back
        </button>
      </div>
    </div>
  )
}
