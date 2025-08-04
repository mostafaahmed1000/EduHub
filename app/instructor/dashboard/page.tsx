"use client"


import { getOwnedCourses } from "../../lib/api"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Course } from "@/app/types"


export default function InstructorDashboardPage() {
  const [ownedCourses, setOwnedCourses] = useState<Course[]>([])
  const { user, token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchOwnedCourses = async () => {
      if (token) {
        try {
          const response = await getOwnedCourses(token)
          setOwnedCourses(response.owned_courses)
        } catch (error) {
          console.error("Failed to fetch owned courses:", error)
        }
      }
    }

    fetchOwnedCourses()
  }, [token])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // This will prevent any flash of content before redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Instructor Dashboard</h1>
      <Button asChild className="mb-8">
        <Link href="ctor/courses/new">Create New Course</Link>
      </Button>
      <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
      {ownedCourses.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ownedCourses.map((course) => (
          <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">Subject ID: {course.subject}</p>
              <p className="text-gray-700 mb-4">{course.overview}</p>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Created: {new Date(course.created).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Modules: {course.modules.length}
                </p>
                <p className="text-sm text-gray-500">
                  Owner: {course.owner.full_name}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href={`rse.id}/`}>Edit</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      ) : (
        <p>You have not created any courses yet.</p>
      )}
    </div>
  )
}

