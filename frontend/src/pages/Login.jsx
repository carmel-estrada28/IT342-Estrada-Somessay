import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import "../styles/Login.css"
import "../styles/Register.css"

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        form,
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.data.token)
        navigate("/home")
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.")
    }
  }

  return (
    <div className="login-page">
      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-brand">
          <img src="/logo.png" alt="somessay logo" className="navbar-logo" />
          <span className="navbar-name">somessay</span>
        </a>
        <div className="navbar-links">
          <button className="nav-btn" onClick={() => navigate("/")}>home.</button>
          <button className="nav-btn" onClick={() => navigate("/login")}>my profile.</button>
        </div>
      </nav>

      {/* Main */}
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Welcome Back!</h1>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <hr className="divider" />

            <div className="social-buttons">
              <button type="button" className="social-btn">google</button>
              <button type="button" className="social-btn">microsoft</button>
              <button type="button" className="social-btn">facebook</button>
            </div>

            <button type="submit" className="submit-btn">
              enter the seasons
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} className="link-text">
              register
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}
