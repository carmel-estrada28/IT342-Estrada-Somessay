import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createArticle } from '../api/articleApi'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Article.css'

const CATEGORIES = ['ESSAY', 'ARTICLE', 'DIARY', 'OTHER']

export default function CreateArticle() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'ESSAY',
    status: 'PUBLISHED',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (status) => {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    if (!form.content.trim()) {
      setError('Content is required.')
      return
    }
    if (form.content.trim().length < 10) {
      setError('Content must be at least 10 characters.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await createArticle({ ...form, status })
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-page">
      <Navbar />
      <div className="create-layout">

        {/* Editor */}
        <div className="create-main">
          <input
            name="title"
            placeholder="What's your branch title?"
            value={form.title}
            onChange={handleChange}
            className="create-title-input"
            maxLength={255}
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="create-category-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label className="create-content-label">write your article</label>
          <textarea
            name="content"
            placeholder="Spill your thoughts..."
            value={form.content}
            onChange={handleChange}
            className="create-textarea"
          />

          {error && <p className="create-error">{error}</p>}
        </div>

        {/* Sidebar */}
        <div className="create-sidebar">
          <div className="create-settings-box">
            <p className="create-settings-title">settings</p>
          </div>

          <button
            className="create-publish-btn"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={loading}
          >
            {loading ? 'posting...' : 'post branch'}
          </button>

          <button
            className="create-draft-btn"
            onClick={() => handleSubmit('DRAFT')}
            disabled={loading}
          >
            save as draft
          </button>
        </div>
      </div>
    </div>
  )
}