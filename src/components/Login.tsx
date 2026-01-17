import { useState } from 'react'
import '../styles/Login.css'

interface Props {
  onLogin: (password: string) => void
}

export default function Login({ onLogin }: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      onLogin(password)
      setError('')
    } else {
      setError('Please enter a password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📅 Service Scheduler</h1>
        <p>Admin Login</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}
        <p className="hint">Ask your congregation coordinator for the password</p>
      </div>
    </div>
  )
}
