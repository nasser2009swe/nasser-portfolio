'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLogOut,
  FiExternalLink,
  FiGithub,
  FiFolder,
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { ProjectForm } from './ProjectForm';
import { Project, ProjectFormData } from '@/types';
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  DEMO_PROJECTS,
} from '@/lib/firebase';
import { Skeleton, AdminTableSkeleton } from '@/components/ui/Skeleton';
import { useI18n } from '@/context/I18nContext';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    async function loadProjects() {
      try {
        const fetched = await getProjects();
        setProjects(fetched);
      } catch (error) {
        console.warn('Firestore not available, loading demo projects:', error);
        setProjects(DEMO_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleCreate = async (data: ProjectFormData) => {
    try {
      const newId = await addProject(data);
      const newProject: Project = {
        id: newId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProject]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdate = async (data: ProjectFormData) => {
    if (!editingProject) return;
    try {
      await updateProject(editingProject.id, data);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? { ...p, ...data, updatedAt: new Date().toISOString() }
            : p
        )
      );
      setEditingProject(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm h-16" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <AdminTableSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FiFolder className="text-blue-400" size={24} />
              <h1 className="text-xl font-bold text-white">
                {t('admin.dashboard')}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <FiExternalLink size={16} />
                {t('admin.viewSite')}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
              >
                <FiLogOut className="mr-2" size={16} />
                {t('admin.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {t('admin.projectsCount', { count: projects.length })}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {t('admin.manageProjects')}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
          >
            <FiPlus className="mr-2" size={16} />
            {t('admin.addProject')}
          </Button>
        </div>

        {/* Project Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
            >
              <div className="min-h-screen py-8 px-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {editingProject ? t('admin.editProject') : t('admin.newProject')}
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProject(null);
                      }}
                    >
                      {t('admin.cancel')}
                    </Button>
                  </div>
                  <ProjectForm
                    project={editingProject}
                    onSubmit={editingProject ? handleUpdate : handleCreate}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingProject(null);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                    {project.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs bg-zinc-800 text-zinc-400 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={project.githubUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                    title={t('admin.github')}
                  >
                    <FiGithub size={18} />
                  </a>
                  <a
                    href={project.liveDemoUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                    title={t('admin.liveDemo')}
                  >
                    <FiExternalLink size={18} />
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProject(project);
                      setShowForm(true);
                    }}
                  >
                    <FiEdit2 size={16} />
                  </Button>
                  {deleteConfirm === project.id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        {t('admin.confirm')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        {t('admin.cancel')}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(project.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
