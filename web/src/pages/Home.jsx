import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Home() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const email = payload.sub || ""
      setUsername(email.split("@")[0].replace(/[._]/g, " "))
    } catch(e) {}
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="login-page">
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <span className="navbar-name">somessay.</span>
        </a>
        <div className="navbar-links">
          <button className="nav-btn">explore.</button>
          <button className="nav-btn">write.</button>
          <button className="nav-btn">my profile.</button>
          <button onClick={handleLogout} className="nav-btn" style={{color: "#D37B27", border: "1px solid #D37B27", borderRadius: "20px", padding: "0.35rem 1rem"}}>
            logout
          </button>
        </div>
      </nav>

      <main style={{padding: "2rem", maxWidth: "780px", margin: "0 auto"}}>
        <h1 style={{fontFamily: "'Instrument Serif', serif", fontWeight: 400}}>
          welcome back{username ? `, ${username}` : ""}.
        </h1>
        <p style={{color: "#6b7280"}}>your space to write, reflect, and share.</p>
      </main>
    </div>
  )
}