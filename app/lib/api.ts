import { Course } from '@/app/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://51.20.193.62/educa/api"

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials,
  }

  const res = await fetch(`${API_URL}${endpoint}`, config)

  if (!res.ok) {
    const errorData = await res.text()
    throw new Error(`API error: ${res.status} - ${errorData}`)
  }

  return res.json()
}

export async function login(username: string, password: string) {
  const response = await fetchAPI("/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
  
  // Store token in localStorage
  if (response.token) {
    localStorage.setItem('token', response.token)
  }
  
  return response
}

export async function signup(username: string, password: string, email: string) {
  return fetchAPI("/signup/", {
    method: "POST",
    body: JSON.stringify({ username, password, email }),
  })
}

export async function getSubjects() {
  return fetchAPI("/subjects")
}

export async function getSubject(id: number) {
  const response = await fetchAPI(`/subjects/${id}/`)
  return response
}

export async function getCourses() {
  return fetchAPI("/courses")
}
export async function getCourse(id: number) {
  return fetchAPI(`/courses/${id}`)
}

export async function enrollCourse(id: number, token: string) {
  const newEnrollment = {
    course_id: id,
  }
  await fetchAPI(`/courses/${id}/enroll/`, {
    method: "POST",
    body: JSON.stringify(newEnrollment),
    headers: {
      Authorization: `Token ${token}`,
    },
  })
  return { enrolled: true }
}

export async function getEnrolledCourses(token: string) {
  return fetchAPI("/courses/enrolled/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}


export async function getOwnedCourses(token: string) {
  return fetchAPI("/courses/owned-courses/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export const createCourse = async (
  token: string, 
  courseData: Omit<Course, 'id' | 'created' | 'owner' | 'modules'> & { image?: File }
) => {
  const formData = new FormData();
  
  // Add basic course data
  formData.append('title', courseData.title);
  formData.append('overview', courseData.overview);
  formData.append('subject', courseData.subject.toString());
  
  // Add image if provided
  if (courseData.image) {
    formData.append('image', courseData.image);
  }

  const response = await fetch(`${API_URL}/courses/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`
    },
    body: formData
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  
  return await response.json();
};

export const addModule = async (token: string, moduleData: {
  title: string;
  description: string;
  course_id: number;
}) => {
  const response = await fetch(`${API_URL}/courses/${moduleData.course_id}/add-module/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(moduleData)
  });
  return await response.json();
};

export const addContent = async (token: string, moduleId: number, data: {
  content_type: 'text' | 'file' | 'video' | 'image';
  title: string;
  text?: string;
  url?: string;  // Changed from video to url
  file?: File;
  image?: File;
}) => {
  let response;
  
  if (data.content_type === 'image') {
    const formData = new FormData();
    formData.append('content_type', data.content_type);
    formData.append('title', data.title);
    formData.append('image', data.image!);
    formData.append('module', moduleId.toString());  // Add module ID

    response = await fetch(`${API_URL}/modules/${moduleId}/contents/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
  } else if (data.content_type === 'file') {
    const formData = new FormData();
    formData.append('content_type', data.content_type);
    formData.append('title', data.title);
    formData.append('file', data.file!);
    formData.append('module', moduleId.toString());  // Add module ID

    response = await fetch(`${API_URL}/modules/${moduleId}/contents/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
  } else {
    // Handle text and video content types
    const requestData = {
      content_type: data.content_type,
      title: data.title,
      module: moduleId,  // Add module ID
      ...(data.content_type === 'text' ? { text: data.text } :
        data.content_type === 'video' ? { url: data.url } : {})  // Changed from video to url
    };

    response = await fetch(`${API_URL}/modules/${moduleId}/contents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(requestData)
    });
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  return response.json();
};

export const updateContent = async (token: string, contentId: number, data: {
  content_type: 'text' | 'file' | 'video';
  text?: { title: string; content: string };
  video?: { title: string; url: string };
  file?: { title: string; file: File };
}) => {
  let response;
  
  if (data.content_type === 'file') {
    const formData = new FormData();
    formData.append('content_type', data.content_type);
    formData.append('file[title]', data.file!.title);
    formData.append('file[file]', data.file!.file);

    response = await fetch(`${API_URL}/contents/${contentId}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: formData
    });
  } else {
    response = await fetch(`${API_URL}/contents/${contentId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    });
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }
  return response.json();
};

export const deleteContent = async (token: string, contentId: number) => {
  const response = await fetch(`${API_URL}/contents/${contentId}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete content');
  }
  return true;
};

export async function updateCourse(
  id: number,
  data: { subject?: number; title?: string; overview?: string },
  token: string,
) {
  return fetchAPI(`/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function retrieveOwnedCourse(id: number, token: string) {
  return fetchAPI(`/courses/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
}

export async function getCourseContents(courseId: number, token: string) {
  try {
    return await fetchAPI(`/courses/${courseId}/contents/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      return null // User is not enrolled
    }
    throw error
  }
}

export const removeModule = async (token: string, courseId: number, moduleId: number) => {
  const response = await fetch(`${API_URL}/courses/${courseId}/remove-module/${moduleId}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    }
  });
  if (!response.ok) {
    throw new Error('Failed to remove module');
  }
  return true;
};

