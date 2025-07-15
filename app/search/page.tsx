'use client';

import { getCourses } from "../lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const allCourses = await getCourses()
        setCourses(allCourses)
        setFilteredCourses(
          allCourses.filter((course: { title: string }) =>
            course.title.toLowerCase().includes(query.toLowerCase())
          )
        )
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [query])

  if (loading) {
    return <div className="container mx-auto px-4 py-12">Searching...</div>
  }

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
                  <Link href={`/courses/${course.id}`}>Learn More</Link>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
}

