import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
              <span className="text-xl font-bold">TrustSitter</span>
            </Link>
            <p className="text-sm text-gray-500">
              Connecting families with trusted babysitters, pet sitters, and home sitters in your community.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Families</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Safety Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Find a Sitter
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Sitters</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Apply to Sit
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Sitter Resources
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-teal-600 transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} TrustSitter. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors duration-300">
                <span className="sr-only">Privacy Policy</span>
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors duration-300">
                <span className="sr-only">Terms of Service</span>
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-teal-600 transition-colors duration-300">
                <span className="sr-only">Trust & Safety</span>
                Trust & Safety
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

