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
    allowLikes: true,
    allowComments: true,
  })
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleToggle = (field) =>
    setForm({ ...form, [field]: !form[field] })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB.')
      return
    }
    setCoverImage(file)
    setCoverPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleRemoveImage = () => {
    setCoverImage(null)
    setCoverPreview(null)
  }

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
      let coverUrl = null

      if (coverImage) {
        const cloudinaryData = new FormData()
        cloudinaryData.append('file', coverImage)
        cloudinaryData.append('upload_preset', 'somessay_uploads')
        cloudinaryData.append('cloud_name', 'dolue6cdw')

        const cloudRes = await fetch(
          'https://api.cloudinary.com/v1_1/dolue6cdw/image/upload',
          { method: 'POST', body: cloudinaryData }
        )
        const cloudData = await cloudRes.json()
        coverUrl = cloudData.secure_url
      }

      await createArticle({ ...form, status, coverUrl })
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
            placeholder="What's your article title?"
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

          <label className="create-content-label" style={{ marginTop: '0.5rem' }}>
            cover image <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span>
          </label>

          {!coverPreview ? (
            <label className="create-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <span className="create-upload-icon">+</span>
              <span className="create-upload-text">click here or drag a photo here</span>
            </label>
          ) : (
            <div className="create-preview-wrapper">
              <img
                src={coverPreview}
                alt="cover preview"
                className="create-preview-img"
              />
              <button
                className="create-remove-img-btn"
                onClick={handleRemoveImage}
                type="button"
              >
                remove
              </button>
            </div>
          )}

          <label className="create-content-label" style={{ marginTop: '1rem' }}>
            write your article
          </label>
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

            {/* Allow likes toggle */}
            <div className="create-toggle-row">
              <span className="create-toggle-label">allow likes?</span>
              <div
                className={`create-toggle ${form.allowLikes ? 'on' : 'off'}`}
                onClick={() => handleToggle('allowLikes')}
              >
                <div className="create-toggle-knob" />
              </div>
            </div>

            {/* Allow comments toggle */}
            <div className="create-toggle-row">
              <span className="create-toggle-label">allow comments?</span>
              <div
                className={`create-toggle ${form.allowComments ? 'on' : 'off'}`}
                onClick={() => handleToggle('allowComments')}
              >
                <div className="create-toggle-knob" />
              </div>
            </div>
          </div>

          <button
            className="create-publish-btn"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={loading}
          >
            {loading ? 'posting...' : 'post article'}
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