export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  thumbnailUrl: string;
  screenshots: string[];
  githubUrl: string;
  liveDemoUrl: string;
  videoUrl: string;
  videoPlatform: 'youtube' | 'facebook' | 'local' | 'none';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  title: string;
  summary: string;
  description: string;
  technologies: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  thumbnailUrl: string;
  screenshots: string[];
  githubUrl: string;
  liveDemoUrl: string;
  videoUrl: string;
  videoPlatform: 'youtube' | 'facebook' | 'local' | 'none';
  order: number;
}

export interface AdminUser {
  email: string;
  uid: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}
