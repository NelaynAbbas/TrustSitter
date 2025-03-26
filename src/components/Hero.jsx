"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import happy from "../assets/happy.png"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-cyan-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div
            className={`flex flex-col justify-center space-y-4 transition-all duration-1000 transform ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                Find Trusted Sitters You Can Rely On
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                TrustSitter connects families with verified, background-checked babysitters, pet sitters, and home
                sitters in your community.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                to="/signup"
                className="bg-teal-600 text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center"
              >
                Find a Sitter
              </Link>
              <Link
                to="/signup"
                className="border border-teal-600 text-teal-600 px-8 py-3 rounded-md text-sm font-medium hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 hover:shadow-md inline-flex items-center justify-center"
              >
                Become a Sitter
              </Link>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">Trusted by over 50,000+ families nationwide</span>
            </div>
          </div>
          <div
            className={`mx-auto aspect-video overflow-hidden rounded-xl transition-all duration-1000 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            <img
              src={happy}
              alt="Happy family with babysitter"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

