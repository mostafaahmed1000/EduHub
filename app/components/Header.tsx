"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import SearchBar from "./SearchBar"
import { useAuth } from "../contexts/AuthContext"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-blue-600 text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-2xl font-bold">
            EduHub
          </Link>
          <div className="hidden md:flex items-center gap-8 flex-1">
            <div className="w-full max-w-2xl mx-auto">
              <SearchBar />
            </div>
            <nav className="flex-shrink-0">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link href="/eduhub/subjects" className="hover:text-white">
                    Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/eduhub/courses" className="hover:text-white">
                    Courses
                  </Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link href="/eduhub/dashboard" className="hover:text-white">
                        My Courses
                      </Link>
                    </li>
                    <li>
                      <Link href="/eduhub/instructor/dashboard" className="hover:text-white">
                        Instructor
                      </Link>
                    </li>
                    <li>
                      <Button
                        variant="outline"
                        className="text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-blue-600"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Button
                        variant="outline"
                        className="text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-blue-600"
                        asChild
                      >
                        <Link href="/eduhub/login">Login</Link>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="outline"
                        className="text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-blue-600"
                        asChild
                      >
                        <Link href="/eduhub/signup">Sign Up</Link>
                      </Button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="w-full mb-4">
              <SearchBar />
            </div>
            <nav className="mt-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/eduhub/subjects" className="block hover:text-white">
                    Subjects
                  </Link>
                </li>
                <li>
                  <Link href="/eduhub/courses" className="block hover:text-white">
                    Courses
                  </Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <Link href="/eduhub/dashboard" className="block hover:text-white">
                      My Courses
                      </Link>
                    </li>
                    <li>
                      <Link href="/eduhub/instructor/dashboard" className="block hover:text-white">
                        Instructor
                      </Link>
                    </li>
                    <li>
                      <Button
                        variant="outline"
                        className="w-full text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-blue-600"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Button
                        variant="outline"
                        className="w-full text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-blue-600"
                        asChild
                      >
                        <Link href="/eduhub/login">Login</Link>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="outline"
                        className="w-full text-gray-600 border-gray-100 hover:bg-gray-100 hover:text-blue-600"
                        asChild
                      >
                        <Link href="/eduhub/signup">Sign Up</Link>
                      </Button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

