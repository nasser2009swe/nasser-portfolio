'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiGithub,
  FiExternalLink,
  FiCalendar,
  FiCode,
  FiStar,
  FiAlertTriangle,
  FiCheckCircle,
} from 'react-icons/fi';
import { Project } from '@/types';
import { getProject, DEMO_PROJECTS } from '@/lib/firebase';
import { VideoEmbed } from '@/components/projects/VideoEmbed';
import { ImageGallery } from '@/components/projects/ImageGallery';
import { formatDate } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export default function ProjectDetailPage() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();

  useEffect(() => {
    async function loadProject() {
      try {
        const projectId = params.id as string;
        // Try loading from Firestore first
        try {
          const firestoreProject = await getProject(projectId);
          if (firestoreProject) {
            setProject(firestoreProject);
            return;
          }
        } catch {
          // Firestore not available, fall through to demo projects
        }
        // Fall back to demo projects
        const data = DEMO_PROJECTS.find((p) => p.id === projectId);
        setProject(data || null);
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [params.id]);

  if (loading) {
    return (<div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
    );
  }

  if (!project) {
    return (<div className="min-h-screen bg-zinc-950 pt-20 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                {t('projectDetail.notFound')}
              </h1>
              <Link
                href="/"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                &larr; {t('projectDetail.back')}
              </Link>
            </div>
          </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pt-20">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <FiArrowLeft size={16} className="rtl:rotate-180" />
          {t('projectDetail.back')}
        </Link>
      </div>

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed">
                {project.summary}
              </p>
            </motion.div>

            {/* Video Section */}
            {project.videoPlatform !== 'none' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('projectDetail.demoVideo')}
                </h2>
                <VideoEmbed
                  url={project.videoUrl}
                  platform={project.videoPlatform}
                />
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {t('projectDetail.about')}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiStar className="text-yellow-400" />
                {t('projectDetail.features')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
                  >
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Challenges & Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* Challenges */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiAlertTriangle className="text-orange-400" />
                  {t('projectDetail.challenges')}
                </h2>
                <ul className="space-y-3">
                  {project.challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10"
                    >
                      <FiAlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={14} />
                      <span className="text-sm text-zinc-300">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <FiCheckCircle className="text-green-400" />
                  {t('projectDetail.solutions')}
                </h2>
                <ul className="space-y-3">
                  {project.solutions.map((solution, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10"
                    >
                      <FiCheckCircle className="text-green-400 shrink-0 mt-0.5" size={14} />
                      <span className="text-sm text-zinc-300">{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Screenshots Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                {t('projectDetail.screenshots')}
              </h2>
              <ImageGallery images={project.screenshots} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-800/50">
              {project.thumbnailUrl ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 text-sm">
                  No image available
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {t('projectDetail.quickInfo')}
              </h3>

              {/* Technologies */}
              <div>
                <h4 className="text-sm text-zinc-500 mb-2 flex items-center gap-2">
                  <FiCode size={14} />
                  {t('projectDetail.technologies')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <FiCalendar size={14} />
                {t('projectDetail.created')} {formatDate(project.createdAt, locale)}
              </div>
            </div>

            {/* Links */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">
                {t('projectDetail.links')}
              </h3>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-all text-sm text-zinc-300 hover:text-white group"
                >
                  <span className="flex items-center gap-2">
                    <FiGithub size={16} />
                    {t('projectDetail.github')}
                  </span>
                  <FiExternalLink
                    size={14}
                    className="text-zinc-500 group-hover:text-white transition-colors"
                  />
                </a>
              )}
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl hover:from-blue-600/30 hover:to-purple-600/30 transition-all text-sm text-zinc-300 hover:text-white group"
                >
                  <span className="flex items-center gap-2">
                    <FiExternalLink size={16} />
                    {t('projectDetail.liveDemo')}
                  </span>
                  <FiExternalLink
                    size={14}
                    className="text-blue-400 group-hover:text-white transition-colors"
                  />
                </a>
              )}
            </div>
          </motion.aside>
        </div>
      </article>
    </main>
  );
}
