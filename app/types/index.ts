export interface Instructor {
  id: number
  username: string
  full_name: string
}

export interface Course {
  id: number
  title: string
  slug: string
  image: string
  overview?: string
  owner: Instructor
}

export interface Subject {
  id: number
  title: string
  slug: string
  courses: Course[]
}

export interface ContentItem {
  order: number;
  item: string;
}

export interface Module {
  order: number;
  title: string;
  description: string;
  contents: ContentItem[];
}

export interface CourseDetail extends Course {
  modules: Module[];
}
