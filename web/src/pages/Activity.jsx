import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyActivity } from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Activity.css'
import '../styles/Feed.css'

function getUserInfo() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return {}
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      username: localStorage.getItem('displayUsername') || payload.username || payload.sub?.split('@')[0] || '',
      profilePicUrl: localStorage.getItem('profilePicUrl') || null,
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
  const [error, setError] = useState('')
  const userInfo = getUserInfo()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    if (userInfo.userId) {
      getMyActivity(userInfo.userId)
        .then((res) => setActivities(res.data.data || []))
        .catch(() => setError('Failed to load activity.'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
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
          {error && <p style={{ color: '#9B4B42', fontFamily: 'Inter, sans-serif' }}>{error}</p>}

          {!loading && !error && activities.length === 0 && (
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

                  {/* ✅ Profile picture */}
                  {item.fromProfilePicUrl ? (
                    <img
                      src={item.fromProfilePicUrl}
                      alt={item.fromUsername}
                      className="activity-avatar"
                    />
                  ) : (
                    <div className="activity-avatar-placeholder">
                      {item.fromUsername?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}

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

            {/* ✅ Current user pfp in sidebar */}
            {userInfo.profilePicUrl ? (
              <img
                src={userInfo.profilePicUrl}
                alt="profile"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #EED59F',
                  display: 'block',
                  margin: '0 auto 0.75rem',
                }}
              />
            ) : (
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#EED59F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontSize: '1.25rem',
                fontFamily: "'Instrument Serif', serif",
                color: '#5C3D1E',
              }}>
                {userInfo.username?.[0]?.toUpperCase() || '?'}
              </div>
            )}

            <p className="sidebar-username">{userInfo.username}</p>
            <hr className="profile-nav-divider" />
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