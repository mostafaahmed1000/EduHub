'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Home() {
  const [courses, setCourses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = ""
        const coursesRes = await fetch(`${baseUrl}/api/courses/`, { 
          signal: AbortSignal.timeout(30000) // 30 seconds timeout
        })
        const subjectsRes = await fetch(`${baseUrl}/api/subjects/`, { 
          signal: AbortSignal.timeout(30000) // 30 seconds timeout
        })
        
        if (coursesRes.ok && subjectsRes.ok) {
          const coursesData = await coursesRes.json()
          const subjectsData = await subjectsRes.json()
          setCourses(coursesData)
          setSubjects(subjectsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to EduHub</h1>
        <p className="text-xl mb-8">Discover, Learn, and Grow with Our Wide Range of Courses</p>
        <Button asChild>
          <Link href="/courses">Explore Courses</Link>
        </Button>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.slice(-3).reverse().map((course: any) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-48">
              {course.image && (
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <Button variant="outline" asChild>
                  <Link href={`/courses/${course.id}`}>Learn More</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8">Popular Subjects</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {subjects.map((subject: any) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="bg-blue-100 text-blue-800 rounded-lg p-6 text-center hover:bg-blue-200 transition-colors"
            >
              {subject.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

