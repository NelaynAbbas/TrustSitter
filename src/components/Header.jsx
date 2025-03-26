"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
          <span className="text-xl font-bold">TrustSitter</span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
            How It Works
          </a>
          <a href="#safety" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
            Safety
          </a>
          <a href="#testimonials" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
            Testimonials
          </a>

          {/* User type specific navigation */}
          {currentUser && currentUser.userType === "family" && (
            <Link to="/find-sitter" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
              Find a Sitter
            </Link>
          )}

          {currentUser && currentUser.userType === "sitter" && (
            <Link
              to="/become-sitter"
              className="text-sm font-medium hover:text-teal-600 transition-colors duration-300"
            >
              Become a Sitter
            </Link>
          )}
        </nav>

        {/* Auth buttons or profile menu */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium hover:text-teal-600 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  {currentUser.firstName.charAt(0)}
                  {currentUser.lastName.charAt(0)}
                </div>
                <span>{currentUser.firstName}</span>
                {currentUser.userType === "sitter" && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                      currentUser.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {currentUser.isVerified ? "Verified" : "Unverified"}
                  </span>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  {currentUser.userType === "family" && (
                    <Link
                      to="/find-sitter"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Find a Sitter
                    </Link>
                  )}
                  {currentUser.userType === "sitter" && (
                    <Link
                      to="/become-sitter"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Become a Sitter
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-teal-600 transition-colors duration-300"
              >
                How It Works
              </a>
              <a href="#safety" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
                Safety
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium hover:text-teal-600 transition-colors duration-300"
              >
                Testimonials
              </a>

              {/* User type specific navigation */}
              {currentUser && currentUser.userType === "family" && (
                <Link
                  to="/find-sitter"
                  className="text-sm font-medium hover:text-teal-600 transition-colors duration-300"
                >
                  Find a Sitter
                </Link>
              )}

              {currentUser && currentUser.userType === "sitter" && (
                <Link
                  to="/become-sitter"
                  className="text-sm font-medium hover:text-teal-600 transition-colors duration-300"
                >
                  Become a Sitter
                </Link>
              )}

              {currentUser ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                      {currentUser.firstName.charAt(0)}
                      {currentUser.lastName.charAt(0)}
                    </div>
                    <span>
                      {currentUser.firstName} {currentUser.lastName}
                    </span>
                    {currentUser.userType === "sitter" && (
                      <span
                        className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                          currentUser.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {currentUser.isVerified ? "Verified" : "Unverified"}
                      </span>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="text-sm font-medium hover:text-teal-600 transition-colors duration-300 block py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium hover:text-teal-600 transition-colors duration-300 block py-2 text-left w-full"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/signin" className="text-sm font-medium hover:text-teal-600 transition-colors duration-300">
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

