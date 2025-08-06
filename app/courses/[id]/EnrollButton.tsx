"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { enrollCourse } from "@/app/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function EnrollButton({ courseId }: { courseId: number }) {
  const [isEnrolling, setIsEnrolling] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleEnroll = async () => {
    const token = localStorage.getItem("token")
    
    if (!token) {
      toast({
        title: "Please login",
        description: "You need to be logged in to enroll in a course",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      setIsEnrolling(true)
      await enrollCourse(courseId, token)
      toast({
        title: "Success!",
        description: "You have successfully enrolled in this course",
      })
      router.push(`/courses/${courseId}`)
    } catch (error) {
      toast({
        title: "Failed to enroll",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <Button 
      onClick={handleEnroll} 
      disabled={isEnrolling}
    >
      {isEnrolling ? "Enrolling..." : "Enroll Now"}
    </Button>
  )
}

