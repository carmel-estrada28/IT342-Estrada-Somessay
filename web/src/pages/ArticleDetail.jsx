import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    getArticleById, likeArticle, unlikeArticle,
    addComment, deleteComment, deleteArticle, updateArticle
} from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Article.css'

function getCurrentUserInfo() {
    try {
        const token = localStorage.getItem('token')
        if (!token) return {}
            const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            userId: payload.userId,
            username: payload.username || payload.sub?.split('@')[0] || '',
            profilePicUrl: localStorage.getItem('profilePicUrl') || null,
        }
    } catch { return {} }
}

export default function ArticleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [comment, setComment] = useState('')
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)
    const [error, setError] = useState('')
    const [commentError, setCommentError] = useState('')
    const currentUser = getCurrentUserInfo()
    const isLoggedIn = !!localStorage.getItem('token')

    const fetchArticle = () => {
        getArticleById(id)
        .then((res) => setArticle(res.data.data))
        .catch(() => setError('Article not found.'))
        .finally(() => setLoading(false))
    }

    useEffect(() => { fetchArticle() }, [id])

    const handleLike = async () => {
        if (!isLoggedIn) {
            navigate('/login')
        return
        }
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
        if (!isLoggedIn) {
            navigate('/login')
        return
        }
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
        if (!window.confirm('Are you sure you want to delete this article?')) return
            try {
                await deleteArticle(id)
                navigate('/profile')
            } catch {
                setError('Could not delete article.')
            }
    }

    const handlePublish = async () => {
        if (!window.confirm('Publish this article?')) return
            setPublishing(true)
        try {
            await updateArticle(id, { status: 'PUBLISHED' })
            fetchArticle()
        } catch {
            setError('Could not publish article.')
        } finally {
            setPublishing(false)
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

    const isOwner = currentUser.userId &&
        (currentUser.userId === article.author?.userId)
    const isDraft = article.status === 'DRAFT'

    return (
        <div className="read-page">
        <Navbar />
        <div className="read-layout">

            {/* Main content */}
            <div className="read-main">
            <button className="read-back-btn" onClick={() => navigate(-1)}>
                ← back
            </button>

            {/* Draft banner */}
            {isDraft && isOwner && (
                <div style={{
                    backgroundColor: '#FFF8E7',
                    border: '1px solid #D37B27',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.875rem',
                    color: '#D37B27',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <span>📝 This is a draft — only you can see it.</span>
                <button
                    onClick={handlePublish}
                    disabled={publishing}
                    style={{
                    backgroundColor: '#59643A',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.35rem 1rem',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    }}
                >
                    {publishing ? 'publishing...' : 'publish article'}
                </button>
                </div>
            )}

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
                    delete article
                </button>
                </div>
            )}

            {error && (
                <p style={{ color: '#9B4B42', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', marginTop: '1rem' }}>
                {error}
                </p>
            )}
        </div>

        {/* Sidebar; hidden for drafts */}
        {!isDraft && (
            <div className="read-sidebar">

            {/* Like button */}
            {article.allowLikes !== false && (
                <>
                <button
                    onClick={handleLike}
                    className={`read-like-btn ${liked ? 'liked' : ''}`}
                >
                     {liked ? '♥' : '♡'} {article.likeCount || 0} Likes
                </button>
                {/* Not logged in hint */}
                {!isLoggedIn && (
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: '#aaa',
                        marginTop: '-0.5rem',
                        marginBottom: '1rem',
                        textAlign: 'center',
                    }}>
                        <span
                        style={{ color: '#D37B27', cursor: 'pointer' }}
                        onClick={() => navigate('/login')}
                        >
                        log in
                        </span>
                        {' '}to like
                    </p>
                    )}
                </>
            )}

            {/* Likes disabled — owner only */}
            {article.allowLikes === false && isOwner && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                color: '#aaa',
                marginBottom: '1rem'
              }}>
                ♥ {article.likeCount || 0} Likes · likes disabled
              </p>
            )}

            {/* Comments section */}
            {article.allowComments !== false ? (
              <>
                <p className="read-comments-title">Comments</p>

                {article.comments?.length === 0 && (
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                    No comments yet.
                  </p>
                )}

                {article.comments?.map((c) => (
                  <div key={c.commentId} className="comment-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      {c.author?.profilePicUrl ? (
                        <img
                          src={c.author.profilePicUrl}
                          alt="pfp"
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#909F64',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          color: '#fff',
                          flexShrink: 0,
                        }}>
                          {c.author?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                      <span className="comment-author">{c.author?.username}</span>
                      {isLoggedIn && currentUser.userId === c.author?.userId && (
                        <button
                          className="comment-delete-btn"
                          style={{ position: 'static', marginLeft: 'auto' }}
                          onClick={() => handleDeleteComment(c.commentId)}
                          title="Delete comment"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <p style={{
                      margin: '0 0 0 32px',
                      fontSize: '0.82rem',
                      color: '#2c2c2c',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: '1.5',
                    }}>
                      {c.content}
                    </p>
                  </div>
                ))}

                {/* Comment input — logged in users only */}
                {isLoggedIn ? (
                  <div className="comment-input-row">
                    {currentUser.profilePicUrl ? (
                      <img
                        src={currentUser.profilePicUrl}
                        alt="pfp"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#909F64',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        color: '#fff',
                        flexShrink: 0,
                      }}>
                        {currentUser.username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <input
                      className="comment-input"
                      placeholder="Thoughts?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button className="comment-send-btn" onClick={handleComment}>→</button>
                  </div>
                ) : (
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                    color: '#aaa',
                    marginTop: '0.75rem',
                    textAlign: 'center',
                  }}>
                    <span
                      style={{ color: '#D37B27', cursor: 'pointer' }}
                      onClick={() => navigate('/login')}
                    >
                      log in
                    </span>
                    {' '}to leave a comment
                  </p>
                )}

                {commentError && (
                  <p style={{ color: '#9B4B42', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', marginTop: '0.5rem' }}>
                    {commentError}
                  </p>
                )}
              </>
            ) : (
              isOwner && (
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  color: '#aaa',
                  marginTop: '0.5rem'
                }}>
                  comments are disabled for this article.
                </p>
              )
            )}

          </div>
        )}
      </div>
    </div>
  )
}