"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../context/AuthContext"

export default function Profile() {
  const { currentUser, getProfile, updateProfile, requestVerification } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isRequestingVerification, setIsRequestingVerification] = useState(false)
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
        const profileData = await getProfile()
        if (profileData) {
          setFormData(profileData)
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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await updateProfile(formData)
      setSuccess("Profile updated successfully")
      setIsEditing(false)
    } catch (err) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationRequest = async () => {
    setIsRequestingVerification(true)
    setError("")
    setSuccess("")

    try {
      await requestVerification()
      setSuccess("Verification request submitted successfully")
    } catch (err) {
      setError(err.message || "Failed to request verification")
    } finally {
      setIsRequestingVerification(false)
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
                <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

              {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{success}</div>}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        disabled
                        value={formData.email || ""}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="City"
                          value={formData.city || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        />
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          placeholder="ZIP Code"
                          value={formData.zipCode || ""}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* User type specific fields */}
                    {formData.userType === "family" && (
                      <>
                        <div>
                          <label htmlFor="childrenCount" className="block text-sm font-medium text-gray-700 mb-1">
                            How many children do you have?
                          </label>
                          <select
                            id="childrenCount"
                            name="childrenCount"
                            value={formData.childrenCount || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                          >
                            <option value="" disabled>
                              Select an option
                            </option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4+">4 or more</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="sittingNeeds" className="block text-sm font-medium text-gray-700 mb-1">
                            What are your sitting needs?
                          </label>
                          <select
                            id="sittingNeeds"
                            name="sittingNeeds"
                            value={formData.sittingNeeds || ""}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                          >
                            <option value="" disabled>
                              Select an option
                            </option>
                            <option value="regular">Regular (weekly)</option>
                            <option value="occasional">Occasional</option>
                            <option value="date-night">Date nights</option>
                            <option value="emergency">Emergency backup</option>
                          </select>
                        </div>
                      </>
                    )}

                    {formData.userType === "sitter" && (
                      <>
                        <div>
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                            Years of experience
                          </label>
                          <select
                            id="experience"
                            name="experience"
                            value={formData.experience || ""}
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
                          <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
                            Services
                          </label>
                          <div className="mt-1 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="babysitting"
                                name="babysitting"
                                type="checkbox"
                                checked={formData.services?.includes("babysitting") || false}
                                onChange={(e) => {
                                  const services = formData.services || []
                                  if (e.target.checked) {
                                    setFormData({ ...formData, services: [...services, "babysitting"] })
                                  } else {
                                    setFormData({ ...formData, services: services.filter((s) => s !== "babysitting") })
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
                                checked={formData.services?.includes("petsitting") || false}
                                onChange={(e) => {
                                  const services = formData.services || []
                                  if (e.target.checked) {
                                    setFormData({ ...formData, services: [...services, "petsitting"] })
                                  } else {
                                    setFormData({ ...formData, services: services.filter((s) => s !== "petsitting") })
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
                                checked={formData.services?.includes("housesitting") || false}
                                onChange={(e) => {
                                  const services = formData.services || []
                                  if (e.target.checked) {
                                    setFormData({ ...formData, services: [...services, "housesitting"] })
                                  } else {
                                    setFormData({ ...formData, services: services.filter((s) => s !== "housesitting") })
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
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
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
                      ) : null}
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-xl font-bold">
                      {formData.firstName?.charAt(0)}
                      {formData.lastName?.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold">
                        {formData.firstName} {formData.lastName}
                      </h3>
                      <p className="text-gray-600">{formData.email}</p>
                      {formData.userType === "sitter" && (
                        <div className="mt-1">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              formData.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {formData.isVerified ? "Verified Sitter" : "Unverified Sitter"}
                          </span>
                          {!formData.isVerified && !formData.verificationRequested && (
                            <button
                              onClick={handleVerificationRequest}
                              disabled={isRequestingVerification}
                              className="ml-2 text-xs text-teal-600 hover:text-teal-700 underline"
                            >
                              {isRequestingVerification ? "Requesting..." : "Request Verification"}
                            </button>
                          )}
                          {!formData.isVerified && formData.verificationRequested && (
                            <span className="ml-2 text-xs text-gray-600">Verification pending</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm mb-1">
                          <span className="font-medium">Phone:</span> {formData.phone || "Not provided"}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-medium">Address:</span> {formData.address || "Not provided"}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Location:</span>{" "}
                          {formData.city ? `${formData.city}, ${formData.zipCode}` : "Not provided"}
                        </p>
                      </div>
                    </div>

                    {formData.userType === "family" && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Family Information</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm mb-1">
                            <span className="font-medium">Children:</span> {formData.childrenCount || "Not specified"}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Sitting Needs:</span>{" "}
                            {formData.sittingNeeds || "Not specified"}
                          </p>
                        </div>
                      </div>
                    )}

                    {formData.userType === "sitter" && (
                      <>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-1">Sitter Information</h4>
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm mb-1">
                              <span className="font-medium">Experience:</span> {formData.experience || "Not specified"}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Services:</span>{" "}
                              {formData.services?.length ? formData.services.join(", ") : "None specified"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

