"use client"

import { useEffect, useRef, useState } from "react"

export default function Testimonials() {
  const [visibleItems, setVisibleItems] = useState([])
  const testimonialsRef = useRef(null)

  const testimonials = [
    {
      type: "family",
      name: "Sarah Johnson",
      location: "Denver, CO",
      content:
        "TrustSitter has completely changed how we find babysitters. The verification process gives us peace of mind, and we've found amazing sitters who our kids love. The in-app updates during sitting sessions are especially reassuring.",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "sitter",
      name: "Michael Chen",
      location: "Boston, MA",
      content:
        "As a pet sitter, I appreciate how TrustSitter verifies both sitters and families. The secure payment system ensures I'm always paid fairly and on time, and the detailed profiles help me find jobs that match my experience and preferences.",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "family",
      name: "Emily Rodriguez",
      location: "Austin, TX",
      content:
        "We needed a house sitter while traveling internationally, and were nervous about finding someone trustworthy. TrustSitter's thorough verification process and secure messaging gave us confidence. Our house sitter was amazing and sent us regular updates.",
      avatar: "https://via.placeholder.com/40",
    },
    {
      type: "sitter",
      name: "David Thompson",
      location: "Seattle, WA",
      content:
        "The transparent review system on TrustSitter has helped me build a strong reputation as a babysitter. Families can see my qualifications, experience, and reviews from other families, which has led to consistent bookings and great relationships.",
      avatar: "https://via.placeholder.com/40",
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
                if (prev.length >= testimonials.length) {
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

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current)
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current)
      }
    }
  }, [testimonials.length])

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-800">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-gray-900">
              Trusted by Families and Sitters Alike
            </h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl">
              Don't just take our word for it. See what our community has to say about their experiences with
              TrustSitter.
            </p>
          </div>
        </div>
        <div ref={testimonialsRef} className="mx-auto grid max-w-6xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 transform ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0 hover:shadow-lg hover:-translate-y-1"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={`${testimonial.name}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`px-2 py-1 text-xs rounded ${testimonial.type === "family" ? "bg-blue-100 text-blue-800" : "bg-teal-100 text-teal-800"}`}
                  >
                    {testimonial.type === "family" ? "Family" : "Sitter"}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

