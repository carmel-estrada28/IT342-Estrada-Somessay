import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)
      navigate("/home")
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