"use client"

import { useEffect, useState } from "react"

export default function Safety() {
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

    const section = document.getElementById("safety")
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  const safetyFeatures = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-teal-600"
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
      title: "Background Checks",
      description:
        "We partner with industry-leading background check providers to verify criminal history, identity, and address history.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Secure Platform",
      description:
        "Our platform uses bank-level encryption to protect your personal information and secure all communications.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-teal-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      title: "24/7 Support",
      description:
        "Our dedicated support team is available around the clock to assist with any issues or concerns that may arise.",
    },
  ]

  return (
    <section id="safety" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div
            className={`transition-all duration-1000 transform ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-800">Safety First</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900">
                Your Safety Is Our Top Priority
              </h2>
              <p className="text-gray-600 md:text-xl">
                We've built multiple layers of safety into our platform to ensure peace of mind for both families and
                sitters.
              </p>
              <ul className="space-y-2">
                {[
                  "Comprehensive background checks",
                  "Identity verification",
                  "Secure messaging system",
                  "Verified reviews from real users",
                  "Secure payment processing",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className={`grid gap-6 md:grid-cols-2 transition-all duration-1000 transform ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
          >
            {safetyFeatures.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${index === 2 ? "md:col-span-2" : ""}`}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

