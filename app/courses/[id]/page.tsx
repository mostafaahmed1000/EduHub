import { getCourse } from "../../lib/api"
import ClientCoursePage from "./ClientCoursePage"

export default async function CoursePage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id)
  const course = await getCourse(courseId)
  
  return <ClientCoursePage course={course} />
}

