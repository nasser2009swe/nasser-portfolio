'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { useI18n } from '@/context/I18nContext';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { t, isRTL } = useI18n();

  if (!images || images.length === 0) {
    return (
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-12 text-center">
        <FiImage className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
        <p className="text-zinc-500 text-sm">{t('gallery.noImages')}</p>
      </div>
    );
  }

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openLightbox(index)}
            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-zinc-800"
          >
            <Image
              src={image}
              alt={`Screenshot ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                {t('gallery.view')}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
              aria-label={t('gallery.close')}
            >
              <FiX size={24} />
            </button>

            {/* Previous button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className={`absolute ${isRTL ? 'right-4' : 'left-4'} text-white/60 hover:text-white transition-colors z-10`}
                aria-label={t('gallery.previous')}
              >
                {isRTL ? <FiChevronRight size={32} /> : <FiChevronLeft size={32} />}
              </button>
            )}

            {/* Image */}
            <div
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`Screenshot ${selectedIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className={`absolute ${isRTL ? 'left-4' : 'right-4'} text-white/60 hover:text-white transition-colors z-10`}
                aria-label={t('gallery.next')}
              >
                {isRTL ? <FiChevronLeft size={32} /> : <FiChevronRight size={32} />}
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 text-white/60 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
