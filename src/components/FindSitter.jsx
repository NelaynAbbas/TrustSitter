"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function FindSitter() {
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [sitters, setSitters] = useState([])
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    service: "",
    city: "",
    verified: false,
    day: "",
  })

  useEffect(() => {
    fetchSitters()
  }, [])

  const fetchSitters = async () => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Build query string from filters
      const queryParams = new URLSearchParams()
      if (filters.service) queryParams.append("service", filters.service)
      if (filters.city) queryParams.append("city", filters.city)
      if (filters.verified) queryParams.append("verified", "true")
      if (filters.day) queryParams.append("day", filters.day)

      const response = await fetch(`http://localhost:5000/api/sitters?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sitters")
      }

      setSitters(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    fetchSitters()
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Find a Sitter</h2>
            <p className="text-gray-600">
              Browse through our verified sitters and find the perfect match for your family's needs.
            </p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

                <form onSubmit={applyFilters} className="space-y-4">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={filters.service}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    >
                      <option value="">All Services</option>
                      <option value="babysitting">Babysitting</option>
                      <option value="petsitting">Pet Sitting</option>
                      <option value="housesitting">House Sitting</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      placeholder="Enter city name"
                    />
                  </div>

                  <div>
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                      Availability Day
                    </label>
                    <select
                      id="day"
                      name="day"
                      value={filters.day}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    >
                      <option value="">Any Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="verified"
                      name="verified"
                      type="checkbox"
                      checked={filters.verified}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
                      Verified Sitters Only
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300"
                  >
                    Apply Filters
                  </button>
                </form>
              </div>
            </div>

            {/* Sitters list */}
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <svg
                    className="animate-spin h-8 w-8 text-teal-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2 text-teal-600">Loading sitters...</span>
                </div>
              ) : sitters.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sitters found</h3>
                  <p className="text-gray-600">
                    We couldn't find any sitters matching your criteria. Try adjusting your filters or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sitters.map((sitter) => (
                    <div
                      key={sitter.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-lg font-bold">
                              {sitter.firstName.charAt(0)}
                              {sitter.lastName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-medium text-gray-900">
                                {sitter.firstName} {sitter.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{sitter.city || "Location not specified"}</p>
                            </div>
                          </div>
                          {sitter.isVerified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified</span>
                          )}
                        </div>

                        <div className="mt-4">
                          <div className="flex items-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-teal-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="ml-2 text-gray-700">${sitter.hourlyRate}/hour</span>
                          </div>

                          <div className="flex items-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-teal-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="ml-2 text-gray-700">{sitter.experience} experience</span>
                          </div>

                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-teal-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            <span className="ml-2 text-gray-700">{sitter.services.join(", ")}</span>
                          </div>
                        </div>

                        {sitter.bio && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 line-clamp-2">{sitter.bio}</p>
                          </div>
                        )}

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Availability</h4>
                          <div className="flex flex-wrap gap-1">
                            {sitter.availability.length > 0 ? (
                              sitter.availability.map((a, index) => (
                                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                  {a.day} ({a.startTime}-{a.endTime})
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500 italic">No availability specified</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-end">
                          <button className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300">
                            Contact Sitter
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

