export interface Course {
  id: number;
  title: string;
  slug: string;
  overview: string;
  subject: string;
  created: string;
  image: string;
  owner: {
    id: number;
    full_name: string;
  };
  modules: Module[];
}

export interface Module {
  id: number;
  order: number;
  title: string;
  description: string;
  contents?: Content[];
}

export interface Content {
  id: number;
  order: number;
  item: string;
  title?: string;
  content_type?: 'text' | 'file' | 'image' | 'video';
  url?: string;
  module_id?: number;
}

export interface CourseDetail {
  id: number;
  subject: number;
  title: string;
  slug: string;
  overview: string;
  created: string;
  owner: {
    id: number;
    username: string;
    full_name: string;
  };
  modules: Module[];
} 