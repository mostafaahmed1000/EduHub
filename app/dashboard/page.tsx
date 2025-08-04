"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { getEnrolledCourses } from "../lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Course } from "@/app/types"

export default function DashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const { user, token, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (token) {
        try {
          const courses = await getEnrolledCourses(token)
          setEnrolledCourses(courses)
        } catch (error) {
          console.error("Failed to fetch enrolled courses:", error)
        }
      }
    }

    fetchEnrolledCourses()
  }, [token])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // This will prevent any flash of content before redirect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Your Courses</h1>
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <Button variant="outline" asChild>
                  <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You are not enrolled in any courses yet.</p>
      )}
    </div>
  )
}

