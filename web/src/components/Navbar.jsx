import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="navbar">
        <a href="/feed" className="navbar-brand">
            <img src="/logo.png" alt="somessay logo" className="navbar-logo" />
            <span className="navbar-name">somessay.</span>
        </a>
        <div className="navbar-links">
            <button className="nav-btn" onClick={() => navigate('/feed')}>home.</button>
            <button className="nav-btn" onClick={() => navigate('/create')}>write.</button>
            <button className="nav-btn" onClick={() => navigate('/profile')}>profile.</button>
                {(() => {
                    try {
                        const token = localStorage.getItem('token')
                        if (!token) return null
                        const payload = JSON.parse(atob(token.split('.')[1]))
                        return payload.role === 'ADMIN' ? (
                        <button className="nav-btn" onClick={() => navigate('/admin')}>
                            admin.
                        </button>
                    ) : null
                } catch { return null }
            })()}
        </div>
    </nav>
  )
}