import { useState } from 'react'
import '../styles/Login.css'

interface Props {
  onAdminLogin: (password: string) => void
  onMemberLogin: () => void
}

export default function Login({ onAdminLogin, onMemberLogin }: Props) {
  const [view, setView] = useState<'choice' | 'admin' | 'member'>('choice')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminPassword) {
      onAdminLogin(adminPassword)
      setAdminError('')
    } else {
      setAdminError('Please enter a password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>📅 Service Scheduler</h1>

        {view === 'choice' && (
          <>
            <p>Select Login Type</p>
            <div className="login-options">
              <button
                className="option-btn admin-btn"
                onClick={() => setView('admin')}
              >
                🔐 Admin Login
              </button>
              <button
                className="option-btn member-btn"
                onClick={() => {
                  setView('member')
                  onMemberLogin()
                }}
              >
                👥 Member Login/Signup
              </button>
            </div>
            <p className="hint">Ask your congregation coordinator for the admin password</p>
          </>
        )}

        {view === 'admin' && (
          <>
            <p>Admin Login</p>
            <form onSubmit={handleAdminSubmit} className="login-form">
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                autoFocus
              />
              <button type="submit">Login</button>
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setView('choice')
                  setAdminPassword('')
                  setAdminError('')
                }}
              >
                ← Back
              </button>
            </form>
            {adminError && <p className="error">{adminError}</p>}
          </>
        )}
      </div>
    </div>
  )
}
