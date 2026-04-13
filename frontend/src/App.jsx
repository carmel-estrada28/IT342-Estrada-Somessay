import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuth2Redirect from "./pages/OAuth2Redirect";
import Home from "./pages/Home"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
