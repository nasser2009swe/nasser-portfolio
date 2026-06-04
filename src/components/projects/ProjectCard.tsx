'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-blue-500/5 h-full"
      >
        {/* Thumbnail */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-zinc-800">
          {project.thumbnailUrl ? (
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-zinc-600 text-sm">No image</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tech badges */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {(project.technologies || []).slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-black/60 backdrop-blur-sm text-zinc-300 rounded-full"
              >
                {tech}
              </span>
            ))}
            {(project.technologies || []).length > 3 && (
              <span className="px-2 py-0.5 text-xs bg-black/60 backdrop-blur-sm text-zinc-400 rounded-full">
                +{(project.technologies || []).length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Links */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-zinc-800">
            {project.githubUrl && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <FiGithub size={14} />
                GitHub
              </span>
            )}
            {project.liveDemoUrl && (
              <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                <FiExternalLink size={14} />
                Live Demo
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
