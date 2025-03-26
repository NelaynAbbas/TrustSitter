"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"

export default function BecomeSitter() {
  const { currentUser, getProfile, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [availabilities, setAvailabilities] = useState([])
  const [newAvailability, setNewAvailability] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "17:00",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }
      
      if (hasLoadedRef.current) {
        setIsLoading(false)
        return
      }
      
      try {
        const data = await getProfile()
        if (data) {
          setProfileData(data)
          if (data.availability) {
            setAvailabilities(data.availability)
          }
          hasLoadedRef.current = true
        }
      } catch (err) {
        setError("Failed to load profile data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [currentUser, getProfile])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target
    setNewAvailability((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addAvailability = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("http://localhost:5000/api/sitter/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAvailability),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to add availability")
      }

      setAvailabilities((prev) => [...prev, data.availability])
      setSuccess("Availability added successfully")

      // Reset form
      setNewAvailability({
        day: "Monday",
        startTime: "09:00",
        endTime: "17:00",
      })
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteAvailability = async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`http://localhost:5000/api/sitter/availability/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to delete availability")
      }

      setAvailabilities((prev) => prev.filter((a) => a.id !== id))
      setSuccess("Availability deleted successfully")
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      await updateProfile({
        ...profileData,
        isProfilePublic: false, // Save but don't publish yet
      })
      setSuccess("Profile saved successfully")
    } catch (err) {
      setError(err.message || "Failed to save profile")
    } finally {
      setIsSaving(false)
    }
  }

  const publishProfile = async () => {
    setIsPublishing(true)
    setError("")
    setSuccess("")

    // Validate required fields
    if (!profileData.services || profileData.services.length === 0) {
      setError("Please select at least one service")
      setIsPublishing(false)
      return
    }

    if (!profileData.experience) {
      setError("Please select your years of experience")
      setIsPublishing(false)
      return
    }

    if (!profileData.hourlyRate) {
      setError("Please set your hourly rate")
      setIsPublishing(false)
      return
    }

    if (!availabilities || availabilities.length === 0) {
      setError("Please add at least one availability slot")
      setIsPublishing(false)
      return
    }

    try {
      // First save the profile to ensure all data is up to date
      await updateProfile({
        ...profileData,
        isProfilePublic: false,
      })

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("http://localhost:5000/api/sitter/publish-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to publish profile")
      }

      setProfileData((prev) => ({
        ...prev,
        isProfilePublic: true,
      }))

      setSuccess("Your profile is now public and available for families to find!")
    } catch (err) {
      setError(err.message || "Failed to publish profile")
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-teal-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2 text-teal-600">Loading profile...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Become a Sitter</h2>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      profileData.isProfilePublic ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {profileData.isProfilePublic ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

              {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{success}</div>}

              <div className="mb-6">
                <p className="text-gray-600">
                  Complete your profile to become a sitter on TrustSitter. Once your profile is complete, you can
                  publish it to make it visible to families looking for sitters.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profileData.bio || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      placeholder="Tell families about yourself, your experience, and why you enjoy being a sitter..."
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of experience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={profileData.experience || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate ($)
                    </label>
                    <input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      min="0"
                      step="0.50"
                      value={profileData.hourlyRate || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      placeholder="15.00"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Services</h3>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="babysitting"
                        name="babysitting"
                        type="checkbox"
                        checked={profileData.services?.includes("babysitting") || false}
                        onChange={(e) => {
                          const services = profileData.services || []
                          if (e.target.checked) {
                            setProfileData({ ...profileData, services: [...services, "babysitting"] })
                          } else {
                            setProfileData({ ...profileData, services: services.filter((s) => s !== "babysitting") })
                          }
                        }}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                      />
                      <label htmlFor="babysitting" className="ml-3 block text-sm text-gray-700">
                        Babysitting
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="petsitting"
                        name="petsitting"
                        type="checkbox"
                        checked={profileData.services?.includes("petsitting") || false}
                        onChange={(e) => {
                          const services = profileData.services || []
                          if (e.target.checked) {
                            setProfileData({ ...profileData, services: [...services, "petsitting"] })
                          } else {
                            setProfileData({ ...profileData, services: services.filter((s) => s !== "petsitting") })
                          }
                        }}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                      />
                      <label htmlFor="petsitting" className="ml-3 block text-sm text-gray-700">
                        Pet sitting
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="housesitting"
                        name="housesitting"
                        type="checkbox"
                        checked={profileData.services?.includes("housesitting") || false}
                        onChange={(e) => {
                          const services = profileData.services || []
                          if (e.target.checked) {
                            setProfileData({ ...profileData, services: [...services, "housesitting"] })
                          } else {
                            setProfileData({ ...profileData, services: services.filter((s) => s !== "housesitting") })
                          }
                        }}
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                      />
                      <label htmlFor="housesitting" className="ml-3 block text-sm text-gray-700">
                        House sitting
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Availability</h3>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Availability</h4>

                    {availabilities.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No availability set. Add your availability below.</p>
                    ) : (
                      <div className="space-y-2">
                        {availabilities.map((availability) => (
                          <div
                            key={availability.id}
                            className="flex items-center justify-between bg-white p-2 rounded border"
                          >
                            <div>
                              <span className="font-medium">{availability.day}:</span> {availability.startTime} -{" "}
                              {availability.endTime}
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteAvailability(availability.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Add New Availability</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <select
                          name="day"
                          value={newAvailability.day}
                          onChange={handleAvailabilityChange}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        >
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                        <input
                          type="time"
                          name="startTime"
                          value={newAvailability.startTime}
                          onChange={handleAvailabilityChange}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        />
                        <input
                          type="time"
                          name="endTime"
                          value={newAvailability.endTime}
                          onChange={handleAvailabilityChange}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addAvailability}
                        className="mt-2 px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300"
                      >
                        Add Availability
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>

                  <button
                    type="button"
                    onClick={publishProfile}
                    disabled={isPublishing || profileData.isProfilePublic}
                    className={`px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-all duration-300 ${isPublishing || profileData.isProfilePublic ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isPublishing ? "Publishing..." : profileData.isProfilePublic ? "Published" : "Publish Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

