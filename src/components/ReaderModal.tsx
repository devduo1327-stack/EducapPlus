/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  X,
  Search,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark,
  FileText,
  BookmarkCheck,
  Edit2,
  Trash2,
  HelpCircle,
  ClipboardCheck,
  Languages,
  Award,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chapter, UserProfile } from '../types';
import { getExercisesForChapter, generateExhaustiveAuthorSolutionsDocument, Exercise, ExerciseQuestion } from '../data/exercises';
import { jsPDF } from 'jspdf';

interface ReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter | null;
  subjectName: string;
  userProfile: UserProfile | null;
  activePublication: 'ncert' | 'ref'; // 'ncert' = NCERT details, 'ref' = Author Solutions (RD Sharma, etc.)
}

type ReaderTheme = 'white' | 'sepia' | 'dark';

export default function ReaderModal({
  isOpen,
  onClose,
  chapter,
  subjectName,
  userProfile,
  activePublication
}: ReaderModalProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'solutions' | 'refSolutions' | 'exercises'>('content');
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontSize, setFontSize] = useState<number>(14);
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number | null>(null);
  
  // Exercises practice states
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState<number>(0);
  const [selectedExQuestionIndex, setSelectedExQuestionIndex] = useState<number | null>(null);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');

  const [selectedPublication, setSelectedPublication] = useState<string>('');

  // Reset page when chapter or publication type shifts
  useEffect(() => {
    if (chapter) {
      setCurrentPage(1);
      setSelectedSolutionIndex(null);
      setSelectedExerciseIndex(0);
      setSelectedExQuestionIndex(null);
      setExerciseSearchQuery('');
      setSelectedPublication('');
      if (activePublication === 'ncert') {
        setActiveTab('solutions');
      } else {
        setActiveTab('refSolutions');
      }
      
      // Load saved notes from local storage matching user + chapterId
      const saved = localStorage.getItem(`notes_${chapter.id}`);
      setNotes(saved || '');

      // Load bookmark state
      const isMarked = localStorage.getItem(`bookmark_${chapter.id}`) === 'true';
      setIsBookmarked(isMarked);
    }
  }, [chapter, activePublication]);

  if (!chapter) return null;

  // Personalization configuration based on selected Board
  const preferredAuthor = subjectName === 'Mathematics'
    ? (userProfile?.board === 'ICSE' ? 'M.L. Aggarwal' : 'R.D. Sharma')
    : subjectName === 'Physics'
    ? 'H.C. Verma'
    : subjectName === 'Chemistry'
    ? 'O.P. Tandon'
    : subjectName === 'Biology'
    ? 'Dinesh Biology'
    : 'Wren & Martin';

  const getCurrentAuthor = () => {
    if (!chapter || !chapter.refSolutions || chapter.refSolutions.length === 0) return preferredAuthor;
    const uniquePubs = Array.from(new Set(chapter.refSolutions.map(s => s.publicationName)));
    const activeP = selectedPublication && uniquePubs.includes(selectedPublication)
      ? selectedPublication
      : uniquePubs[0];
    const match = chapter.refSolutions.find(s => s.publicationName === activeP);
    return match ? match.author : preferredAuthor;
  };
  const activeAuthorName = getCurrentAuthor();

  const boardBadge = userProfile?.board || 'CBSE';
  const languageBadge = userProfile?.language || 'English';

  const handleBookmarkToggle = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    localStorage.setItem(`bookmark_${chapter.id}`, String(nextState));
  };

  const handleSaveNotes = (val: string) => {
    setNotes(val);
    localStorage.setItem(`notes_${chapter.id}`, val);
  };

  const clearNotes = () => {
    setNotes('');
    localStorage.removeItem(`notes_${chapter.id}`);
  };

  const handleDownloadPDF = () => {
    // Generate an absolute masterpiece study companion if the user downloads the reference solutions
    let contentString = '';
    let docFilename = `${subjectName}_Ch_${chapter.id}_Solutions.pdf`;

    if (activeTab === 'refSolutions') {
      contentString = generateExhaustiveAuthorSolutionsDocument(subjectName, chapter, userProfile);
      docFilename = `${subjectName}_Ch_${chapter.id}_${preferredAuthor}_Full_45_Page_Exam_Prep_Guide.pdf`;
    } else {
      contentString = `============ ${boardBadge} BOARD ${languageBadge.toUpperCase()} COMPANION ============\n`;
      contentString += `SUBJECT: ${subjectName}\nCHAPTER: ${chapter.name}\n`;
      contentString += `PUBLICATION: ${activeTab === 'solutions' ? 'NCERT Official Solutions' : activeTab === 'exercises' ? 'Chapter Practice Exercises' : preferredAuthor + ' Reference Series'}\n\n`;
      
      if (activeTab === 'content') {
        contentString += `SUMMARY:\n${chapter.summary}\n\nKEY TOPICS:\n- ${chapter.topics.join('\n- ')}\n`;
      } else if (activeTab === 'solutions') {
        chapter.ncertSolutions.forEach((sol, i) => {
          contentString += `Q${i+1}: ${sol.question}\nAns: ${sol.answer}\n`;
          contentString += `Steps:\n  ${sol.stepByStep.join('\n  ')}\n\n`;
        });
      } else if (activeTab === 'exercises') {
        const chapterExercises = getExercisesForChapter(chapter.id, chapter.name);
        chapterExercises.forEach((exItem) => {
          contentString += `\n==================== ${exItem.name} ====================\n`;
          contentString += `${exItem.description}\n\n`;
          exItem.questions.forEach((qItem, qi) => {
            contentString += `Q${qi+1}: ${qItem.question}\nAns: ${qItem.answer}\n`;
            contentString += `Steps:\n  ${qItem.stepByStep.join('\n  ')}\n\n`;
          });
        });
        docFilename = `${subjectName}_Ch_${chapter.id}_Interactive_Exercises_Collection.pdf`;
      } else {
        chapter.refSolutions.forEach((sol, i) => {
          contentString += `[${sol.publicationName}] Q.${sol.problemId}: ${sol.question}\nAns: ${sol.answer}\n`;
          contentString += `Detailed steps:\n  ${sol.stepByStep.join('\n  ')}\n\n`;
        });
      }
    }

    // PDF Compilation using jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageHeight = doc.internal.pageSize.height; // ~297mm
    const pageWidth = doc.internal.pageSize.width; // ~210mm
    const margin = 15; // 15mm margin
    const maxLineWidth = pageWidth - (margin * 2); // 180mm width
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    
    // Split long text into wrapped lines fit for printing
    const rawLines = contentString.split('\n');
    let yCursor = margin;
    const lineHeight = 6; // spacing height
    
    // Document Title Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // brand blue
    doc.text(`EduCap+ Reference Series: ${subjectName}`, margin, yCursor);
    yCursor += 12;
    
    // Draw horizontal separator line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, yCursor - 4, pageWidth - margin, yCursor - 4);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85); // slate-700

    rawLines.forEach((rawLine) => {
      // Use splitTextToSize to wrap line
      const wrappedLinesList: string[] = doc.splitTextToSize(rawLine || " ", maxLineWidth);
      
      wrappedLinesList.forEach((line) => {
        if (yCursor + lineHeight > pageHeight - margin) {
          doc.addPage();
          yCursor = margin;
        }
        
        // Dynamic decorative syntax coloring
        if (line.includes('===') || line.includes('---')) {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(30, 41, 59); // zinc-800
        } else if (line.startsWith('SUBJECT:') || line.startsWith('CHAPTER:') || line.startsWith('PUBLICATION:') || line.startsWith('[PAGE ')) {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(79, 70, 229); // indigo-600
        } else if (line.startsWith('Q') && line.includes(':')) {
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(37, 99, 235); // blue-600
        } else {
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(51, 65, 85); // slate-700
        }

        doc.text(line, margin, yCursor);
        yCursor += lineHeight;
      });
    });

    doc.save(docFilename);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  // Determine page reading layout
  const themeColors = {
    white: 'bg-white text-slate-800 border-slate-200',
    sepia: 'bg-[#f8f1e5] text-[#4f3824] border-[#ebdcc5]',
    dark: 'bg-slate-900 text-slate-200 border-slate-800'
  };

  const solutionsToRender = activeTab === 'solutions'
    ? chapter.ncertSolutions
    : chapter.refSolutions.filter(sol => {
        const uniquePubs = Array.from(new Set(chapter.refSolutions.map(s => s.publicationName)));
        const activeP = selectedPublication && uniquePubs.includes(selectedPublication)
          ? selectedPublication
          : (uniquePubs[0] || '');
        return sol.publicationName === activeP;
      });

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
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Fullscreen Style Reader */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100"
          >
            {/* Top Reader Metadata Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <BookOpenText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{chapter.name}</span>
                    <span className="text-2xs font-normal text-slate-400">({subjectName})</span>
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="rounded-md bg-blue-100/60 px-1.5 py-0.5 text-3xs font-bold text-blue-700 uppercase">
                      PDF Reference
                    </span>
                    <span className="text-3xs text-slate-400 flex items-center gap-1 font-medium">
                      <Languages className="h-3 w-3 text-slate-400" />
                      {languageBadge} Medium
                    </span>
                  </div>
                </div>
              </div>

              {/* Reader Settings Controller */}
              <div className="flex items-center gap-3">
                {/* Themes selectors */}
                <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                  {(['white', 'sepia', 'dark'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`h-6 px-2 text-3xs font-semibold rounded capitalize transition-all ${
                        theme === t
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Font control */}
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5">
                  <button
                    onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                    className="text-slate-400 hover:text-slate-700 font-bold px-1 text-xs"
                    title="Decrease font size"
                  >
                    A-
                  </button>
                  <span className="text-3xs font-mono font-bold text-slate-500">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                    className="text-slate-400 hover:text-slate-700 font-bold px-1 text-xs"
                    title="Increase font size"
                  >
                    A+
                  </button>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={handleBookmarkToggle}
                  className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition-all ${
                    isBookmarked
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Bookmark Chapter Page"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Bookmark</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownloadPDF}
                  className={`flex h-8 items-center gap-1.5 rounded-lg text-xs font-bold px-2.5 text-white transition-all shadow-xs ${
                    downloadSuccess ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  title="Export chapter Solutions"
                >
                  {downloadSuccess ? (
                    <ClipboardCheck className="h-4 w-4" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">
                    {downloadSuccess ? 'Copied & Exported!' : 'Export PDF'}
                  </span>
                </button>

                <button
                  id="btn-close-reader"
                  onClick={onClose}
                  className="rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Inner Workspace Container (Flex split: Left Content Pane, Right Notepad Drawer) */}
            <div className="flex flex-1 overflow-hidden">
              {/* Publication tabs & simulated document viewport */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Internal PDF Sections Navigation Tab */}
                <div className="flex justify-center border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
                  <button
                    id="tab-reader-summary"
                    onClick={() => {
                      setActiveTab('content');
                      setSelectedSolutionIndex(null);
                    }}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                      activeTab === 'content'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-500 hover:bg-gray-100'
                    }`}
                  >
                    Chapter Core Summary
                  </button>

                  <button
                    id="tab-reader-ncert"
                    onClick={() => {
                      setActiveTab('solutions');
                      setSelectedSolutionIndex(null);
                    }}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                      activeTab === 'solutions'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-500 hover:bg-gray-100'
                    }`}
                  >
                    Official NCERT Solutions
                  </button>

                  <button
                    id="tab-reader-ref"
                    onClick={() => {
                      setActiveTab('refSolutions');
                      setSelectedSolutionIndex(null);
                    }}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'refSolutions'
                        ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-100'
                        : 'text-slate-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Reference Solutions ({activeAuthorName})
                  </button>

                  <button
                    id="tab-reader-exercises"
                    onClick={() => {
                      setActiveTab('exercises');
                      setSelectedExQuestionIndex(null);
                      setSelectedExerciseIndex(0);
                    }}
                    className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeTab === 'exercises'
                        ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-100'
                        : 'text-slate-500 hover:bg-gray-100'
                    }`}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Chapter Exercises (At least 5)
                  </button>
                </div>

                {/* Main Interactive Screen with Paper Texture */}
                <div className={`flex-1 overflow-y-auto p-6 md:p-8 transition-colors duration-150 relative ${themeColors[theme]}`}>
                  <div className="mx-auto max-w-3xl space-y-6">
                    {/* Simulated watermark indicating personalized Board compatibility */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-2 flex flex-col items-center">
                      <span className="text-7xl font-bold tracking-widest">{boardBadge}</span>
                      <span className="text-sm font-semibold mt-2">{languageBadge.toUpperCase()} ACADEMIC SOLUTIONS</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {activeTab === 'content' && (
                        <motion.div
                          key="summary-content"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          <div className="border-l-4 border-blue-500 pl-4 py-1">
                            <h4 className="text-xl font-bold tracking-tight uppercase font-sans">
                              {chapter.name} - Study Notes
                            </h4>
                            <p className="text-2xs opacity-75 mt-0.5">
                              Syllabus customized for {boardBadge} Grade {userProfile?.grade || '12'}
                            </p>
                          </div>

                          <p className="leading-relaxed font-sans">{chapter.summary}</p>

                          <div className="rounded-xl border border-current/10 p-5 mt-4">
                            <h5 className="text-xs font-bold uppercase tracking-wider mb-3">
                              Key Sub-Topics to Master for {boardBadge} Exams
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {chapter.topics.map((topic, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2.5 text-xs"
                                >
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-blue-500/10 text-2xs font-bold select-none">
                                    {i + 1}
                                  </span>
                                  <span className="font-semibold">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-xl bg-orange-500/5 p-4 mt-4 border border-orange-500/10 text-xs leading-relaxed">
                            <strong className="text-orange-600 block mb-1">💡 Preparation Pro-Tip:</strong>
                            Every single subtopic detailed above correlates directly to critical 5-point long answers in past papers. We highly recommend drafting individual proof derivations inside your personal notepad on the right!
                          </div>
                        </motion.div>
                      )}

                      {(activeTab === 'solutions' || activeTab === 'refSolutions') && (
                        <motion.div
                          key="solutions-content"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-5"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {activeTab === 'refSolutions' && (
                            <div className="space-y-4">
                              {/* Famous Author Selection Tab Buttons */}
                              <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                                <span className="text-4xs font-bold uppercase tracking-wider text-slate-500">
                                  Select Famous Author Reference Book:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    const uniquePubs = Array.from(new Set(chapter.refSolutions.map(s => s.publicationName)));
                                    const activeP = selectedPublication && uniquePubs.includes(selectedPublication)
                                      ? selectedPublication
                                      : (uniquePubs[0] || '');
                                    return uniquePubs.map((pub) => (
                                      <button
                                        key={pub}
                                        type="button"
                                        onClick={() => {
                                          setSelectedPublication(pub);
                                          setSelectedSolutionIndex(null);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                          activeP === pub
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                        }`}
                                      >
                                        {pub}
                                      </button>
                                    ));
                                  })()}
                                </div>
                              </div>

                              <div className="rounded-xl bg-indigo-500/5 p-4 border border-indigo-500/10 space-y-3">
                                <div className="flex items-start gap-3">
                                  <Award className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5 animate-pulse" />
                                  <div className="space-y-1">
                                    <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-widest leading-none">
                                      Comprehensive Revision Workbook (45-55 Pages Downloadable Edition)
                                    </h5>
                                    <p className="text-3xs text-indigo-700/85 mt-1 leading-relaxed font-semibold">
                                      This downloadable reference guide by <strong>{activeAuthorName}</strong> contains an elaborate Table of Contents, official Board Blueprint analysis, essential theoretical derivations, solved high-difficulty homework, and <strong>Board Previous Years Questions (PYQs 2018-2025)</strong>.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={handleDownloadPDF}
                                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold text-white transition-all shadow-xs ${
                                    downloadSuccess ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'
                                  }`}
                                >
                                  <Download className="h-4 w-4" />
                                  <span>{downloadSuccess ? 'Workbook Exported and Downloaded!' : `Download Comprehensive ${activeAuthorName} Handbook (45-Page Complete Collection)`}</span>
                                </button>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between border-b border-current/10 pb-3">
                            <div className="border-l-4 border-emerald-500 pl-4 py-0.5">
                              <h4 className="text-sm font-bold uppercase tracking-wide">
                                {activeTab === 'solutions' ? 'Official NCERT Solution Archive' : `${activeAuthorName} Solved Questions`}
                              </h4>
                              <p className="text-3xs opacity-75 mt-0.5">
                                Verified solutions with chronological step-by-step resolution paths
                              </p>
                            </div>
                            <span className="text-xs font-mono font-bold opacity-60">
                              {solutionsToRender.length} Problems Solved
                            </span>
                          </div>

                          {/* Solutions Accordion/Interactive List */}
                          <div className="space-y-4">
                            {solutionsToRender.map((sol, index) => {
                              const isSelected = selectedSolutionIndex === index;
                              return (
                                <div
                                  key={index}
                                  className={`rounded-xl border transition-all overflow-hidden ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20'
                                      : 'border-current/10 bg-current/2'
                                  }`}
                                >
                                  <button
                                    onClick={() => setSelectedSolutionIndex(isSelected ? null : index)}
                                    className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-current/2"
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 font-bold text-xs font-mono select-none">
                                      {index + 1}
                                    </span>
                                    <div className="flex-1">
                                      <p className="font-bold text-xs uppercase tracking-wider opacity-60">
                                        {'problemId' in sol ? `Publication Problem Q.${sol.problemId}` : `Exercise Question ${index + 1}`}
                                      </p>
                                      <p className="font-semibold text-sm mt-1">{sol.question}</p>
                                    </div>
                                    <ChevronRight
                                      className={`h-4 w-4 shrink-0 transition-transform mt-1 opacity-50 ${
                                        isSelected ? 'rotate-90' : ''
                                      }`}
                                    />
                                  </button>

                                  <AnimatePresence>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        className="border-t border-current/10 overflow-hidden"
                                      >
                                        <div className="p-4 bg-current/1 space-y-4">
                                          {/* Short Direct Answer Box */}
                                          <div className="rounded-lg bg-emerald-500/10 p-3 text-xs leading-relaxed border border-emerald-500/20">
                                            <span className="font-bold text-emerald-600 block text-2xs uppercase tracking-wider">
                                              Final Value/Statement Outcome
                                            </span>
                                            <span className="font-bold">{sol.answer}</span>
                                          </div>

                                          {/* Step-by-Step Resolution */}
                                          <div className="space-y-3">
                                            <span className="text-2xs font-bold uppercase tracking-wider opacity-60 block">
                                              Rigorous Verification Steps
                                            </span>
                                            <div className="space-y-2.5 pl-2">
                                              {sol.stepByStep.map((step, si) => (
                                                <div
                                                  key={si}
                                                  className="flex items-start gap-2 text-xs"
                                                >
                                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-400/20 text-3xs font-bold font-mono">
                                                    S{si + 1}
                                                  </span>
                                                  <span className="flex-1 opacity-90 leading-relaxed font-sans mt-0.5">
                                                    {step}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'exercises' && (
                        <motion.div
                          key="exercises-content"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-5"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {/* Alert info banner */}
                          <div className="rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10 flex items-start gap-3">
                            <GraduationCap className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                                Syllabus Practice Worksheet Catalog
                              </h5>
                              <p className="text-3xs text-emerald-700/80 leading-relaxed font-semibold">
                                This chapter holds exactly <strong>5 distinct focused exercises</strong>. Each exercise is designed to test targeted conceptual ranges and contains <strong>at least 5 up to 15 solved problems</strong> complete with verified step-by-step resolution pathways. Search, choose, or solve them.
                              </p>
                            </div>
                          </div>

                          {/* Search bar inside exercises */}
                          <div className="relative">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-emerald-600" />
                            <input
                              type="text"
                              placeholder="Search inside current exercise worksheet questions..."
                              value={exerciseSearchQuery}
                              onChange={(e) => setExerciseSearchQuery(e.target.value)}
                              className="w-full rounded-xl border border-current/10 bg-current/2 py-2 pl-9 pr-4 text-xs font-semibold focus:border-emerald-500 focus:outline-none transition-all"
                            />
                          </div>

                          {/* 5 Exercise Selection Grid Tabs */}
                          <div className="flex flex-col gap-2">
                            <span className="text-4xs font-bold uppercase tracking-wider opacity-60">
                              Choose Practice Worksheet (Select 1 of 5):
                            </span>
                            <div className="grid grid-cols-5 gap-1.5">
                              {getExercisesForChapter(chapter.id, chapter.name).map((exItem, sIdx) => (
                                <button
                                  key={exItem.id}
                                  id={`btn-ex-sheet-${sIdx + 1}`}
                                  onClick={() => {
                                    setSelectedExerciseIndex(sIdx);
                                    setSelectedExQuestionIndex(null);
                                  }}
                                  className={`py-2 px-1 rounded-lg border text-center font-extrabold text-3xs transition-all ${
                                    selectedExerciseIndex === sIdx
                                      ? 'border-emerald-600 bg-emerald-500/15 text-emerald-900 shadow-3xs ring-1 ring-emerald-500/40 font-black'
                                      : 'border-current/10 bg-current/5 hover:bg-current/10 opacity-70'
                                  }`}
                                >
                                  Ex {sIdx + 1}.1
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Active exercise metadata */}
                          {getExercisesForChapter(chapter.id, chapter.name)[selectedExerciseIndex] && (
                            <div className="border-b border-current/10 pb-3 mt-1">
                              <span className="text-4xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider select-none">
                                {getExercisesForChapter(chapter.id, chapter.name)[selectedExerciseIndex].name}
                              </span>
                              <p className="text-2xs opacity-75 mt-1 leading-relaxed font-semibold">
                                {getExercisesForChapter(chapter.id, chapter.name)[selectedExerciseIndex].description}
                              </p>
                            </div>
                          )}

                          {/* Exercise questions container */}
                          <div className="space-y-3.5">
                            {(() => {
                              const currentEx = getExercisesForChapter(chapter.id, chapter.name)[selectedExerciseIndex];
                              if (!currentEx) return null;
                              
                              const filtered = currentEx.questions.filter(q =>
                                q.question.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
                                q.answer.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
                              );

                              if (filtered.length === 0) {
                                return (
                                  <div className="py-8 text-center text-xs opacity-60 font-semibold">
                                    No questions found matching "{exerciseSearchQuery}" inside this worksheet.
                                  </div>
                                );
                              }

                              return filtered.map((qItem, index) => {
                                const isSelected = selectedExQuestionIndex === index;
                                return (
                                  <div
                                    key={qItem.id}
                                    className={`rounded-xl border transition-all overflow-hidden ${
                                      isSelected
                                        ? 'border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                                        : 'border-current/10 bg-current/2'
                                    }`}
                                  >
                                    <button
                                      onClick={() => setSelectedExQuestionIndex(isSelected ? null : index)}
                                      className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-current/2"
                                    >
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 font-bold text-xs font-mono select-none">
                                        Q{index + 1}
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-semibold text-sm leading-relaxed">{qItem.question}</p>
                                      </div>
                                      <ChevronRight
                                        className={`h-4 w-4 shrink-0 transition-transform mt-1 opacity-50 ${
                                          isSelected ? 'rotate-90' : ''
                                        }`}
                                      />
                                    </button>

                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.div
                                          initial={{ height: 0 }}
                                          animate={{ height: 'auto' }}
                                          exit={{ height: 0 }}
                                          className="border-t border-current/10 overflow-hidden"
                                        >
                                          <div className="p-4 bg-current/1 space-y-4">
                                            {/* Short Direct Answer Box */}
                                            <div className="rounded-lg bg-emerald-500/10 p-3 text-xs leading-relaxed border border-emerald-500/20">
                                              <span className="font-bold text-emerald-600 block text-2xs uppercase tracking-wider">
                                                Verified Final Outcome
                                              </span>
                                              <span className="font-bold">{qItem.answer}</span>
                                            </div>

                                            {/* Step-by-Step Resolution */}
                                            <div className="space-y-3">
                                              <span className="text-2xs font-bold uppercase tracking-wider opacity-60 block">
                                                Exhaustive Multi-Stage Derivative Method
                                              </span>
                                              <div className="space-y-2.5 pl-2">
                                                {qItem.stepByStep.map((step, si) => (
                                                  <div
                                                    key={si}
                                                    className="flex items-start gap-2 text-xs"
                                                  >
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-400/20 text-3xs font-bold font-mono">
                                                      Step {si + 1}
                                                    </span>
                                                    <span className="flex-1 opacity-90 leading-relaxed font-sans mt-0.5">
                                                      {step}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* STUDY NOTES DRAWER: Right Side panel */}
              <div className="hidden w-80 shrink-0 border-l border-slate-100 flex-col bg-slate-50 md:flex">
                <div className="border-b border-slate-100 p-4 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <FileText className="h-4 w-4 text-slate-500" />
                    <span>My Scribble Notepad</span>
                  </div>
                  {notes.length > 0 && (
                    <button
                      onClick={clearNotes}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded hover:bg-slate-50 transition-all font-bold text-2xs flex items-center gap-1"
                      title="Clear Notes"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 p-4 flex flex-col gap-3">
                  <textarea
                    value={notes}
                    onChange={(e) => handleSaveNotes(e.target.value)}
                    placeholder="Scribble notes, formulae, or key concepts here while reading. They automatically save to your profile..."
                    className="flex-1 resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-100"
                  />
                  <div className="text-3xs text-slate-400 flex items-center justify-between font-medium">
                    <span>{notes.length} Characters typed</span>
                    <span className="bg-emerald-100 text-emerald-700 px-1 rounded-sm text-4xs">Saved in local storage</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
