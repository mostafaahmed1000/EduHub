import { getSubject } from "../../lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { Course, Subject } from "@/app/types"

export default async function SubjectCoursesPage({ params }: { params: { id: string } }) {
  let subject: Subject | null = null;

  try {
    const data = await getSubject(Number.parseInt(params.id))
    console.log('Subject data:', JSON.stringify(data, null, 2))
    
    // Ensure we have the correct data structure
    subject = {
      id: data.id,
      title: data.title,
      slug: data.slug,
      courses: Array.isArray(data.courses) ? data.courses : []
    }

    if (!subject) {
      notFound()
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
                    <Link href={`/eduhub/courses/${course.id}`}>Learn More</Link>
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
  } catch (error) {
    console.error('Error loading subject:', error)
    throw error
  }
}

