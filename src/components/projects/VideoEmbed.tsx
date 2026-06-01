'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';

interface VideoEmbedProps {
  url: string;
  platform: 'youtube' | 'facebook' | 'local' | 'none';
}

export function VideoEmbed({ url, platform }: VideoEmbedProps) {
  const { t } = useI18n();

  if (!url || platform === 'none') {
    return (
      <div className="aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-zinc-800 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-zinc-500">{t('video.noVideo')}</p>
        </div>
      </div>
    );
  }

  const getEmbedUrl = () => {
    if (platform === 'youtube') {
      const match = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
      );
      return match
        ? `https://www.youtube.com/embed/${match[1]}`
        : null;
    }
    if (platform === 'facebook') {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
    }
    return null;
  };

  const embedUrl = getEmbedUrl();

  if (platform === 'local') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800"
      >
        <video
          controls
          className="w-full h-full object-cover"
          poster="/images/video-placeholder.svg"
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
        <p className="text-zinc-500 text-sm">{t('video.invalidUrl')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800"
    >
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={t('projectDetail.demoVideo')}
      />
    </motion.div>
  );
}
