'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  SiFlutter,
  SiDart,
  SiFirebase,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFigma,
  SiAndroid,
  SiApple,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { useI18n } from '@/context/I18nContext';

const skills = [
  { name: 'Flutter', icon: SiFlutter, color: 'text-cyan-400' },
  { name: 'Dart', icon: SiDart, color: 'text-sky-400' },
  { name: 'Firebase', icon: SiFirebase, color: 'text-yellow-500' },
  { name: 'Node.js', icon: SiNodedotjs, color: 'text-green-500' },
  { name: 'React', icon: SiReact, color: 'text-blue-400' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'text-white' },
  { name: 'TypeScript', icon: SiTypescript, color: 'text-blue-500' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: 'text-blue-400' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
  { name: 'Redis', icon: SiRedis, color: 'text-red-500' },
  { name: 'Docker', icon: SiDocker, color: 'text-blue-600' },
  { name: 'AWS', icon: FaAws, color: 'text-orange-400' },
  { name: 'Android', icon: SiAndroid, color: 'text-green-500' },
  { name: 'iOS', icon: SiApple, color: 'text-white' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-cyan-400' },
  { name: 'Figma', icon: SiFigma, color: 'text-purple-400' },
];

export function Skills() {
  const { t } = useI18n();

  return (
    <section id="skills" className="py-20 sm:py-32 relative">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('skills.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {t('skills.highlight')}
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            {t('skills.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="group flex flex-col items-center gap-3 p-4 sm:p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300"
            >
              <skill.icon
                className={`w-8 h-8 sm:w-10 sm:h-10 ${skill.color} transition-transform duration-300 group-hover:scale-110`}
              />
              <span className="text-xs sm:text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors text-center">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
