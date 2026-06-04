import { createClient } from '@supabase/supabase-js';
import { Project, ProjectFormData } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  uid: string;
  email: string | null;
}

// Auth functions
export async function loginAdmin(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Login failed');
  
  return {
    uid: data.user.id,
    email: data.user.email || null,
  };
}

export async function logoutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        uid: session.user.id,
        email: session.user.email || null,
      });
    } else {
      callback(null);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}

// Database functions
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw new Error(error.message);
  
  return data as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  
  return data as Project;
}

export async function addProject(data: ProjectFormData): Promise<string> {
  const now = new Date().toISOString();
  const { data: inserted, error } = await supabase
    .from('projects')
    .insert([{
      ...data,
      createdAt: now,
      updatedAt: now,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return inserted.id;
}

export async function updateProject(id: string, data: Partial<ProjectFormData>): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

// Storage functions
export async function uploadImage(file: File, path: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('portfolio-storage')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-storage')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function uploadVideo(file: File, path: string): Promise<string> {
  return uploadImage(file, path);
}

export async function deleteFile(url: string): Promise<void> {
  // Extract path from public URL
  // e.g. https://xyz.supabase.co/storage/v1/object/public/portfolio-storage/images/123.jpg
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/portfolio-storage/');
    if (pathParts.length > 1) {
      const filePath = pathParts[1];
      await supabase.storage.from('portfolio-storage').remove([filePath]);
    }
  } catch (err) {
    console.error('Error parsing file URL for deletion', err);
  }
}

// Demo data for development
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    title: 'SmartInvoice - Invoice Management System',
    summary: 'A comprehensive invoice management system with automated billing.',
    description: 'Built a full-featured invoice management system...',
    technologies: ['Flutter', 'Node.js', 'PostgreSQL'],
    features: ['Automated invoice generation'],
    challenges: ['Handling complex tax calculations'],
    solutions: ['Implemented a pluggable tax engine'],
    thumbnailUrl: '/images/project-placeholder.svg',
    screenshots: ['/images/project-placeholder.svg'],
    githubUrl: '',
    liveDemoUrl: '',
    videoUrl: '',
    videoPlatform: 'none',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
