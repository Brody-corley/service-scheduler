import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import MemberList from './components/MemberList'
import ScheduleView from './components/ScheduleView'
import NotificationPanel from './components/NotificationPanel'

interface Member {
  id: string
  name: string
  email: string
  phone?: string
}

interface Assignment {
  date: string
  memberId: string
  notified: boolean
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-1234' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-5678' },
  ])

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [activeTab, setActiveTab] = useState<'schedule' | 'members' | 'notifications'>('schedule')
  const [notifications, setNotifications] = useState<string[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMembers = localStorage.getItem('members')
    const savedAssignments = localStorage.getItem('assignments')
    
    if (savedMembers) setMembers(JSON.parse(savedMembers))
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments))
  }, [assignments])

  // Handle login
  const handleLogin = (password: string) => {
    // Simple password check (in production, use proper authentication)
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setIsLoggedIn(true)
      localStorage.setItem('isLoggedIn', 'true')
    } else {
      alert('Invalid password')
    }
  }

  // Check if already logged in
  useEffect(() => {
    const wasLoggedIn = localStorage.getItem('isLoggedIn')
    if (wasLoggedIn) {
      setIsLoggedIn(true)
    }
  }, [])

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
  }

  // Add new member
  const addMember = (name: string, email: string, phone?: string) => {
    const newMember: Member = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    }
    setMembers([...members, newMember])
  }

  // Remove member
  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id))
    setAssignments(assignments.filter(a => a.memberId !== id))
  }

  // Assign member to date
  const assignMember = (date: string, memberId: string) => {
    const existingAssignment = assignments.find(a => a.date === date && a.memberId === memberId)
    if (!existingAssignment) {
      setAssignments([...assignments, { date, memberId, notified: false }])
    }
  }

  // Remove assignment
  const removeAssignment = (date: string, memberId: string) => {
    setAssignments(assignments.filter(a => !(a.date === date && a.memberId === memberId)))
  }

  // Send notifications (simulated)
  const sendNotifications = (date: string) => {
    const dateAssignments = assignments.filter(a => a.date === date && !a.notified)
    dateAssignments.forEach(assignment => {
      const member = members.find(m => m.id === assignment.memberId)
      if (member) {
        // In production, call backend API to send real email
        const newNotification = `📧 Email sent to ${member.name} (${member.email}) for ${date}`
        setNotifications(prev => [newNotification, ...prev])
        setAssignments(assignments.map(a =>
          a.date === date && a.memberId === assignment.memberId ? { ...a, notified: true } : a
        ))
      }
    })
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>📅 Service Scheduler</h1>
            <p>Schedule members for Saturday service meetings</p>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button
          className={`nav-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'schedule' && (
          <ScheduleView
            members={members}
            assignments={assignments}
            onAssign={assignMember}
            onRemoveAssignment={removeAssignment}
            onNotify={sendNotifications}
          />
        )}
        {activeTab === 'members' && (
          <MemberList
            members={members}
            onAddMember={addMember}
            onRemoveMember={removeMember}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationPanel notifications={notifications} />
        )}
      </main>
    </div>
  )
}

export default App
