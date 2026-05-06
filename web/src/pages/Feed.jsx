import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllArticles } from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Feed.css'

function getUsername() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return ''
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.username || payload.sub?.split('@')[0] || ''
  } catch { return '' }
}

export default function Feed() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const username = getUsername()

  useEffect(() => {
    getAllArticles()
      .then((res) => setArticles(res.data.data || []))
      .catch(() => setError('Failed to load articles. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="feed-page">
      <Navbar />

      <div className="feed-layout">
        {/* Left: Main feed */}
        <div className="feed-main">
          <div className="feed-welcome-row">
            <p className="feed-welcome">welcome, {username} ·˚</p>
            <button
              className="feed-post-btn"
              onClick={() => navigate('/create')}
            >
              post a branch
            </button>
          </div>

          <p className="feed-section-label">morning fall</p>

          {loading && <p className="feed-loading">loading articles...</p>}
          {error && <p className="feed-error">{error}</p>}
          {!loading && !error && articles.length === 0 && (
            <p className="feed-empty">No articles yet. Be the first to write!</p>
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
                <p className="article-card-category">{article.category}</p>
                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-author">by {article.author?.username}</p>
                <div className="article-card-footer">
                  <span className="article-card-likes">♥ {article.likeCount || 0}</span>
                  <span className="article-card-date">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Sidebar */}
        <div className="feed-sidebar">
          <div className="sidebar-profile-card">
            <p className="sidebar-username">{username}</p>
            <button className="sidebar-link-btn" onClick={() => navigate('/profile')}>
              my profile
            </button>
            <button className="sidebar-link-btn" onClick={() => navigate('/activity')}>
              activity
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}