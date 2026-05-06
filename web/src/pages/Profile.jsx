import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyArticles } from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Article.css'
import '../styles/Feed.css'

function getUserInfo() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return {}
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      username: payload.username || payload.sub?.split('@')[0] || '',
      email: payload.sub || '',
    }
  } catch { return {} }
}

export default function Profile() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const userInfo = getUserInfo()

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

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-layout">

        {/* Left: Articles */}
        <div className="profile-main">
          <h2 className="profile-section-title">my past seasons</h2>

          {loading && (
            <p className="feed-loading">loading your articles...</p>
          )}
          {!loading && articles.length === 0 && (
            <p className="feed-empty">
              You haven't written anything yet.{' '}
              <span
                style={{ color: '#D37B27', cursor: 'pointer' }}
                onClick={() => navigate('/create')}
              >
                Write your first branch!
              </span>
            </p>
          )}

          {articles.map((article) => (
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
          <div className="profile-card">
            <p className="profile-card-name">{userInfo.username}</p>
            <p className="profile-card-handle">@{userInfo.username}</p>
            <p className="profile-card-bio">writer on somessay.</p>
            <button className="profile-edit-btn">edit profile</button>
          </div>

          <div style={{ backgroundColor: '#909F64', borderRadius: '12px', padding: '1rem' }}>
            <button className="profile-nav-btn" onClick={() => navigate('/profile')}>
              my profile
            </button>
            <button className="profile-nav-btn" onClick={() => navigate('/activity')}>
              activity
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}