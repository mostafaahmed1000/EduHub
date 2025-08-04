import Link from "next/link"
import { getSubjects } from "../lib/api"

export default async function SubjectsPage() {
  const subjects = await getSubjects()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((subject: { id: number; title: string; slug: string }) => (
          <Link
            key={subject.id}
            href={`/subjects/${subject.id}`}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{subject.title}</h2>
            <p className="text-blue-600">Explore courses &rarr;</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

