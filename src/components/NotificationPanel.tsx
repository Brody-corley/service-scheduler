import '../styles/NotificationPanel.css'

interface Props {
  notifications: string[]
}

export default function NotificationPanel({ notifications }: Props) {
  return (
    <div className="notification-panel">
      <h2>Notification History</h2>
      
      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <p>No notifications sent yet.</p>
          <p className="hint">When you send notifications from the Schedule tab, they will appear here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification, index) => (
            <div key={index} className="notification-item">
              <div className="notification-content">
                <span className="checkmark">✓</span>
                <p>{notification}</p>
              </div>
              <span className="timestamp">{new Date().toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
