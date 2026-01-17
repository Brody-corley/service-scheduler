import { useState } from 'react'
import '../styles/MemberList.css'

interface Member {
  id: string
  name: string
  email: string
  phone?: string
}

interface Props {
  members: Member[]
  onAddMember: (name: string, email: string, phone?: string) => void
  onRemoveMember: (id: string) => void
}

export default function MemberList({ members, onAddMember, onRemoveMember }: Props) {
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      onAddMember(formData.name, formData.email, formData.phone || undefined)
      setFormData({ name: '', email: '', phone: '' })
      setFormVisible(false)
    }
  }

  return (
    <div className="member-list">
      <div className="member-header">
        <h2>Members</h2>
        <button
          className="btn-primary"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? '✕ Cancel' : '+ Add Member'}
        </button>
      </div>

      {formVisible && (
        <form className="member-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <button type="submit" className="btn-primary">
            Add Member
          </button>
        </form>
      )}

      <div className="members-container">
        {members.length === 0 ? (
          <p className="empty-state">No members added yet. Add your first member to get started!</p>
        ) : (
          <ul className="members-list">
            {members.map(member => (
              <li key={member.id} className="member-item">
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="email">📧 {member.email}</p>
                  {member.phone && <p className="phone">📱 {member.phone}</p>}
                </div>
                <button
                  className="btn-delete"
                  onClick={() => onRemoveMember(member.id)}
                  title="Delete member"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
