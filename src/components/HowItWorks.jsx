"use client"

import { useEffect, useRef, useState } from "react"

export default function HowItWorks() {
  const [visibleItems, setVisibleItems] = useState([])
  const stepsRef = useRef(null)

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Sign up and create a detailed profile highlighting your needs as a family or your qualifications as a sitter.",
      forWhom: "For Everyone",
    },
    {
      number: "02",
      title: "Verification Process",
      description:
        "Sitters undergo background checks, identity verification, and reference checks to ensure safety and trust.",
      forWhom: "For Sitters",
    },
    {
      number: "03",
      title: "Browse & Connect",
      description:
        "Families can search for sitters based on availability, experience, and reviews. Sitters can browse job opportunities.",
      forWhom: "For Everyone",
    },
    {
      number: "04",
      title: "Interview & Meet",
      description:
        "Schedule interviews through our secure platform to ensure the right fit before making any commitments.",
      forWhom: "For Everyone",
    },
    {
      number: "05",
      title: "Book & Pay Securely",
      description: "Book services and process payments through our secure platform, protecting both parties.",
      forWhom: "For Families",
    },
    {
      number: "06",
      title: "Share Feedback",
      description: "After the service, both parties can leave honest reviews to help build trust in the community.",
      forWhom: "For Everyone",
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
                if (prev.length >= steps.length) {
                  clearInterval(interval)
                  return prev
                }
                return [...prev, prev.length]
              })
              timer++
            }, 200)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (stepsRef.current) {
      observer.observe(stepsRef.current)
    }

    return () => {
      if (stepsRef.current) {
        observer.unobserve(stepsRef.current)
      }
    }
  }, [steps.length])

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-800">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900">
              Simple, Transparent Process
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl">
              Our platform makes it easy to find the perfect sitter or sitting job with a straightforward, secure
              process.
            </p>
          </div>
        </div>
        <div ref={stepsRef} className="mx-auto max-w-5xl py-12">
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-4 items-start transition-all duration-500 transform ${
                  visibleItems.includes(index) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold transition-all duration-300 hover:bg-teal-200 hover:scale-110">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 mb-2">{step.description}</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {step.forWhom}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

