'use client';

import { getSubject } from "../../lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Course, Subject } from "@/app/types"

export default function SubjectCoursesPage({ params }: { params: { id: string } }) {
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSubject() {
      try {
        const data = await getSubject(Number.parseInt(params.id))
        
        // Ensure we have the correct data structure
        setSubject({
          id: data.id,
          title: data.title,
          slug: data.slug,
          courses: Array.isArray(data.courses) ? data.courses : []
        })
      } catch (error) {
        console.error('Error loading subject:', error)
        setError('Failed to load subject data')
      } finally {
        setLoading(false)
      }
    }

    fetchSubject()
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading subject...</div>
  }

  if (error || !subject) {
    return <div className="container mx-auto px-4 py-12">Error: {error || 'Subject not found'}</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{subject.title} Courses</h1>
      {Array.isArray(subject.courses) && subject.courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subject.courses.map((course) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">
                  Instructor: {course.owner?.full_name || course.owner?.username}
                </p>
                <Button variant="outline" asChild>
                  <Link href={`/courses/${course.id}`}>Learn More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl">No courses available for this subject yet.</p>
      )}
    </div>
  )
}

