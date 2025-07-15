'use client';

import { getCourse } from "../../lib/api"
import ClientCoursePage from "./ClientCoursePage"
import { useEffect, useState } from "react"

export default function CoursePage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCourse() {
      try {
        const courseId = parseInt(params.id)
        const courseData = await getCourse(courseId)
        setCourse(courseData)
      } catch (err: any) {
        console.error('Error loading course:', err)
        setError(err.message || 'Failed to load course')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading course...</div>
  }

  if (error || !course) {
    return <div className="container mx-auto px-4 py-12">Error: {error || 'Course not found'}</div>
  }
  
  return <ClientCoursePage course={course} />
}

