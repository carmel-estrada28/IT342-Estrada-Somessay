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
        <button className="nav-btn" onClick={() => navigate('/profile')}>my profile.</button>
        <button
          onClick={handleLogout}
          className="nav-btn"
          style={{ backgroundColor: 'transparent', color: '#9B4B42', border: '1px solid #9B4B42' }}
        >
          logout
        </button>
      </div>
    </nav>
  )
}