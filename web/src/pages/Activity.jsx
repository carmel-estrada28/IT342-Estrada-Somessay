import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Activity.css'

function getUserInfo() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return {}
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      username: payload.username || payload.sub?.split('@')[0] || '',
    }
  } catch { return {} }
}

function groupByDate(items) {
  const groups = {}
  items.forEach((item) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(item)
  })
  return groups
}

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function Activity() {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const userInfo = getUserInfo()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    // We'll use a mock for now until backend endpoint is ready
    // Replace this with: getMyActivity(userInfo.userId) when backend is done
    setTimeout(() => {
      setActivities([])
      setLoading(false)
    }, 500)
  }, [])

  const grouped = groupByDate(activities)

  return (
    <div className="activity-page">
      <Navbar />
      <div className="activity-layout">

        {/* Main: Activity feed */}
        <div className="activity-main">
          <h2 className="activity-title">
            {userInfo.username ? `·. ${userInfo.username} ·˚'s activity` : 'your activity'}
          </h2>

          {loading && <p className="activity-loading">loading activity...</p>}

          {!loading && activities.length === 0 && (
            <div className="activity-empty">
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌿</p>
              <p>No activity yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                When someone likes your branch, it'll show up here.
              </p>
            </div>
          )}

          {!loading && Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="activity-date-label">{date}</p>
              {items.map((item, index) => (
                <div key={index} className="activity-item">
                  {/* Avatar */}
                  <div className="activity-avatar-placeholder">
                    {item.fromUsername?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Text */}
                  <div className="activity-text">
                    <span className="activity-username">
                      @{item.fromUsername}
                    </span>{' '}
                    <span className="activity-action">
                      has liked your branch
                    </span>{' '}
                    {item.articleTitle && (
                      <span
                        className="activity-article"
                        onClick={() => navigate(`/article/${item.articleId}`)}
                      >
                        "{item.articleTitle}"
                      </span>
                    )}
                  </div>

                  {/* Time */}
                  <span className="activity-time">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right: Sidebar */}
        <div className="feed-sidebar">
          <div className="sidebar-profile-card">
            <p className="sidebar-username">{userInfo.username}</p>
            <button
              className="sidebar-link-btn"
              onClick={() => navigate('/profile')}
            >
              my profile
            </button>
            <button
              className="sidebar-link-btn"
              style={{ fontWeight: 'bold', textDecoration: 'underline' }}
              onClick={() => navigate('/activity')}
            >
              activity
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}