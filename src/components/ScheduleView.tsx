import { useState } from 'react'
import '../styles/ScheduleView.css'

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
  members: Member[]
  assignments: Assignment[]
  onAssign: (date: string, memberId: string) => void
  onRemoveAssignment: (date: string, memberId: string) => void
  onNotify: (date: string) => void
}

export default function ScheduleView({
  members,
  assignments,
  onAssign,
  onRemoveAssignment,
  onNotify,
}: Props) {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('')

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

  const getAssignedMembers = (date: string) => {
    return assignments
      .filter(a => a.date === date)
      .map(a => members.find(m => m.id === a.memberId))
      .filter(Boolean) as Member[]
  }

  const handleAssign = (date: string) => {
    if (selectedMemberId) {
      onAssign(date, selectedMemberId)
      setSelectedMemberId('')
    }
  }

  return (
    <div className="schedule-view">
      <div className="schedule-controls">
        <div className="control-group">
          <label>Select Member:</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">-- Choose a member --</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="saturdays-grid">
        {saturdays.map(saturday => {
          const assignedMembers = getAssignedMembers(saturday.dateStr)
          const hasUnnotified = assignments.some(
            a => a.date === saturday.dateStr && !a.notified && assignedMembers.some(m => m.id === a.memberId)
          )

          return (
            <div key={saturday.dateStr} className="saturday-card">
              <div className="card-header">
                <h3>{saturday.displayDate}</h3>
                {hasUnnotified && <span className="badge-pending">Pending Notifications</span>}
              </div>

              <div className="assigned-members">
                <h4>Assigned ({assignedMembers.length}):</h4>
                {assignedMembers.length > 0 ? (
                  <ul>
                    {assignedMembers.map(member => (
                      <li key={member.id}>
                        <span>{member.name}</span>
                        <button
                          className="btn-remove"
                          onClick={() => onRemoveAssignment(saturday.dateStr, member.id)}
                          title="Remove assignment"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty">No assignments yet</p>
                )}
              </div>

              <div className="card-actions">
                {selectedMemberId && (
                  <button
                    className="btn-assign"
                    onClick={() => handleAssign(saturday.dateStr)}
                  >
                    Assign Selected
                  </button>
                )}
                {assignedMembers.length > 0 && hasUnnotified && (
                  <button
                    className="btn-notify"
                    onClick={() => onNotify(saturday.dateStr)}
                  >
                    Send Notifications
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
