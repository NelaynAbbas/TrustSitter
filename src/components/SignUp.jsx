"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "family",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Prepare data for API
      const userData = {
        ...formData,
        // Convert checkbox values to arrays for services, etc.
        services: Object.keys(formData).filter(
          (key) => (key === "babysitting" || key === "petsitting" || key === "housesitting") && formData[key],
        ),
      }

      await register(userData)
      navigate("/profile")
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl">
              <div className="p-6 sm:p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                  <p className="text-gray-600 mt-2">Join TrustSitter today</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

                {/* Progress indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        1
                      </div>
                      <div className={`ml-2 text-sm ${step >= 1 ? "text-teal-600 font-medium" : "text-gray-500"}`}>
                        Account
                      </div>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${step >= 2 ? "bg-teal-600" : "bg-gray-200"}`}></div>
                    <div className="flex items-center">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"}`}
                      >
                        2
                      </div>
                      <div className={`ml-2 text-sm ${step >= 2 ? "text-teal-600 font-medium" : "text-gray-500"}`}>
                        Details
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First name
                          </label>
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            required
                            value={formData.firstName}
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
                            autoComplete="family-name"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
                        </p>
                      </div>

                      <div>
                        <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 mb-1">
                          I am a:
                        </label>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                          <div
                            className={`border rounded-md p-3 cursor-pointer transition-all duration-300 ${formData.accountType === "family" ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-300"}`}
                            onClick={() => setFormData((prev) => ({ ...prev, accountType: "family" }))}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="accountType"
                                value="family"
                                checked={formData.accountType === "family"}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <label htmlFor="family" className="ml-3 block text-sm font-medium text-gray-700">
                                Family
                              </label>
                            </div>
                          </div>
                          <div
                            className={`border rounded-md p-3 cursor-pointer transition-all duration-300 ${formData.accountType === "sitter" ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-300"}`}
                            onClick={() => setFormData((prev) => ({ ...prev, accountType: "sitter" }))}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="accountType"
                                value="sitter"
                                checked={formData.accountType === "sitter"}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                              />
                              <label htmlFor="sitter" className="ml-3 block text-sm font-medium text-gray-700">
                                Sitter
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Tell us more about yourself</h3>

                        {/* Common fields for both account types */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                            placeholder="(123) 456-7890"
                          />
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            id="address"
                            name="address"
                            type="text"
                            autoComplete="street-address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 mb-2"
                            placeholder="Street Address"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              id="city"
                              name="city"
                              type="text"
                              autoComplete="address-level2"
                              required
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                              placeholder="City"
                            />
                            <input
                              id="zipCode"
                              name="zipCode"
                              type="text"
                              autoComplete="postal-code"
                              required
                              value={formData.zipCode}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                              placeholder="ZIP Code"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                            Emergency Contact
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              id="emergencyName"
                              name="emergencyName"
                              type="text"
                              required
                              value={formData.emergencyName || ""}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                              placeholder="Full Name"
                            />
                            <input
                              id="emergencyPhone"
                              name="emergencyPhone"
                              type="tel"
                              required
                              value={formData.emergencyPhone || ""}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                              placeholder="Phone Number"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                            Availability
                          </label>
                          <div className="mt-1 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="weekdays"
                                name="weekdays"
                                type="checkbox"
                                checked={formData.weekdays || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                              />
                              <label htmlFor="weekdays" className="ml-3 block text-sm text-gray-700">
                                Weekdays
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="weekends"
                                name="weekends"
                                type="checkbox"
                                checked={formData.weekends || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                              />
                              <label htmlFor="weekends" className="ml-3 block text-sm text-gray-700">
                                Weekends
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="evenings"
                                name="evenings"
                                type="checkbox"
                                checked={formData.evenings || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                              />
                              <label htmlFor="evenings" className="ml-3 block text-sm text-gray-700">
                                Evenings
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Account type specific fields */}
                        {formData.accountType === "family" ? (
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
                              <label htmlFor="childrenAges" className="block text-sm font-medium text-gray-700 mb-1">
                                Age range of children
                              </label>
                              <div className="mt-1 space-y-2">
                                <div className="flex items-center">
                                  <input
                                    id="infant"
                                    name="infant"
                                    type="checkbox"
                                    checked={formData.infant || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="infant" className="ml-3 block text-sm text-gray-700">
                                    Infant (0-1 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="toddler"
                                    name="toddler"
                                    type="checkbox"
                                    checked={formData.toddler || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="toddler" className="ml-3 block text-sm text-gray-700">
                                    Toddler (1-3 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="preschool"
                                    name="preschool"
                                    type="checkbox"
                                    checked={formData.preschool || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="preschool" className="ml-3 block text-sm text-gray-700">
                                    Preschool (3-5 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="schoolAge"
                                    name="schoolAge"
                                    type="checkbox"
                                    checked={formData.schoolAge || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="schoolAge" className="ml-3 block text-sm text-gray-700">
                                    School age (5-12 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="teenager"
                                    name="teenager"
                                    type="checkbox"
                                    checked={formData.teenager || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="teenager" className="ml-3 block text-sm text-gray-700">
                                    Teenager (13+ years)
                                  </label>
                                </div>
                              </div>
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
                        ) : (
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
                              <label htmlFor="sittingType" className="block text-sm font-medium text-gray-700 mb-1">
                                What type of sitting do you provide?
                              </label>
                              <div className="mt-1 space-y-2">
                                <div className="flex items-center">
                                  <input
                                    id="babysitting"
                                    name="babysitting"
                                    type="checkbox"
                                    checked={formData.babysitting || false}
                                    onChange={handleChange}
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
                                    checked={formData.petsitting || false}
                                    onChange={handleChange}
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
                                    checked={formData.housesitting || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="housesitting" className="ml-3 block text-sm text-gray-700">
                                    House sitting
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="ageGroups" className="block text-sm font-medium text-gray-700 mb-1">
                                Age groups you're comfortable with
                              </label>
                              <div className="mt-1 space-y-2">
                                <div className="flex items-center">
                                  <input
                                    id="sitter-infant"
                                    name="sitter-infant"
                                    type="checkbox"
                                    checked={formData["sitter-infant"] || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="sitter-infant" className="ml-3 block text-sm text-gray-700">
                                    Infant (0-1 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="sitter-toddler"
                                    name="sitter-toddler"
                                    type="checkbox"
                                    checked={formData["sitter-toddler"] || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="sitter-toddler" className="ml-3 block text-sm text-gray-700">
                                    Toddler (1-3 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="sitter-preschool"
                                    name="sitter-preschool"
                                    type="checkbox"
                                    checked={formData["sitter-preschool"] || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="sitter-preschool" className="ml-3 block text-sm text-gray-700">
                                    Preschool (3-5 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="sitter-schoolAge"
                                    name="sitter-schoolAge"
                                    type="checkbox"
                                    checked={formData["sitter-schoolAge"] || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="sitter-schoolAge" className="ml-3 block text-sm text-gray-700">
                                    School age (5-12 years)
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="sitter-teenager"
                                    name="sitter-teenager"
                                    type="checkbox"
                                    checked={formData["sitter-teenager"] || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="sitter-teenager" className="ml-3 block text-sm text-gray-700">
                                    Teenager (13+ years)
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                                Certifications
                              </label>
                              <div className="mt-1 space-y-2">
                                <div className="flex items-center">
                                  <input
                                    id="cpr"
                                    name="cpr"
                                    type="checkbox"
                                    checked={formData.cpr || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="cpr" className="ml-3 block text-sm text-gray-700">
                                    CPR Certified
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="firstAid"
                                    name="firstAid"
                                    type="checkbox"
                                    checked={formData.firstAid || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="firstAid" className="ml-3 block text-sm text-gray-700">
                                    First Aid Certified
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="earlyChildhood"
                                    name="earlyChildhood"
                                    type="checkbox"
                                    checked={formData.earlyChildhood || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                                  />
                                  <label htmlFor="earlyChildhood" className="ml-3 block text-sm text-gray-700">
                                    Early Childhood Education
                                  </label>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  <div className="flex items-center">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded transition-all duration-300"
                    />
                    <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-teal-600 hover:text-teal-500">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-teal-600 hover:text-teal-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      {isLoading ? "Creating account..." : step === 1 ? "Continue" : "Create account"}
                    </button>
                  </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="font-medium text-teal-600 hover:text-teal-500 transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

