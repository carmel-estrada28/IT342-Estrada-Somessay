import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../styles/Register.css'
import '../styles/Profile.css'
import axiosClient from '../api/axiosClient'

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

export default function EditProfile() {
  const navigate = useNavigate()
  const userInfo = getUserInfo()

  const [username, setUsername] = useState(localStorage.getItem('displayUsername') || userInfo.username || '')
  const [bio, setBio] = useState(localStorage.getItem('bio') || '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(
    localStorage.getItem('profilePicUrl') || null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAvatarChange = (e) => {
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
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setError('')
  }

  const handleSave = async () => {
    if (!username.trim()) {
      setError('Username is required.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let profilePicUrl = localStorage.getItem('profilePicUrl') || null

      // Upload new avatar to Cloudinary if selected
      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        formData.append('upload_preset', 'somessay_uploads')
        formData.append('cloud_name', 'dolue6cdw')

        const cloudRes = await fetch(
          'https://api.cloudinary.com/v1_1/dolue6cdw/image/upload',
          { method: 'POST', body: formData }
        )
        const cloudData = await cloudRes.json()
        profilePicUrl = cloudData.secure_url
      }

      // ✅ Call backend PUT /users/{id}
      await axiosClient.put(`/users/${userInfo.userId}`, {
        username,
        bio,
        profilePicUrl,
      })

      // Save to localStorage so other pages update immediately
      localStorage.setItem('displayUsername', username)
      if (bio) localStorage.setItem('bio', bio)
      if (profilePicUrl) localStorage.setItem('profilePicUrl', profilePicUrl)

      setSuccess('Profile updated successfully!')
      setTimeout(() => navigate('/profile'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-profile-page">
      <Navbar />
      <div className="edit-profile-layout">
        <div className="edit-profile-card">
          <h2 className="edit-profile-title">edit profile</h2>

          {/* Avatar upload */}
          <div className="edit-avatar-wrapper">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar preview"
                className="edit-avatar-img"
              />
            ) : (
              <div className="edit-avatar-placeholder">
                {username?.[0]?.toUpperCase() || '?'}
              </div>
            )}

            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <span className="edit-avatar-upload-btn">
                {avatarPreview ? 'change photo' : 'upload photo'}
              </span>
            </label>
          </div>

          {/* Form */}
          <div className="edit-profile-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="edit-profile-input"
                placeholder="Enter your username"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="edit-profile-textarea"
                placeholder="Tell us about yourself..."
                maxLength={255}
              />
            </div>

            {error && <p className="edit-profile-error">{error}</p>}
            {success && <p className="edit-profile-success">{success}</p>}

            <button
              className="edit-profile-save-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'saving...' : 'save changes'}
            </button>

            <button
              className="edit-profile-cancel-btn"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}