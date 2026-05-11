import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import OAuth2Redirect from './features/auth/OAuth2Redirect'
import FeedPage from './features/feed/FeedPage'
import LandingPage from './features/feed/LandingPage'
import ArticleDetailPage from './features/article/ArticleDetailPage'
import CreateArticlePage from './features/article/CreateArticlePage'
import ProfilePage from './features/profile/ProfilePage'
import EditProfilePage from './features/profile/EditProfilePage'
import ActivityPage from './features/activity/ActivityPage'
import AdminPage from './features/admin/AdminPage'
import VerifyPage from './features/auth/VerifyPage'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ArticleDetailPage />} />
        <Route path="/create" element={<ProtectedRoute><CreateArticlePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><ActivityPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App