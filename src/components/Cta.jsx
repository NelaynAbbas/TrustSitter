"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Cta() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    const section = document.querySelector("section:last-of-type")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-teal-600">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`flex flex-col items-center justify-center space-y-4 text-center transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-white">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="max-w-[600px] text-teal-100 md:text-xl">
              Join thousands of families and sitters who have found trusted connections through our platform.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              to="/signup"
              className="bg-white text-teal-600 px-8 py-3 rounded-md text-sm font-medium hover:bg-teal-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center"
            >
              Find a Sitter
            </Link>
            <Link
              to="/signup"
              className="border border-white text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md inline-flex items-center justify-center"
            >
              Become a Sitter
            </Link>
          </div>
          <p className="text-sm text-teal-100">No subscription fees. Pay only when you book a sitter.</p>
        </div>
      </div>
    </section>
  )
}

