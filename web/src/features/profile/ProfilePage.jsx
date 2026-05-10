import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './profile.css'
import '../../shared/styles/global.css'
import '../../shared/styles/articleCard.css'
import Navbar from '../../shared/components/Navbar'
import { getMyArticles } from '../../shared/api/articleApi'


function getUserInfo() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return {}
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      username: localStorage.getItem('displayUsername') || payload.username || payload.sub?.split('@')[0] || '',
      email: payload.sub || '',
      profilePicUrl: payload.profilePicUrl || null,
    }
  } catch { return {} }
}

const FILTERS = ['ALL', 'ESSAY', 'ARTICLE', 'DIARY', 'OTHER', 'DRAFT']

export default function Profile() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const userInfo = getUserInfo()

  const storedPic = localStorage.getItem('profilePicUrl')
  const storedBio = localStorage.getItem('bio')
  const profilePic = storedPic || userInfo.profilePicUrl
  const bio = storedBio || 'writer on somessay.'

  useEffect(() => {
    if (userInfo.userId) {
      getMyArticles(userInfo.userId)
        .then((res) => setArticles(res.data.data || []))
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Filter articles based on active filter
  const filteredArticles = articles.filter((article) => {
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'DRAFT') return article.status === 'DRAFT'
    return article.category === activeFilter && article.status !== 'DRAFT'
  })

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-layout">

        {/* Left: Articles */}
        <div className="profile-main">
          <h2 className="profile-section-title">my past seasons</h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.25rem',
          }}>
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '0.3rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  borderColor: activeFilter === filter ? '#59643A' : '#d1d5db',
                  backgroundColor: activeFilter === filter ? '#59643A' : '#fff',
                  color: activeFilter === filter ? '#fff' : '#6b7280',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {filter.toLowerCase()}
              </button>
            ))}
          </div>

          {loading && <p className="feed-loading">loading your articles...</p>}

          {!loading && filteredArticles.length === 0 && (
            <p className="feed-empty">
              {activeFilter === 'ALL'
                ? <>You haven't written anything yet.{' '}
                    <span style={{ color: '#D37B27', cursor: 'pointer' }} onClick={() => navigate('/create')}>
                      Write your first article!
                    </span>
                  </>
                : `No ${activeFilter.toLowerCase()} articles yet.`
              }
            </p>
          )}

          {filteredArticles.map((article) => (
            <div
              key={article.articleId}
              className="article-card"
              onClick={() => navigate(`/article/${article.articleId}`)}
            >
              {article.coverUrl && (
                <img
                  src={article.coverUrl}
                  alt="cover"
                  className="article-card-cover"
                />
              )}
              <div className="article-card-body">
                <p className="article-card-category">
                  {article.category}
                  {article.status === 'DRAFT' && (
                    <span style={{
                      marginLeft: '8px', backgroundColor: '#D9D9D9',
                      color: '#6b7280', borderRadius: '4px',
                      padding: '1px 6px', fontSize: '0.65rem'
                    }}>
                      DRAFT
                    </span>
                  )}
                </p>
                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-author">by {userInfo.username}</p>
                <div className="article-card-footer">
                  <span className="article-card-likes">♥ {article.likeCount || 0}</span>
                  <span className="article-card-date">
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Sidebar */}
        <div className="profile-sidebar">

          {/* Profile card */}
          <div className="profile-card">
            {profilePic ? (
              <div className="profile-avatar-wrapper">
                <img src={profilePic} alt="profile" className="profile-avatar" />
              </div>
            ) : (
              <div className="profile-avatar-placeholder">
                {userInfo.username?.[0]?.toUpperCase() || '?'}
              </div>
            )}

            <p className="profile-card-name">{userInfo.username}</p>
            <p className="profile-card-handle">@{userInfo.username}</p>
            <p className="profile-card-bio">{bio}</p>
            <button
              className="profile-edit-btn"
              onClick={() => navigate('/edit-profile')}
            >
              edit profile
            </button>
          </div>

          {/* Nav card */}
          <div className="profile-nav-card">
            <button className="profile-nav-btn" onClick={() => navigate('/profile')}>
              my profile
            </button>
            <button className="profile-nav-btn" onClick={() => navigate('/activity')}>
              activity
            </button>
            <hr className="profile-nav-divider" />
            <button
              className="profile-logout-btn"
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('profilePicUrl')
                localStorage.removeItem('bio')
                localStorage.removeItem('displayUsername')
                navigate('/login')
              }}
            >
              logout
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}