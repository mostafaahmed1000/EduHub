import { getCourses } from "../lib/api"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q
  const allCourses = await getCourses()
  const filteredCourses = allCourses.filter((course: { title: string }) =>
    course.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Search Results for "{query}"</h1>
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredCourses.map((course: { id: number; title: string; slug: string; owner: { id: number; username: string; full_name: string } }) => (
            <div key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
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
      ) : (
        <p className="text-xl">No courses found matching your search query.</p>
      )}
    </div>
  )
}

