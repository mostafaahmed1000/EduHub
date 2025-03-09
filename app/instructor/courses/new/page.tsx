"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createCourse, getSubjects } from "../../../lib/api"

interface Subject {
  id: number;
  title: string;
}

const generateSlug = (title: string): string => {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function CreateCoursePage() {
  const router = useRouter()
  const { token } = useAuth()
  
  const [courseData, setCourseData] = useState({
    title: '',
    overview: '',
    subject: 0,
    image: null as File | null
  })
  
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects()
        setSubjects(response)
      } catch (error) {
        console.error('Failed to fetch subjects:', error)
      }
    }
    fetchSubjects()
  }, [])

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      const courseDataWithSlug = {
        ...courseData,
        slug: generateSlug(courseData.title),
        subject: String(courseData.subject)
      }
      const response = await createCourse(token, courseDataWithSlug)
      if (response && response.id) {
        router.replace(`/courses/${response.id}`)
      }
    } catch (error) {
      console.error('Failed to create course:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Create New Course</h1>
      
      <form onSubmit={handleCreateCourse} className="mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course Title</label>
            <Input
              value={courseData.title}
              onChange={(e) => setCourseData({...courseData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              value={courseData.subject}
              onChange={(e) => setCourseData({...courseData, subject: Number(e.target.value)})}
              className="w-full border rounded-md p-2"
              required
            >
              <option value={0}>Select a subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                setCourseData(prev => ({...prev, image: file || null}))
              }}
              className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended size: 1200x630 pixels
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Overview</label>
            <Textarea
              value={courseData.overview}
              onChange={(e) => setCourseData({...courseData, overview: e.target.value})}
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={!courseData.title || !courseData.subject || !courseData.overview}
          >
            Create Course
          </Button>
        </div>
      </form>
    </div>
  )
}