import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import useAuth from './hooks/useAuth'
import AdminPage from './pages/AdminPage'
import BookingPage from './pages/BookingPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  const { user } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role === 'admin'
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminPage /> : <Navigate to={user ? '/' : '/login'} replace />}
        />
      </Routes>
      {!isAuthRoute && <Footer />}
    </>
  )
}

export default App
