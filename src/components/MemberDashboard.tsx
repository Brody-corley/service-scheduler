import '../styles/MemberDashboard.css'

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

interface Props {
  userId: string
  userName: string
  members: Member[]
  assignments: Assignment[]
  onLogout: () => void
}

export default function MemberDashboard({
  userId,
  userName,
  members,
  assignments,
  onLogout,
}: Props) {
  // Get only this member's assignments
  const myAssignments = assignments.filter(a => a.memberId === userId)

  // Get next 8 Saturdays
  const getSaturdays = () => {
    const saturdays = []
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
    let nextSaturday = new Date(today)
    nextSaturday.setDate(today.getDate() + daysUntilSaturday)

    for (let i = 0; i < 8; i++) {
      const dateStr = nextSaturday.toISOString().split('T')[0]
      saturdays.push({
        dateStr,
        displayDate: nextSaturday.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      })
      nextSaturday.setDate(nextSaturday.getDate() + 7)
    }

    return saturdays
  }

  const saturdays = getSaturdays()

  return (
    <div className="member-dashboard-container">
      <header className="member-dashboard-header">
        <div className="header-content">
          <div>
            <h1>👥 Welcome, {userName}!</h1>
            <p>Your Saturday Service Assignments</p>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="member-dashboard-main">
        <div className="assignments-section">
          {myAssignments.length === 0 ? (
            <div className="no-assignments">
              <p>📅 You don't have any assignments scheduled yet.</p>
              <p className="hint">Check back later for your Saturday service assignments!</p>
            </div>
          ) : (
            <div className="assignments-grid">
              {saturdays.map(saturday => {
                const isAssigned = myAssignments.some(a => a.date === saturday.dateStr)
                const assignment = myAssignments.find(a => a.date === saturday.dateStr)

                return (
                  <div
                    key={saturday.dateStr}
                    className={`assignment-card ${isAssigned ? 'assigned' : 'not-assigned'}`}
                  >
                    <h3>{saturday.displayDate}</h3>
                    {isAssigned ? (
                      <>
                        <div className="assignment-status">
                          <span className="badge-assigned">✓ Assigned</span>
                          {assignment?.notified && (
                            <span className="badge-notified">📧 Notified</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="unassigned">Not scheduled</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="info-section">
          <h2>Your Information</h2>
          <div className="info-box">
            <p><strong>Name:</strong> {userName}</p>
          </div>
          <p className="note">Contact your coordinator if you have any questions about your assignments.</p>
        </div>
      </main>
    </div>
  )
}
