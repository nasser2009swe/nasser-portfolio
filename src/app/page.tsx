'use client';

import React from 'react';
import { Hero } from '@/components/home/Hero';
import { ProjectsGrid } from '@/components/home/ProjectsGrid';
import { Skills } from '@/components/home/Skills';
import { Contact } from '@/components/home/Contact';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 pt-20">
      <Hero />
      <ProjectsGrid />
      <Skills />
      <Contact />
    </main>
  );
}
