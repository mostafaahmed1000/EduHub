'use client'

import { useEffect, useState } from 'react'
import { getCourseContents, getEnrolledCourses, addModule, removeModule, addContent, deleteContent } from "@/app/lib/api"
import CourseContent from "@/app/components/CourseContent"
import EnrollButton from "./EnrollButton"
import { Course, CourseDetail } from "@/app/types"
import { useAuth } from "@/app/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import parse from 'html-react-parser'
import { API_ENDPOINT } from '@/app/config'

interface ModuleForm {
  title: string;
  description: string;
}

interface ContentForm {
  content_type: 'text' | 'file' | 'video' | 'image';
  title: string;
  text?: string;
  url?: string;  // Changed from video to url
  file?: File;
  image?: File;
}

const transformContent = (content: string) => {
  // Transform src and href attributes to include API_ENDPOINT
  return content.replace(
    /(src|href)="(\/media\/[^"]*)/g,
    `$1="${API_ENDPOINT}$2`
  );
};

export default function ClientCoursePage({ course }: { course: Course }) {
  const [courseDetails, setCourseDetails] = useState<CourseDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const { user } = useAuth()
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [moduleForm, setModuleForm] = useState<ModuleForm>({
    title: '',
    description: ''
  })
  const [showContentForm, setShowContentForm] = useState<number | null>(null)
  const [contentForm, setContentForm] = useState<ContentForm>({
    content_type: 'text',
    title: '',
    text: '',
    url: '',  // Changed from video to url
    file: undefined,
    image: undefined
  })
  const [editingContentId, setEditingContentId] = useState<number | null>(null)

  const isOwner = user && course.owner.id === user.id
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      if (isOwner) {
        // If user is owner, directly fetch course contents
        getCourseContents(course.id, token)
          .then(response => {
            if (response) {
              setCourseDetails(response)
              console.log(response)
            }
          })
          .catch(error => console.error('Error:', error))
          .finally(() => setIsLoading(false))
      } else {
        // Check enrollment for non-owners
        getEnrolledCourses(token)
          .then(response => {
            const enrolled = response.some(
              (enrolledCourse: Course) => enrolledCourse.id === course.id
            )
            setIsEnrolled(enrolled)
            
            if (enrolled) {
              return getCourseContents(course.id, token)
            }
            return null
          })
          .then(response => {
            if (response) {
              setCourseDetails(response)
            }
          })
          .catch(error => console.error('Error:', error))
          .finally(() => setIsLoading(false))
      }
    } else {
      setIsLoading(false)
    }
  }, [course.id, isOwner])

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await addModule(token, {
        title: moduleForm.title,
        description: moduleForm.description,
        course_id: course.id
      })

      // Update courseDetails with new module
      setCourseDetails(prev => prev ? {
        ...prev,
        modules: [...prev.modules, response]
      } : null)

      // Reset form
      setModuleForm({ title: '', description: '' })
      setShowModuleForm(false)
    } catch (error) {
      console.error('Failed to add module:', error)
    }
  }

  const handleRemoveModule = async (moduleId: number) => {
    const token = localStorage.getItem('token')
    if (!token || !moduleId) return

    try {
      await removeModule(token, course.id, moduleId)
      setCourseDetails(prev => prev ? {
        ...prev,
        modules: prev.modules.filter(m => m.id !== moduleId)
      } : null)
    } catch (error) {
      console.error('Failed to remove module:', error)
    }
  }

  // Add refresh function
  const refreshCourseContent = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await getCourseContents(course.id, token)
        if (response) {
          setCourseDetails(response)
        }
      } catch (error) {
        console.error('Error refreshing content:', error)
      }
    }
  }

  // Modify handleAddContent to refresh after adding content
  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await addContent(token, showContentForm!, {
        content_type: contentForm.content_type,
        title: contentForm.title,
        ...(contentForm.content_type === 'text' ? { text: contentForm.text } :
          contentForm.content_type === 'video' ? { url: contentForm.url } :  // Changed from video to url
          contentForm.content_type === 'file' ? { file: contentForm.file } :
          contentForm.content_type === 'image' ? { image: contentForm.image } :
          {})
      });

      // Reset form
      setContentForm({
        content_type: 'text',
        title: '',
        text: '',
        url: '',  // Changed from video to url
        file: undefined,
        image: undefined
      });

      // Refresh content
      await refreshCourseContent();
    } catch (error) {
      console.error('Failed to add content:', error);
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await deleteContent(token, contentId);
      setCourseDetails(prev => {
        if (!prev) return null;
        return {
          ...prev,
          modules: prev.modules.map(module => ({
            ...module,
            contents: module.contents?.filter(c => c.id !== contentId)
          }))
        };
      });
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{course.title}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructor</h2>
        <p className="text-gray-600">{course.owner.full_name}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Course Description</h2>
        <p className="text-gray-600">{course.overview}</p>
      </div>
      
      {isOwner ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Course Modules</h2>
            <Button onClick={() => setShowModuleForm(!showModuleForm)}>
              {showModuleForm ? 'Cancel' : 'Add Module'}
            </Button>
          </div>

          {showModuleForm && (
            <form onSubmit={handleAddModule} className="bg-white shadow-md rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Module Title</label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit">Create Module</Button>
            </form>
          )}

          {courseDetails?.modules.map(module => (
            <div key={module.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{module.title}</h3>
                  <p className="text-gray-600">{module.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleRemoveModule(module.id)}
                  >
                    Remove Module
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowContentForm(showContentForm === module.id ? null : module.id)}
                  >
                    {showContentForm === module.id ? 'Cancel' : 'Add Content'}
                  </Button>
                </div>
              </div>

              {showContentForm === module.id && (
                <form onSubmit={handleAddContent} className="mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Content Type</label>
                    <select
                      value={contentForm.content_type}
                      onChange={(e) => {
                        const type = e.target.value as 'text' | 'file' | 'video' | 'image';
                        setContentForm({
                          content_type: type,
                          title: '',
                          text: '',
                          url: '',  // Changed from video to url
                          file: null,
                          image: null
                        });
                      }}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="text">Text</option>
                      <option value="file">File</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={contentForm.title}
                      onChange={(e) => setContentForm(prev => ({
                        ...prev,
                        title: e.target.value
                      }))}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {contentForm.content_type === 'video' ? 'Video URL' :
                       contentForm.content_type === 'image' ? 'Image' : 'Content'}
                    </label>
                    {contentForm.content_type === 'text' ? (
                      <Textarea
                        value={contentForm.text}
                        onChange={(e) => setContentForm(prev => ({
                          ...prev,
                          text: e.target.value
                        }))}
                        required
                      />
                    ) : contentForm.content_type === 'video' ? (
                      <Input
                        type="url"
                        value={contentForm.url}
                        onChange={(e) => setContentForm(prev => ({
                          ...prev,
                          url: e.target.value
                        }))}
                        required
                      />
                    ) : contentForm.content_type === 'image' ? (
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setContentForm(prev => ({
                              ...prev,
                              image: file
                            }));
                          }
                        }}
                        accept="image/*"
                        required
                      />
                    ) : (
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setContentForm(prev => ({
                              ...prev,
                              file: file
                            }));
                          }
                        }}
                        required
                      />
                    )}
                  </div>

                  <Button type="submit">Add Content</Button>
                </form>
              )}

              {module.contents?.map(content => (
                <div key={content.id} className="border-t pt-4 flex justify-between items-start">
                  <div className="prose max-w-none">
                    {content.item && (
                      <div dangerouslySetInnerHTML={{ __html: transformContent(content.item) }} />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteContent(content.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : isEnrolled ? (
        <CourseContent modules={courseDetails?.modules || []} />
      ) : (
        <EnrollButton courseId={course.id} />
      )}
    </div>
  )
}
