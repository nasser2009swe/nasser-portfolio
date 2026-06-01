'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSend,
  FiMail,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getApps } from 'firebase/app';
import { useI18n } from '@/context/I18nContext';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg(t('contact.error.required'));
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      if (getApps().length > 0) {
        const db = getFirestore(getApps()[0]);
        await addDoc(collection(db, 'messages'), {
          ...form,
          createdAt: Timestamp.now(),
          read: false,
        });
      } else {
        console.log('Contact form submission (no Firebase):', form);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setErrorMsg(t('contact.error.generic'));
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-32 relative">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('contact.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {t('contact.highlight')}
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            {t('contact.description')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                <FiMail className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{t('contact.email')}</h3>
                <a
                  href="mailto:nasser2009swe@gmail.com"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  nasser2009swe@gmail.com
                </a>
              </div>
            </div>

            {/* Status message */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FiCheck className="text-green-400" size={16} />
                  </div>
                  <div>
                    <p className="text-green-300 font-medium">
                      {t('contact.success.title')}
                    </p>
                    <p className="text-green-400/70 text-sm">
                      {t('contact.success.description')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Error message */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  <FiAlertCircle size={16} className="shrink-0" />
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('contact.form.placeholderName')}
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    focusedField === 'name'
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-zinc-800'
                  }`}
                />
              </div>
              <input
                type="email"
                placeholder={t('contact.form.placeholderEmail')}
                required
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                  focusedField === 'email'
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-zinc-800'
                }`}
              />
            </div>
            <input
              type="text"
              placeholder={t('contact.form.placeholderSubject')}
              value={form.subject}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              onFocus={() => setFocusedField('subject')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                focusedField === 'subject'
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-zinc-800'
              }`}
            />
            <textarea
              placeholder={t('contact.form.placeholderMessage')}
              required
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none ${
                focusedField === 'message'
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-zinc-800'
              }`}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {status === 'sending' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('contact.form.sending')}
                </>
              ) : (
                <>
                  <FiSend className="group-hover:translate-x-1 transition-transform" />
                  {t('contact.form.send')}
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
