import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllArticles, getRandomQuote, searchArticles } from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Feed.css'
import '../styles/ArticleCard.css'

function getUserInfo() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return { username: '', profilePicUrl: null }
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      username: localStorage.getItem('displayUsername')
        || payload.username
        || payload.sub?.split('@')[0]
        || '',
      profilePicUrl: localStorage.getItem('profilePicUrl') || null,
    }
  } catch { return { username: '', profilePicUrl: null } }
}

export default function Feed() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quote, setQuote] = useState(null)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const { username, profilePicUrl } = getUserInfo()

  useEffect(() => {
    getAllArticles()
      .then((res) => setArticles(res.data.data || []))
      .catch(() => setError('Failed to load articles. Please try again.'))
      .finally(() => setLoading(false))

    getRandomQuote()
      .then((res) => setQuote(res.data.data))
      .catch(() => {})
  }, [])

  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    setLoading(true)
    setError('')
    try {
      const res = await searchArticles(search)
      setArticles(res.data.data || [])
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearch('')
    setSearching(false)
    setLoading(true)
    getAllArticles()
      .then((res) => setArticles(res.data.data || []))
      .catch(() => setError('Failed to load articles.'))
      .finally(() => setLoading(false))
  }

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

          {/* Search bar */}
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="search branches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                outline: 'none',
                background: '#fff',
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                backgroundColor: '#59643A',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.5rem 1rem',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              search
            </button>
            {searching && (
              <button
                onClick={handleClearSearch}
                style={{
                  backgroundColor: '#D9D9D9',
                  color: '#2c2c2c',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                clear
              </button>
            )}
          </div>

          <p className="feed-section-label"></p>

          {loading && <p className="feed-loading">loading articles...</p>}
          {error && <p className="feed-error">{error}</p>}
          {!loading && !error && articles.length === 0 && (
            <p className="feed-empty">
              {searching ? 'No articles found.' : 'No articles yet. Be the first to write!'}
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

          {/* Profile card */}
          <div className="sidebar-profile-card">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt="profile"
                style={{
                  width: '65px',
                  height: '65px',
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
                {username?.[0]?.toUpperCase() || '?'}
              </div>
            )}

            <p className="sidebar-username">{username}</p>
            <hr className="profile-nav-divider" />
            <button className="sidebar-link-btn" onClick={() => navigate('/profile')}>
              my profile
            </button>
            <button className="sidebar-link-btn" onClick={() => navigate('/activity')}>
              activity
            </button>
          </div>

          {/* Quote card */}
          {quote && (
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #f0ead8',
              borderRadius: '12px',
              padding: '1rem',
              marginTop: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <p style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '0.85rem',
                color: '#5C3D1E',
                lineHeight: '1.6',
                margin: '0 0 0.5rem',
                fontStyle: 'italic',
              }}>
                "{quote.content}"
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                color: '#909F64',
                margin: 0,
                textAlign: 'right',
              }}>
                — {quote.author}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}