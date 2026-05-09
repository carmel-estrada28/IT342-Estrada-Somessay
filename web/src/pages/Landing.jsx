import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllArticles } from '../api/articleApi'
import '../styles/Register.css'
import '../styles/Feed.css'

export default function Landing() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  // If already logged in, skip to feed
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/feed')
      return
    }

    getAllArticles()
      .then((res) => setArticles(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="feed-page">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <img src="/logo.png" alt="somessay logo" className="navbar-logo" />
          <span className="navbar-name">somessay.</span>
        </a>
        <div className="navbar-links">
          <button className="nav-btn" onClick={() => navigate('/login')}>home.</button>
          <button className="nav-btn" onClick={() => navigate('/login')}>profile.</button>
        </div>
      </nav>

      <div className="feed-layout">
        {/* Left: Public feed */}
        <div className="feed-main">
          <p style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '1.3rem',
            color: '#2c2c2c',
            marginBottom: '0.5rem'
          }}>
            welcome to somessay.
          </p>

          <p className="feed-section-label"></p>

          {loading && <p className="feed-loading">loading articles...</p>}

          {!loading && articles.length === 0 && (
            <p className="feed-empty">No articles yet. Be the first to write!</p>
          )}

          {articles.map((article) => (
            <div
              key={article.articleId}
              className="article-card"
                onClick={() => navigate(`/article/${article.articleId}`)}>
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

        {/* Right: Sidebar with register/login */}
        <div className="feed-sidebar">
          <div style={{
            backgroundColor: '#EED59F',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <p style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '1.2rem',
              color: '#2c2c2c',
              margin: '0 0 0.25rem'
            }}>
              Enter the Seasons
            </p>

            <button
              className="submit-btn"
              onClick={() => navigate('/register')}
            >
              register
            </button>

            <p style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '1.2rem',
              color: '#2c2c2c',
              margin: '0.25rem 0'
            }}>
              Back in the Fall?
            </p>

            <button
              className="submit-btn"
              style={{ backgroundColor: '#D37B27' }}
              onClick={() => navigate('/login')}
            >
              login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}