import { useState, useEffect } from 'react'
import './App.css'
import Login from './components/Login'
import MemberAuth from './components/MemberAuth'
import MemberDashboard from './components/MemberDashboard'
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

type UserRole = 'admin' | 'member' | null

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [showMemberAuth, setShowMemberAuth] = useState(false)
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null)
  const [currentMemberName, setCurrentMemberName] = useState<string | null>(null)

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
    const currentUser = localStorage.getItem('currentUser')

    if (savedMembers) setMembers(JSON.parse(savedMembers))
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments))
    
    // Check if user was already logged in
    if (currentUser) {
      const user = JSON.parse(currentUser)
      setUserRole('member')
      setCurrentMemberId(user.id)
      setCurrentMemberName(user.name)
    }

    const wasAdminLoggedIn = localStorage.getItem('isAdminLoggedIn')
    if (wasAdminLoggedIn) {
      setUserRole('admin')
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members))
  }, [members])

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments))
  }, [assignments])

  // Handle admin login
  const handleAdminLogin = (password: string) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
    if (password === adminPassword) {
      setUserRole('admin')
      localStorage.setItem('isAdminLoggedIn', 'true')
    } else {
      alert('Invalid password')
    }
  }

  // Handle member login
  const handleMemberLogin = (userId: string, name: string) => {
    setUserRole('member')
    setCurrentMemberId(userId)
    setCurrentMemberName(name)
    setShowMemberAuth(false)
  }

  // Logout
  const handleLogout = () => {
    setUserRole(null)
    setShowMemberAuth(false)
    setCurrentMemberId(null)
    setCurrentMemberName(null)
    localStorage.removeItem('isAdminLoggedIn')
    localStorage.removeItem('currentUser')
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
        const newNotification = `📧 Email sent to ${member.name} (${member.email}) for ${date}`
        setNotifications(prev => [newNotification, ...prev])
        setAssignments(assignments.map(a =>
          a.date === date && a.memberId === assignment.memberId ? { ...a, notified: true } : a
        ))
      }
    })
  }

  // Show login screen
  if (!userRole) {
    if (showMemberAuth) {
      return (
        <MemberAuth
          onBack={() => setShowMemberAuth(false)}
          onLoginSuccess={handleMemberLogin}
        />
      )
    }
    return <Login onAdminLogin={handleAdminLogin} onMemberLogin={() => setShowMemberAuth(true)} />
  }

  // Show member dashboard
  if (userRole === 'member' && currentMemberId) {
    return (
      <MemberDashboard
        userId={currentMemberId}
        userName={currentMemberName || 'Member'}
        assignments={assignments}
        onLogout={handleLogout}
      />
    )
  }

  // Show admin dashboard
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>📅 Service Scheduler</h1>
            <p>Admin Dashboard - Schedule members for Saturday service meetings</p>
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
