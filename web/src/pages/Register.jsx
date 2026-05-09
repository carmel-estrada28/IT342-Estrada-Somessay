import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../styles/Register.css"

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          username: form.username,
          email: form.email,
          password: form.password,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.data.status === "success") {
        setSuccess("Registration successful! Redirecting to login...")
        setTimeout(() => navigate("/login"), 2000)
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
    <div className="register-page">
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
      <main className="register-main">
        <div className="register-card">
          <h1 className="register-title">Welcome!</h1>

          {error && <p className="register-error">{error}</p>}
          {success && <p className="register-success">{success}</p>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
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
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={form.confirmPassword}
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
                  <span className="text-gray-700 font-medium">Sign up with Google</span>
                </button>
              </div>
              <button type="submit" className="submit-btn">
                enter the seasons
              </button>
          </form>

          <p className="register-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="link-text">
              log in
            </span>
          </p>
        </div>
      </main>
    </div>
  )
}
