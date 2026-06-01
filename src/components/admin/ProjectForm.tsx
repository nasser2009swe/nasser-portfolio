'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiSave, FiX, FiLink } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input, TextArea } from '@/components/ui/Input';
import { FileUpload } from '@/components/ui/FileUpload';
import { ProjectFormData, Project } from '@/types';
import { uploadImageLocally } from '@/lib/local-upload';
import { useI18n } from '@/context/I18nContext';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({
  project,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: project?.title || '',
    summary: project?.summary || '',
    description: project?.description || '',
    technologies: project?.technologies || [],
    features: project?.features || [],
    challenges: project?.challenges || [],
    solutions: project?.solutions || [],
    thumbnailUrl: project?.thumbnailUrl || '',
    screenshots: project?.screenshots || [],
    githubUrl: project?.githubUrl || '',
    liveDemoUrl: project?.liveDemoUrl || '',
    videoUrl: project?.videoUrl || '',
    videoPlatform: project?.videoPlatform || 'none',
    order: project?.order || 0,
  });

  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newScreenshot, setNewScreenshot] = useState('');
  const [saving, setSaving] = useState(false);
  const { t } = useI18n();

  const addItem = (
    field: 'technologies' | 'features' | 'challenges' | 'solutions',
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter('');
    }
  };

  const removeItem = (
    field: 'technologies' | 'features' | 'challenges' | 'solutions',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleThumbnailUpload = async (file: File): Promise<string> => {
    const url = await uploadImageLocally(file, 'thumbnails');
    setFormData((prev) => ({ ...prev, thumbnailUrl: url }));
    return url;
  };

  const handleScreenshotUpload = async (file: File): Promise<string> => {
    const url = await uploadImageLocally(file, 'screenshots');
    setFormData((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, url],
    }));
    return url;
  };

  const addScreenshotUrl = () => {
    if (newScreenshot.trim()) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, newScreenshot.trim()],
      }));
      setNewScreenshot('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          {t('admin.form.basicInfo')}
        </h3>
        <Input
          label={t('admin.form.projectTitle')}
          placeholder={t('admin.form.placeholderTitle')}
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <TextArea
          label={t('admin.form.summary')}
          placeholder={t('admin.form.placeholderSummary')}
          value={formData.summary}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, summary: e.target.value }))
          }
          required
          rows={3}
        />
        <TextArea
          label={t('admin.form.fullDescription')}
          placeholder={t('admin.form.placeholderDescription')}
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          rows={6}
        />
      </div>

      {/* Technologies */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          {t('admin.form.technologies')}
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder={t('admin.form.placeholderAddTech')}
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('technologies', newTech, setNewTech);
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => addItem('technologies', newTech, setNewTech)}
            className="shrink-0"
          >
            <FiPlus size={16} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeItem('technologies', index)}
                className="hover:text-red-400 transition-colors"
              >
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Features, Challenges, Solutions */}
      {([
        { field: 'features' as const, label: t('admin.form.features'), placeholder: t('admin.form.placeholderAddFeature'), dotClass: 'bg-green-400' },
        { field: 'challenges' as const, label: t('admin.form.challenges'), placeholder: t('admin.form.placeholderAddChallenge'), dotClass: 'bg-orange-400' },
        { field: 'solutions' as const, label: t('admin.form.solutions'), placeholder: t('admin.form.placeholderAddSolution'), dotClass: 'bg-emerald-400' },
      ]).map(({ field, label, placeholder, dotClass }) => (
        <div
          key={field}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {label}
          </h3>
          <div className="flex gap-2">
            <Input
              placeholder={placeholder}
              value={
                field === 'features'
                  ? newFeature
                  : field === 'challenges'
                  ? newChallenge
                  : newSolution
              }
              onChange={(e) => {
                const setter =
                  field === 'features'
                    ? setNewFeature
                    : field === 'challenges'
                    ? setNewChallenge
                    : setNewSolution;
                setter(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const setter =
                    field === 'features'
                      ? setNewFeature
                      : field === 'challenges'
                      ? setNewChallenge
                      : setNewSolution;
                  addItem(field, e.currentTarget.value, setter);
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const [value, setter] =
                  field === 'features'
                    ? [newFeature, setNewFeature]
                    : field === 'challenges'
                    ? [newChallenge, setNewChallenge]
                    : [newSolution, setNewSolution];
                addItem(field, value, setter);
              }}
              className="shrink-0"
            >
              <FiPlus size={16} />
            </Button>
          </div>
          <ul className="space-y-2">
            {formData[field].map((item: string, index: number) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 rounded-lg text-zinc-300 text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(field, index)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <FiTrash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Thumbnail Upload */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          {t('admin.form.thumbnail')}
        </h3>
        <FileUpload
          onUpload={handleThumbnailUpload}
          accept="image/*"
          maxSizeMB={5}
          label={t('admin.form.uploadThumbnail')}
        />
        {formData.thumbnailUrl && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <FiLink size={12} />
            <span className="truncate">{formData.thumbnailUrl}</span>
          </div>
        )}
      </div>

      {/* Screenshots Upload */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          {t('admin.form.screenshots')}
        </h3>
        <FileUpload
          onUpload={handleScreenshotUpload}
          accept="image/*"
          maxSizeMB={5}
          label={t('admin.form.uploadScreenshot')}
        />
        <div className="flex gap-2">
          <Input
            placeholder={t('admin.form.pasteUrl')}
            value={newScreenshot}
            onChange={(e) => setNewScreenshot(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addScreenshotUrl();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addScreenshotUrl}
            className="shrink-0"
          >
            <FiPlus size={16} />
          </Button>
        </div>
        {formData.screenshots.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {formData.screenshots.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-video rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      screenshots: prev.screenshots.filter(
                        (_, i) => i !== index
                      ),
                    }))
                  }
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          {t('admin.form.demoVideo')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('admin.form.videoUrl')}
            placeholder="https://youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-zinc-300">
              {t('admin.form.videoPlatform')}
            </label>
            <select
              value={formData.videoPlatform}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  videoPlatform: e.target.value as 'youtube' | 'facebook' | 'local' | 'none',
                }))
              }
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="none">{t('admin.form.noVideo')}</option>
              <option value="youtube">{t('admin.form.youtube')}</option>
              <option value="facebook">{t('admin.form.facebook')}</option>
              <option value="local">{t('admin.form.localFile')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          {t('admin.form.links')}
        </h3>
        <Input
          label={t('admin.form.githubUrl')}
          placeholder={t('admin.form.placeholderGithubUrl')}
          value={formData.githubUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
          }
        />
        <Input
          label={t('admin.form.liveDemoUrl')}
          placeholder={t('admin.form.placeholderLiveDemoUrl')}
          value={formData.liveDemoUrl}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, liveDemoUrl: e.target.value }))
          }
        />
        <Input
          label={t('admin.form.displayOrder')}
          type="number"
          placeholder="0"
          value={formData.order}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              order: parseInt(e.target.value) || 0,
            }))
          }
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('admin.cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
        >
          <FiSave className="mr-2" size={16} />
          {project ? t('admin.form.updateProject') : t('admin.form.createProject')}
        </Button>
      </div>
    </motion.form>
  );
}
