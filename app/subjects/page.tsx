'use client';

import Link from "next/link"
import { getSubjects } from "../lib/api"
import { useEffect, useState } from "react"
import { Subject } from "@/app/types"

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const data = await getSubjects()
        setSubjects(data)
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Loading subjects...</div>
  }

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

