/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Check, Award, GraduationCap, Globe, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile | null;
  onSaveProfile: (updated: Omit<UserProfile, 'userId' | 'updatedAt'>) => Promise<void>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}: SettingsModalProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<'11' | '12'>('12');
  const [board, setBoard] = useState<'CBSE' | 'ICSE' | 'State Board'>('CBSE');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');
  const [selectedState, setSelectedState] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMSG, setErrorMSG] = useState<string | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || '');
      setGrade((currentProfile.grade as '11' | '12') || '12');
      setBoard((currentProfile.board as 'CBSE' | 'ICSE' | 'State Board') || 'CBSE');
      setLanguage((currentProfile.language as 'English' | 'Hindi') || 'English');
      setSelectedState(currentProfile.state || '');
    }
  }, [currentProfile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMSG('Please enter your name');
      return;
    }
    if (board === 'State Board' && !selectedState) {
      setErrorMSG('Please select your specific State Board');
      return;
    }
    setErrorMSG(null);
    setIsSaving(true);
    try {
      await onSaveProfile({
        name: name.trim(),
        grade,
        board,
        state: board === 'State Board' ? selectedState : '',
        language
      });
      onClose();
    } catch (err) {
      setErrorMSG('Failed to save profile. Please check validation rules.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Form Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-100"
          >
            {/* Header banner decoration */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
              <button
                id="btn-close-settings-top"
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold font-sans">Academic Profile Setup</h2>
              <p className="text-xs text-blue-100 mt-1">
                Customize your course catalog, NCERT solutions, and practice quizzes.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMSG && (
                <div className="rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-600 border border-rose-100">
                  {errorMSG}
                </div>
              )}

              {/* Enter Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  id="settings-input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Choose Grade */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-blue-500" />
                  Your Grade Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['11', '12'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      id={`opt-grade-${g}`}
                      onClick={() => setGrade(g)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 text-center transition-all ${
                        grade === g
                          ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                          : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-sm font-bold">Grade {g}</span>
                      <span className="text-2xs text-slate-400 mt-0.5">
                        {g === '11' ? 'Class XI Standard' : 'Class XII Secondary'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choose School Board */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Award className="h-4 w-4 text-emerald-500" />
                  Education Board Syllabus
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['CBSE', 'ICSE', 'State Board'] as const).map((b) => (
                    <button
                      type="button"
                      key={b}
                      id={`opt-board-${b.replace(/\s+/g, '')}`}
                      onClick={() => {
                        setBoard(b);
                        if (b !== 'State Board') {
                          setSelectedState('');
                        }
                      }}
                      className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all ${
                        board === b
                          ? 'border-indigo-600 bg-indigo-50/40 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                {board === 'State Board' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-1.5 border-t border-slate-100 pt-3"
                  >
                    <label className="text-xs font-bold text-slate-700 block">
                      Select State Board Area:
                    </label>
                    <select
                      id="settings-select-state"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 bg-white focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">-- Choose State Board --</option>
                      <option value="Uttar Pradesh (UPMSP)">Uttar Pradesh (UPMSP)</option>
                      <option value="Bihar (BSEB)">Bihar (BSEB)</option>
                      <option value="Maharashtra (MSBSHSE)">Maharashtra (MSBSHSE)</option>
                      <option value="Karnataka (KSEEB)">Karnataka (KSEEB)</option>
                      <option value="Rajasthan (BSER)">Rajasthan (BSER)</option>
                      <option value="Madhya Pradesh (MPBSE)">Madhya Pradesh (MPBSE)</option>
                      <option value="Gujarat (GSEB)">Gujarat (GSEB)</option>
                      <option value="Tamil Nadu (TNDGE)">Tamil Nadu (TNDGE)</option>
                      <option value="West Bengal (WBBSE)">West Bengal (WBBSE)</option>
                    </select>
                  </motion.div>
                )}
              </div>

              {/* Choose Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Globe className="h-4 w-4 text-amber-500" />
                  Preferred Medium (Language)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['English', 'Hindi'] as const).map((l) => (
                    <button
                      type="button"
                      key={l}
                      id={`opt-lang-${l}`}
                      onClick={() => setLanguage(l)}
                      className={`flex items-center gap-2 justify-center py-2.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        language === l
                          ? 'border-amber-500 bg-amber-50/30 text-amber-900'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-slate-400 font-mono text-2xs">[{l === 'English' ? 'EN' : 'HI'}]</span>
                      <span>{l === 'English' ? 'English' : 'Mural / हिंदी'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Save Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-settings-save"
                  disabled={isSaving}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
