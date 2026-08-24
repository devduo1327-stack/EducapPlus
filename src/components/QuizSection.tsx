/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Award, Trophy, ChevronRight, CheckCircle, XCircle, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { QuizQuestion, OperationType } from '../types';
import { CHAPTER_QUIZZES } from '../data/quizzes';

interface QuizSectionProps {
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  onQuizCompleted: (scoreEarned: number) => void;
  onCloseQuiz: () => void;
}

export default function QuizSection({
  subjectId,
  subjectName,
  chapterId,
  chapterName,
  onQuizCompleted,
  onCloseQuiz
}: QuizSectionProps) {
  const quizQuestions: QuizQuestion[] = CHAPTER_QUIZZES[chapterId] || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  if (quizQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-12 text-center">
        <HelpCircle className="h-12 w-12 text-slate-300 mb-4 animate-bounce" />
        <h3 className="text-base font-bold text-slate-800">No built-in quiz for this chapter yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          We are preparing new questions aligned to this year\'s newest syllabus updates. Check back tomorrow!
        </p>
        <button
          onClick={onCloseQuiz}
          className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
        >
          Back to Chapter Hub
        </button>
      </div>
    );
  }

  const activeQuestion = quizQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || hasSubmitted) return;
    setHasSubmitted(true);
    if (selectedOpt === activeQuestion.correctAnswerIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    setSelectedOpt(null);
    setHasSubmitted(false);

    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Complete & save score to firestore
      setIsDone(true);
      onQuizCompleted(correctCount * 10); // 10 pts per correct answer
      await handleSaveAttempt(correctCount);
    }
  };

  const handleSaveAttempt = async (score: number) => {
    const user = auth.currentUser;
    if (!user) return;
    setIsSaving(true);
    const attemptId = `q_${Date.now()}`;
    const userPath = `users/${user.uid}/quizHistory/${attemptId}`;
    try {
      // Construct exact schema corresponding to rules checking
      const quizRef = doc(db, 'users', user.uid, 'quizHistory', attemptId);
      const payload = {
        userId: user.uid,
        subjectId,
        chapterId,
        score: score,
        totalQuestions: quizQuestions.length,
        percentage: Number(((score / quizQuestions.length) * 100).toFixed(1)),
        completedAt: serverTimestamp() // temporal security assertion
      };
      
      await setDoc(quizRef, payload);
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('failed');
      console.error(err);
      // Strict rule: throwing on permissions/execution errors using handleFirestoreError
      handleFirestoreError(err, OperationType.CREATE, userPath);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setHasSubmitted(false);
    setCorrectCount(0);
    setIsDone(false);
    setSaveStatus('idle');
  };

  const percentageScore = Math.round((correctCount / quizQuestions.length) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white border border-slate-100 shadow-xl overflow-hidden">
      {/* Quiz Top status banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-2xs font-bold text-blue-400 tracking-wider uppercase block">
            Practice Chapter Assessment
          </span>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
            <span>{chapterName}</span>
            <span className="text-3xs font-normal text-slate-400">({subjectName})</span>
          </h3>
        </div>
        <button
          onClick={onCloseQuiz}
          className="rounded-lg bg-white/10 text-slate-300 hover:text-white px-3 py-1 text-2xs font-bold transition-all hover:bg-white/15"
        >
          Exit Assessment
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div
            key="quiz-body"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-6 md:p-8 space-y-6"
          >
            {/* Horizontal Timeline Indicators */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Problem {currentIdx + 1} of {quizQuestions.length}</span>
                <span>{percentageScore}% Perfect</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* MCQ Question Area */}
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-800 font-sans leading-relaxed">
                {activeQuestion.question}
              </h4>

              {/* Options buttons */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {activeQuestion.options.map((option, i) => {
                  const isCurSelected = selectedOpt === i;
                  let optionStyle = 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50';

                  if (isCurSelected && !hasSubmitted) {
                    optionStyle = 'border-blue-600 bg-blue-50/30 text-blue-900 shadow-2xs font-semibold';
                  }

                  if (hasSubmitted) {
                    if (i === activeQuestion.correctAnswerIndex) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold';
                    } else if (isCurSelected) {
                      optionStyle = 'border-rose-300 bg-rose-50/50 text-rose-950';
                    } else {
                      optionStyle = 'border-slate-100 bg-slate-50/20 text-slate-400 pointer-events-none';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={hasSubmitted}
                      className={`flex w-full items-center justify-between p-3.5 rounded-xl border text-left text-xs tracking-normal transition-all duration-150 ${optionStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-md text-3xs font-bold font-mono border ${
                          isCurSelected ? 'border-blue-500 text-blue-600' : 'border-slate-200 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-relaxed mt-0.5">{option}</span>
                      </div>
                      
                      {hasSubmitted && i === activeQuestion.correctAnswerIndex && (
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      )}
                      {hasSubmitted && isCurSelected && i !== activeQuestion.correctAnswerIndex && (
                        <XCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Explanations Panel */}
            <AnimatePresence>
              {hasSubmitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-current-10 overflow-hidden bg-slate-50 border border-slate-100 p-4"
                >
                  <span className="text-2xs font-bold uppercase tracking-wider block mb-1 text-slate-500">
                    Syllabus Verified Explanation:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans mt-0.5">
                    {activeQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Control buttons */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              {!hasSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOpt === null}
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>Submit Answer</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5 animate-pulse"
                >
                  <span>
                    {currentIdx < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 text-center space-y-6"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-4 shadow-md shadow-amber-100">
                <Trophy className="h-8 w-8 text-amber-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Great Job! Chapter Completed</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                You scored <strong className="text-blue-600 font-mono text-sm">{correctCount}/{quizQuestions.length}</strong> correct. That translates to some impressive progress tracking!
              </p>
            </div>

            {/* Score Ring */}
            <div className="relative inline-flex items-center justify-center h-28 w-28 rounded-full border-4 border-slate-100 bg-slate-50 shadow-inner">
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-800 font-mono">{percentageScore}%</span>
                <span className="text-3xs font-semibold text-slate-400 capitalize">Accuracy</span>
              </div>
            </div>

            {/* Database syncing status */}
            <div className="flex justify-center">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs font-semibold border ${
                isSaving
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : saveStatus === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {isSaving ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent" />
                    <span>Syncing with Cloud Database...</span>
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Attempt Saved in Cloud Profile</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    <span>Local Session Active (Unsaved)</span>
                  </>
                )}
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-center gap-3 border-t border-slate-100">
              <button
                onClick={handleRestartQuiz}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                id="btn-quiz-retry"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onCloseQuiz}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Return to Chapter Hub
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
