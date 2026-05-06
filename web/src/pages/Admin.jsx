import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllUsers, deleteUser, getAllArticlesAdmin, deleteArticleAdmin } from '../api/adminApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Admin.css'

function getCurrentUserRole() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || null
  } catch { return null }
}

export default function Admin() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([])
  const [tab, setTab] = useState('users')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const role = getCurrentUserRole()

    // Redirect non-admins away
    if (role !== 'ADMIN') {
      navigate('/feed')
      return
    }

    const fetchData = async () => {
      try {
        const [usersRes, articlesRes] = await Promise.all([
          getAllUsers(),
          getAllArticlesAdmin(),
        ])
        setUsers(usersRes.data.data || [])
        setArticles(articlesRes.data.data || [])
      } catch {
        setError('Failed to load admin data. Make sure you have admin access.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return
    try {
      await deleteUser(id)
      setUsers(users.filter((u) => u.userId !== id))
    } catch {
      setError('Could not delete user.')
    }
  }

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article? This cannot be undone.')) return
    try {
      await deleteArticleAdmin(id)
      setArticles(articles.filter((a) => a.articleId !== id))
    } catch {
      setError('Could not delete article.')
    }
  }

  // New users in last 7 days
  const newUsersCount = users.filter((u) => {
    const created = new Date(u.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return created > weekAgo
  }).length

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-layout">

        <h2 className="admin-welcome">welcome to somessay, admin</h2>

        {error && <p className="admin-error">{error}</p>}

        {/* Stats row */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <p className="admin-stat-label">New Users:</p>
            <p className="admin-stat-value positive">{String(newUsersCount).padStart(2, '0')}</p>
          </div>
          <div className="admin-stat-card">
            <p className="admin-stat-label">Articles Posted:</p>
            <p className="admin-stat-value positive">{String(articles.length).padStart(2, '0')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            Users.
          </button>
          <button
            className={`admin-tab ${tab === 'articles' ? 'active' : ''}`}
            onClick={() => setTab('articles')}
          >
            Articles.
          </button>
        </div>

        {/* Users table */}
        {tab === 'users' && (
          <div className="admin-table-wrapper">
            {loading ? (
              <p className="admin-empty">loading users...</p>
            ) : users.length === 0 ? (
              <p className="admin-empty">No users found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.userId}>
                      <td>@{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-badge ${u.role?.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })
                          : '—'}
                      </td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteUser(u.userId)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Articles table */}
        {tab === 'articles' && (
          <div className="admin-table-wrapper">
            {loading ? (
              <p className="admin-empty">loading articles...</p>
            ) : articles.length === 0 ? (
              <p className="admin-empty">No articles found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.articleId}>
                      <td
                        style={{ cursor: 'pointer', color: '#D37B27' }}
                        onClick={() => navigate(`/article/${a.articleId}`)}
                      >
                        {a.title}
                      </td>
                      <td>@{a.author}</td>
                      <td>{a.category}</td>
                      <td>
                        <span className={`admin-badge ${a.status?.toLowerCase()}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            })
                          : '—'}
                      </td>
                      <td>
                        <button
                          className="admin-delete-btn"
                          onClick={() => handleDeleteArticle(a.articleId)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  )
}