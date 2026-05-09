import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"

export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)

      axios.get("http://localhost:8080/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const userData = res.data.data
        if (userData.bio) localStorage.setItem('bio', userData.bio)
        if (userData.profilePicUrl) localStorage.setItem('profilePicUrl', userData.profilePicUrl)
        if (userData.username) localStorage.setItem('displayUsername', userData.username)
      })
      .catch(() => {})
      .finally(() => navigate("/feed"))

    } else {
      navigate("/login?error=oauth_failed")
    }
  }, [])

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p style={{ fontFamily: "Inter, sans-serif", color: "#6b7280" }}>signing you in...</p>
    </div>
  )
}