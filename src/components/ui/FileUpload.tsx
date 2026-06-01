'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

interface FileUploadProps {
  onUpload: (file: File) => Promise<string>;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Upload file',
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const { t } = useI18n();

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setSuccess(false);

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(t('fileUpload.error.size', { size: maxSizeMB }));
      return;
    }

    if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
      setError(t('fileUpload.error.type'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreview(objectUrl);

    setUploading(true);
    try {
      const url = await onUpload(file);
      setPreview(url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'));
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onUpload, accept, maxSizeMB, t]);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-zinc-300">{label}</label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          'relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center',
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : preview
            ? 'border-green-500/50 bg-green-500/5'
            : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-zinc-400">{t('fileUpload.uploading')}</p>
            </motion.div>
          ) : preview && success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <FiCheck className="text-green-400" size={20} />
              </div>
              <p className="text-sm text-green-400">{t('fileUpload.uploaded')}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                {t('fileUpload.remove')}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <FiUploadCloud
                className={isDragging ? 'text-blue-400' : 'text-zinc-500'}
                size={32}
              />
              <div>
                <p className="text-sm text-zinc-400">
                  <span className="text-blue-400 font-medium">
                    {t('fileUpload.clickToUpload')}
                  </span>{' '}
                  {t('fileUpload.dragAndDrop')}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {accept === 'image/*' ? 'PNG, JPG, WebP up to ' : ''}{maxSizeMB}MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-2 text-sm text-red-400 bg-red-500/10 rounded-lg"
          >
            <FiAlertCircle size={14} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
