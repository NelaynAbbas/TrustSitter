"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import Testimonials from "./components/Testimonials"
import Safety from "./components/Safety"
import Cta from "./components/Cta"
import Footer from "./components/Footer"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import Profile from "./components/Profile"
import BecomeSitter from "./components/BecomeSitter"
import FindSitter from "./components/FindSitter"
import { AuthProvider, useAuth } from "./context/AuthContext"

// Protected route component
const ProtectedRoute = ({ children, allowedUserType = null }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }

  if (allowedUserType && currentUser.userType !== allowedUserType) {
    return <Navigate to="/" replace />
  }

  return children
}

function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Safety />
      <Testimonials />
      <Cta />
    </>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/become-sitter"
        element={
          <ProtectedRoute allowedUserType="sitter">
            <BecomeSitter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-sitter"
        element={
          <ProtectedRoute allowedUserType="family">
            <FindSitter />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

