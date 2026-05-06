import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getArticleById, likeArticle, unlikeArticle,
  addComment, deleteComment, deleteArticle
} from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Article.css'

function getCurrentUserId() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId || payload.sub
  } catch { return null }
}

export default function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentError, setCommentError] = useState('')
  const currentUserId = getCurrentUserId()

  const fetchArticle = () => {
    getArticleById(id)
      .then((res) => setArticle(res.data.data))
      .catch(() => setError('Article not found.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchArticle() }, [id])

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeArticle(id)
        setLiked(false)
        setArticle((a) => ({ ...a, likeCount: (a.likeCount || 1) - 1 }))
      } else {
        await likeArticle(id)
        setLiked(true)
        setArticle((a) => ({ ...a, likeCount: (a.likeCount || 0) + 1 }))
      }
    } catch {
      setError('Could not update like.')
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty.')
      return
    }
    setCommentError('')
    try {
      await addComment(id, comment)
      setComment('')
      fetchArticle()
    } catch {
      setCommentError('Could not post comment.')
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      fetchArticle()
    } catch {
      setError('Could not delete comment.')
    }
  }

  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return
    try {
      await deleteArticle(id)
      navigate('/feed')
    } catch {
      setError('Could not delete article.')
    }
  }

  if (loading) return (
    <div className="read-page">
      <Navbar />
      <p style={{ textAlign: 'center', marginTop: '3rem', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
        loading...
      </p>
    </div>
  )

  if (error && !article) return (
    <div className="read-page">
      <Navbar />
      <p style={{ textAlign: 'center', marginTop: '3rem', color: '#9B4B42', fontFamily: 'Inter, sans-serif' }}>
        {error}
      </p>
    </div>
  )

  if (!article) return null

  const isOwner = currentUserId &&
    (currentUserId === article.author?.userId ||
     currentUserId === article.author?.email)

  return (
    <div className="read-page">
      <Navbar />
      <div className="read-layout">

        {/* Main content */}
        <div className="read-main">
          <button className="read-back-btn" onClick={() => navigate('/feed')}>
            ← back to home
          </button>

          {article.coverUrl && (
            <img src={article.coverUrl} alt="cover" className="read-cover" />
          )}

          <h1 className="read-title">{article.title}</h1>
          <p className="read-meta">
            by {article.author?.username} · {article.category} ·{' '}
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })
              : ''}
          </p>

          <div className="read-body">{article.content}</div>

          {isOwner && (
            <div className="read-owner-actions">
              <button className="read-delete-btn" onClick={handleDeleteArticle}>
                delete branch
              </button>
            </div>
          )}

          {error && (
            <p style={{ color: '#9B4B42', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', marginTop: '1rem' }}>
              {error}
            </p>
          )}
        </div>

        {/* Sidebar */}
        <div className="read-sidebar">
          <button
            onClick={handleLike}
            className={`read-like-btn ${liked ? 'liked' : ''}`}
          >
            ♥ {article.likeCount || 0} Likes
          </button>

          <p className="read-comments-title">Comments</p>

          {article.comments?.length === 0 && (
            <p style={{ color: '#6b7280', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
              No comments yet.
            </p>
          )}

          {article.comments?.map((c) => (
            <div key={c.commentId} className="comment-item">
              <span className="comment-author">{c.author?.username}</span>
              <span className="comment-content">{c.content}</span>
              {(currentUserId === c.author?.userId ||
                currentUserId === c.author?.email) && (
                <button
                  className="comment-delete-btn"
                  onClick={() => handleDeleteComment(c.commentId)}
                  title="Delete comment"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <div className="comment-input-row">
            <input
              className="comment-input"
              placeholder="Thoughts?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            />
            <button className="comment-send-btn" onClick={handleComment}>→</button>
          </div>

          {commentError && (
            <p style={{ color: '#9B4B42', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', marginTop: '0.5rem' }}>
              {commentError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}