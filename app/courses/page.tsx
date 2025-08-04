import Link from "next/link"
import { getCourses } from "../lib/api"
import { Button } from "@/components/ui/button"
import { Course } from "@/app/types"

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map((course: { id: number; title: string; slug: string; owner: { id: number; username: string; full_name: string } }) => (
          <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
           
              <div className="bg-gray-200 h-48">
              {course.image && (
              <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            )}
                </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">Instructor: {course.owner.full_name}</p>
              <Button variant="outline" asChild>
          <Link href={`/eduhub/courses/${course.id}`}>Learn More</Link>
              </Button>
            </div>
          </div>
        ))}
            </div>
          </div>
        )}
     

