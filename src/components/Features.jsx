"use client"

import { useEffect, useRef, useState } from "react"

export default function Features() {
  const [visibleItems, setVisibleItems] = useState([])
  const featuresRef = useRef(null)

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Verified Profiles",
      description:
        "Every sitter undergoes a thorough background check and identity verification process before joining our platform.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      title: "Secure Messaging",
      description:
        "Our encrypted in-app messaging system ensures safe and private communication between families and sitters.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      title: "Transparent Reviews",
      description:
        "Honest, verified reviews from both sitters and families help build trust and make informed decisions.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      title: "Detailed Profiles",
      description:
        "Comprehensive profiles showcase experience, skills, certifications, and availability to find the perfect match.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Secure Payments",
      description:
        "Our platform handles all payments securely, ensuring fair compensation and eliminating awkward money conversations.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Real-time Updates",
      description:
        "Families receive check-in notifications and updates throughout the sitting session for peace of mind.",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start showing items with a staggered delay
            let timer = 0
            const interval = setInterval(() => {
              setVisibleItems((prev) => {
                if (prev.length >= features.length) {
                  clearInterval(interval)
                  return prev
                }
                return [...prev, prev.length]
              })
              timer++
            }, 150)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (featuresRef.current) {
      observer.observe(featuresRef.current)
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current)
      }
    }
  }, [features.length])

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-800">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900">
              Building Trust Through Transparency
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl">
              Our platform is designed to create a safe, transparent environment where families and sitters can connect
              with confidence.
            </p>
          </div>
        </div>
        <div
          ref={featuresRef}
          className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 transform ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0 hover:shadow-lg hover:-translate-y-1"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

