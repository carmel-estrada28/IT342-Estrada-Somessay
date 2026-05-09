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
        const token = res.data.data.token
        localStorage.setItem("token", token)

        try {
          const meRes = await axios.get("http://localhost:8080/api/v1/users/me", {
            headers: { Authorization: `Bearer ${token}` }
          })
          const userData = meRes.data.data
          if (userData.bio) localStorage.setItem('bio', userData.bio)
          if (userData.profilePicUrl) localStorage.setItem('profilePicUrl', userData.profilePicUrl)
          if (userData.username) localStorage.setItem('displayUsername', userData.username)
        } catch (e) {}

        navigate("/feed")
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.")
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

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
          <button className="nav-btn" onClick={() => navigate("/login")}>profile.</button>
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
              <button onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 px-4 bg-white hover:bg-gray-200 transition"              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">Log in with Google</span>
              </button>
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
