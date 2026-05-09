import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuth2Redirect from './pages/OAuth2Redirect'
import Home from './pages/Home'
import Feed from './pages/Feed'
import CreateArticle from './pages/CreateArticle'
import ArticleDetail from './pages/ArticleDetail'
import Profile from './pages/Profile'
import Landing from './pages/Landing'
import Activity from './pages/Activity' 
import Admin from './pages/Admin'
import EditProfile from './pages/EditProfile'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App