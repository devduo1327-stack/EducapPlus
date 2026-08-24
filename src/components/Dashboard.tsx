/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  BookOpen,
  Award,
  BookmarkCheck,
  ChevronRight,
  Sparkles,
  Search,
  BookOpenText,
  HelpCircle,
  FileText,
  BookmarkIcon,
  Flame,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chapter, SubjectData, UserProfile, QuizAttempt } from '../types';
import { GRADE_11_COURSES, GRADE_12_COURSES } from '../data/courses';

interface DashboardProps {
  profile: UserProfile;
  quizAttempts: QuizAttempt[];
  onSelectChapter: (chapter: Chapter, subjectName: string, activeTab: 'ncert' | 'ref') => void;
  onSelectQuiz: (subjectId: string, subjectName: string, chapterId: string, chapterName: string) => void;
  onOpenSettings: () => void;
}

export default function Dashboard({
  profile,
  quizAttempts,
  onSelectChapter,
  onSelectQuiz,
  onOpenSettings
}: DashboardProps) {
  const [selectedGrade, setSelectedGrade] = useState<'11' | '12'>(profile.grade as '11' | '12' || '12');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState<'All' | 'CBSE' | 'ICSE' | 'State Board'>('All');

  const courses = selectedGrade === '11' ? GRADE_11_COURSES : GRADE_12_COURSES;

  // Set default active subject search on grade toggle
  const activeSubject = courses.find((s) => s.id === activeSubjectId) || courses[0];
  const activeSubjectData = activeSubject || null;

  if (activeSubject && activeSubjectId === null) {
    setActiveSubjectId(activeSubject.id);
  }

  // Personalization titles based on selected Board and language
  const customBoardMantra = () => {
    switch (profile.board) {
      case 'ICSE':
        return 'Analyzing ISC Class XII & ICSE Class XI blueprint trends. Focus on ML Aggarwal explanations & concepts.';
      case 'State Board':
        return `Highlighting State Board textbook chapters & solutions aligned to your localized regional curriculum${profile.state ? ` for ${profile.state}` : ''}.`;
      default:
        return 'Personalized for CBSE Board Exams. Rigorous focus on NCERT textbook paradigms & RD Sharma theorems.';
    }
  };

  const getRefAuthor = (subName: string) => {
    switch (subName) {
      case 'Mathematics':
        return profile.board === 'ICSE' ? 'M.L. Aggarwal' : 'R.D. Sharma';
      case 'Physics':
        return 'H.C. Verma';
      case 'Chemistry':
        return 'O.P. Tandon';
      case 'Biology':
        return 'Dinesh Biology';
      case 'Computer Science':
        return 'Sumita Arora';
      default:
        return 'Wren & Martin';
    }
  };

  // Filtered chapters matching search query and custom board selection
  const filteredChapters = activeSubjectData
    ? activeSubjectData.chapters.filter((ch) => {
        const matchesSearch =
          ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ch.description.toLowerCase().includes(searchQuery.toLowerCase());
        const chBoards = ch.boards || ['CBSE', 'ICSE', 'State Board'];
        const matchesBoard = boardFilter === 'All' || chBoards.includes(boardFilter);
        return matchesSearch && matchesBoard;
      })
    : [];

  // Compute stats
  const totalAttempts = quizAttempts.length;
  const avgAccuracy = totalAttempts
    ? Math.round(quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Dynamic Welcoming Greeting Card with personalized motivation */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-xl md:px-12 md:py-10">
        {/* Glow decoration */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-600/30 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-600/20 blur-2xl" />

        <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-4 w-4" />
              <span>Syllabus Aligned Study Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl font-sans">
              Welcome Back, {profile.name}!
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              🎯 <span className="font-semibold text-white">{profile.board} Curriculum Mode</span> active. {customBoardMantra()}
            </p>
          </div>

          <button
            onClick={onOpenSettings}
            id="btn-dash-setup-setting"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all shrink-0"
          >
            Customize Board Syllabus
          </button>
        </div>
      </div>

      {/* Grid layouts: LHS Course Materials Explorer, RHS Analytics Performance Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand Column: Detailed Course Materials Index */}
        <div className="lg:col-span-8 space-y-6">
          {/* Grade Filters Tabs Card */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Course Catalogues
              </h2>
            </div>

            {/* Switch Grades Toggle */}
            <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50/50 p-1">
              {(['11', '12'] as const).map((gradeVal) => (
                <button
                  key={gradeVal}
                  id={`tab-grade-${gradeVal}`}
                  onClick={() => {
                    setSelectedGrade(gradeVal);
                    setActiveSubjectId(null); // Reset subject view on grade flip
                  }}
                  className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                    selectedGrade === gradeVal
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Grade {gradeVal}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Horizontal Animation Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {courses.map((subject) => {
              const iksActive = activeSubjectId === subject.id;
              return (
                <button
                  key={subject.id}
                  id={`btn-subject-${subject.id}`}
                  onClick={() => setActiveSubjectId(subject.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                    iksActive
                      ? `bg-slate-50 border-blue-600 text-slate-900 shadow-sm shadow-blue-50`
                      : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold truncate w-full">{subject.name}</span>
                  <span className="text-4xs font-semibold text-slate-400 mt-1 uppercase truncate w-full">
                    {profile.language === 'Hindi' ? subject.hindiName : '[Core Prep]'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search tool for active chapter list */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters, solutions, or reference questions..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Board catalog filter selector */}
          <div className="flex flex-col gap-2 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-500 font-mono">
                Syllabus Filter Control:
              </span>
              <span className="text-4xs font-bold text-slate-400">
                Click to filter specific board lists or view full overlap
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(['All', 'CBSE', 'ICSE', 'State Board'] as const).map((b) => (
                <button
                  key={b}
                  id={`filter-board-${b.replace(/\s+/g, '')}`}
                  onClick={() => setBoardFilter(b)}
                  className={`px-3 py-1 rounded-lg text-3xs font-bold transition-all ${
                    boardFilter === b
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {b === 'All' ? '🌐 All Board Catalogues' : b}
                </button>
              ))}
            </div>
          </div>

          {/* CHAPTER CARDS CONTAINER */}
          <div className="space-y-4">
            {filteredChapters.length > 0 ? (
              filteredChapters.map((chapter) => (
                <motion.div
                  key={chapter.id}
                  layout
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-200 transition-all space-y-4"
                >
                  {/* Title & Stats block */}
                  <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-4xs font-bold text-slate-600 uppercase tracking-wider">
                          Chapter ID: {chapter.id.toUpperCase()}
                        </span>
                        {/* Board badges */}
                        <div className="flex flex-wrap gap-1">
                          {(chapter.boards || ['CBSE', 'ICSE', 'State Board']).map((b) => (
                            <span
                              key={b}
                              className={`rounded px-1.5 py-0.2 text-5xs font-bold uppercase tracking-wider ${
                                b === 'CBSE'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-100/60'
                                  : b === 'ICSE'
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/60'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100/60'
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{chapter.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        {chapter.description}
                      </p>
                    </div>

                    <div className="inline-flex self-start items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1 text-3xs font-semibold text-emerald-700 border border-emerald-100">
                      <Flame className="h-3 w-3 text-emerald-500" />
                      <span>Syllabus Aligned</span>
                    </div>
                  </div>

                  {/* Launcher buttons actions bar */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-2 border-t border-slate-50">
                    {/* Read summary */}
                    <button
                      onClick={() => onSelectChapter(chapter, activeSubjectData?.name || '', 'ncert')}
                      className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-3xs hover:bg-blue-100 transition-colors"
                      id={`btn-read-summary-${chapter.id}`}
                    >
                      <BookOpenText className="h-3.5 w-3.5" />
                      <span>Read Summary</span>
                    </button>

                    {/* NCERT solutions */}
                    <button
                      onClick={() => onSelectChapter(chapter, activeSubjectData?.name || '', 'ncert')}
                      className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-3xs hover:bg-emerald-100 transition-colors"
                      id={`btn-solutions-ncert-${chapter.id}`}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>NCERT Solutions</span>
                    </button>

                    {/* Author Publication Solutions */}
                    <button
                      onClick={() => onSelectChapter(chapter, activeSubjectData?.name || '', 'ref')}
                      className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-3xs hover:bg-indigo-100 transition-colors"
                      id={`btn-solutions-ref-${chapter.id}`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{getRefAuthor(activeSubjectData?.name || '')} Sols</span>
                    </button>

                    {/* Practice quiz */}
                    <button
                      onClick={() =>
                        onSelectQuiz(
                          activeSubjectData?.id || '',
                          activeSubjectData?.name || '',
                          chapter.id,
                          chapter.name
                        )
                      }
                      className="inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg bg-slate-900 text-white font-bold text-3xs hover:bg-slate-800 transition-colors shadow-xs"
                      id={`btn-launch-quiz-${chapter.id}`}
                    >
                      <Award className="h-3.5 w-3.5 text-amber-400" />
                      <span>Practice Quiz</span>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-12 text-center text-slate-500 text-xs font-semibold">
                No chapters matching your search filter in this current subject catalogue.
              </div>
            )}
          </div>
        </div>

        {/* Right Hand Column: Analytics Statistics Tracking Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Syllabus Progress Tracker
              </h3>
              <Award className="h-4 w-4 text-emerald-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="block text-2xl font-bold font-mono text-slate-800">
                  {totalAttempts}
                </span>
                <span className="text-3xs text-slate-500 uppercase tracking-wide font-semibold">
                  Assessments Completed
                </span>
              </div>

              <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="block text-2xl font-bold font-mono text-indigo-600">
                  {avgAccuracy}%
                </span>
                <span className="text-3xs text-slate-500 uppercase tracking-wide font-semibold">
                  Average Accuracy
                </span>
              </div>
            </div>

            {/* Simulated target checklist indicator for student board syllabus */}
            <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3.5 text-3xs leading-relaxed text-blue-800 space-y-2">
              <span className="font-bold flex items-center gap-1 text-2xs uppercase tracking-wide">
                <BookmarkCheck className="h-4 w-4 text-blue-500" />
                <span>Next Milestones</span>
              </span>
              <p>Completed assessments yield preparation certificates indicating exact subject mastery of Board exam layouts.</p>
            </div>
          </div>

          {/* Historic Log List from Firestore database */}
          <div className="rounded-2xl border border-slate-150 bg-white p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Grade {profile.grade} Quiz Log
            </h3>

            {quizAttempts.length > 0 ? (
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-60 pr-1.5 space-y-3 pt-1">
                {quizAttempts.map((attempt, index) => (
                  <div key={index} className="flex items-center justify-between py-2 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 truncate block max-w-[150px]">
                        {GRADE_11_COURSES.concat(GRADE_12_COURSES)
                          .flatMap((s) => s.chapters)
                          .find((c) => c.id === attempt.chapterId)?.name || attempt.chapterId}
                      </span>
                      <span className="text-3xs text-slate-400 block font-mono">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg text-emerald-800 font-mono font-bold text-3xs">
                      <span>{attempt.score}/{attempt.totalQuestions * 10} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-3xs font-semibold text-slate-400">
                No quizzes logged. Practice active chapters to record diagnostic board feedback.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
