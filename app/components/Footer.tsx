import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About EduHub</h3>
            <p>EduHub is an online learning platform offering a wide range of courses across various subjects.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/subjects" className="hover:text-blue-600">
                  Subjects
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-600">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 EduHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

