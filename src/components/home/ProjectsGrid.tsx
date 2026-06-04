'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects, DEMO_PROJECTS } from '@/lib/supabase';
import { useI18n } from '@/context/I18nContext';

interface ProjectsGridProps {
  projects?: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [displayProjects, setDisplayProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    async function loadProjects() {
      try {
        if (projects) {
          setDisplayProjects(projects);
        } else {
          const fetched = await getProjects();
          if (fetched.length > 0) {
            setDisplayProjects(fetched);
          } else {
            setDisplayProjects(DEMO_PROJECTS);
          }
        }
      } catch (error) {
        console.warn('Could not load from Firestore, using demo projects:', error);
        setDisplayProjects(DEMO_PROJECTS);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [projects]);

  if (loading) {
    return (
      <section id="projects" className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 sm:py-32 relative">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('projects.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {t('projects.highlight')}
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
