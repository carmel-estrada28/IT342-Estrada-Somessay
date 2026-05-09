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
    } catch { 
        return null 
    }
}

const CATEGORIES = ['ALL', 'ESSAY', 'ARTICLE', 'DIARY', 'OTHER']
const STATUSES = ['ALL', 'PUBLISHED', 'DRAFT']

export default function Admin() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [articles, setArticles] = useState([])
    const [tab, setTab] = useState('users')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        const role = getCurrentUserRole()
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

    const newUsersCount = users.filter((u) => {
        const created = new Date(u.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return created > weekAgo
    }).length

  // Filters
    const filteredArticles = articles.filter((a) => {
        const matchCategory = categoryFilter === 'ALL' || a.category === categoryFilter
        const matchStatus = statusFilter === 'ALL' || a.status === statusFilter
        return matchCategory && matchStatus
    })

    const filterBtnStyle = (active) => ({
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        border: '1px solid',
        borderColor: active ? '#59643A' : '#d1d5db',
        backgroundColor: active ? '#59643A' : '#fff',
        color: active ? '#fff' : '#6b7280',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.75rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    })

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
            <>
                {/* Filters */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#6b7280', marginRight: '0.25rem' }}>
                    category:
                    </span>
                    {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        style={filterBtnStyle(categoryFilter === cat)}
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat.toLowerCase()}
                    </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#6b7280', marginRight: '0.25rem' }}>
                    status:
                    </span>
                    {STATUSES.map((status) => (
                    <button
                        key={status}
                        style={filterBtnStyle(statusFilter === status)}
                        onClick={() => setStatusFilter(status)}
                    >
                        {status.toLowerCase()}
                    </button>
                    ))}
                </div>
            </div>

            <div className="admin-table-wrapper">
                {loading ? (
                    <p className="admin-empty">loading articles...</p>
                ) : filteredArticles.length === 0 ? (
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
                        {filteredArticles.map((a) => (
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
            </>
            )}

        </div>
        </div>
  )
}