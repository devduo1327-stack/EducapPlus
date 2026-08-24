/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError } from './lib/firebase';
import { UserProfile, QuizAttempt, Chapter, OperationType } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import ReaderModal from './components/ReaderModal';
import QuizSection from './components/QuizSection';
import { BookOpen, GraduationCap, ArrowRight, ShieldCheck, Sparkles, BookOpenText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // High-fidelity interactives states
  const [appLoadingProgress, setAppLoadingProgress] = useState(0);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Slow app loading simulation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      let step = 0.6 + Math.random() * 1.6;
      if (current > 50 && current < 80) {
        step = 0.3 + Math.random() * 0.9;
      } else if (current >= 80) {
        step = 0.1 + Math.random() * 0.45;
      }
      
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsAppLoading(false);
        }, 550);
      }
      setAppLoadingProgress(current);
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Reader state
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('');
  const [readerActiveTab, setReaderActiveTab] = useState<'ncert' | 'ref'>('ncert');

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<{
    subjectId: string;
    subjectName: string;
    chapterId: string;
    chapterName: string;
  } | null>(null);

  // Real-time Authentication monitor
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);

      if (user) {
        setIsLoadingProfile(true);
        const profileRef = doc(db, 'users', user.uid);
        
        try {
          const docSnap = await getDoc(profileRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            // Force Setup: If user logs in but has no profile document, trigger Settings form automatically
            setIsSettingsOpen(true);
          }
        } catch (err) {
          console.error('Failed to load profile settings document:', err);
        } finally {
          setIsLoadingProfile(false);
        }

        // Secure real-time onSnapshot listener for student scores under users/{userId}/quizHistory subcollection
        const quizRef = collection(db, 'users', user.uid, 'quizHistory');
        const unsubQuiz = onSnapshot(quizRef, (snapshot) => {
          const attempts: QuizAttempt[] = [];
          snapshot.forEach((snapDoc) => {
            const data = snapDoc.data();
            // Map timestamps correctly to serialized string for front end
            attempts.push({
              userId: data.userId,
              subjectId: data.subjectId,
              chapterId: data.chapterId,
              score: data.score,
              totalQuestions: data.totalQuestions,
              percentage: data.percentage,
              completedAt: data.completedAt?.toDate ? data.completedAt.toDate().toISOString() : new Date().toISOString()
            });
          });
          // Sort chronology
          attempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
          setQuizAttempts(attempts);
        }, (err) => {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}/quizHistory`);
        });

        return () => unsubQuiz();
      } else {
        setUserProfile(null);
        setQuizAttempts([]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const [authError, setAuthError] = useState<string | null>(null);

  // Auth Operations
  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google authorization popup failure:', err);
      let message = 'An unexpected login error occurred. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'The Google sign-in window was closed before finishing. Please complete the flow to authenticate.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'The sign-in popup was blocked by your browser. Please allow popups or open this app in a direct tab.';
      } else if (err.message && err.message.includes('popup')) {
        message = 'The popup failed to open due to browser restrictions. If using the embedded preview, please open this app in a direct tab first.';
      } else if (err.message) {
        message = err.message;
      }
      setAuthError(message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSelectedChapter(null);
      setActiveQuiz(null);
      setAuthError(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  // Syncing / saving user settings
  const handleSaveProfile = async (updated: Omit<UserProfile, 'userId' | 'updatedAt'>) => {
    if (!currentUser) return;
    const userId = currentUser.uid;
    const path = `users/${userId}`;

    try {
      const profileRef = doc(db, 'users', userId);
      // Construct validated shape conforming to schema rules size and required constraints
      const payload = {
        userId,
        name: updated.name,
        language: updated.language,
        board: updated.board,
        grade: updated.grade,
        updatedAt: serverTimestamp() // server time is security gate matched
      };

      await setDoc(profileRef, payload);
      setUserProfile(payload as unknown as UserProfile);
      setIsSettingsOpen(false);
    } catch (err) {
      console.error('Failed to write profile details:', err);
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  // Callback on successful quiz scoring
  const handleQuizCompleted = (scoreEarned: number) => {
    console.log(`Earned score: ${scoreEarned} points`);
  };

  if (isAppLoading || isLoadingAuth) {
    let statusText = 'AUTHENTICATING SECURE ENVELOPE...';
    if (appLoadingProgress > 15 && appLoadingProgress <= 38) {
      statusText = 'MAPPING TARGET REVISION INDEX (JEE 2028)...';
    } else if (appLoadingProgress > 38 && appLoadingProgress <= 65) {
      statusText = 'COMPILING PHYSICS (H.C. VERMA) & CHEMISTRY STUDY DECKS...';
    } else if (appLoadingProgress > 65 && appLoadingProgress <= 88) {
      statusText = 'PARSING INTERACTIVE CHAPTER EXERCISE SCHEMATICS...';
    } else if (appLoadingProgress > 88 && appLoadingProgress < 100) {
      statusText = 'SYNCHRONIZING EDUCATIONAL REPOSITORY DECK...';
    } else if (appLoadingProgress >= 100) {
      statusText = 'INITIALIZATION SUCCESSFUL.';
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0c0d14] text-white font-sans overflow-hidden select-none relative">
        {/* Dynamic backdrop grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        {/* Decorative corner brackets for high-tech aesthetic */}
        <div className="absolute top-10 left-10 w-6 h-6 border-t-2 border-l-2 border-indigo-500/40 rounded-tl-sm pointer-events-none hidden sm:block" />
        <div className="absolute top-10 right-10 w-6 h-6 border-t-2 border-r-2 border-indigo-500/40 rounded-tr-sm pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 left-10 w-6 h-6 border-b-2 border-l-2 border-indigo-500/40 rounded-bl-sm pointer-events-none hidden sm:block" />
        <div className="absolute bottom-10 right-10 w-6 h-6 border-b-2 border-r-2 border-indigo-500/40 rounded-br-sm pointer-events-none hidden sm:block" />

        <div className="flex flex-col items-center max-w-md w-full px-6 z-10 space-y-6">
          {/* Logo representation in Loading Screen */}
          <div className="space-y-1 text-center">
            <h1 className="text-sm font-bold tracking-[0.3em] text-indigo-400 font-sans uppercase">
              EDUCAP+ PREP HUB
            </h1>
            <h2 className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">
              FRIENDS_PROTOCOL.SYS
            </h2>
          </div>

          {/* Large circular percentage or simple indicator */}
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-500">
              {Math.round(appLoadingProgress)}
            </span>
            <span className="text-lg font-bold text-slate-500 font-mono">%</span>
          </div>

          <div className="w-full space-y-2">
            {/* The progress bar track */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-[1px] border border-slate-700/30">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.7)] transition-all duration-350 ease-out"
                style={{ width: `${appLoadingProgress}%` }}
              />
            </div>
            
            {/* Text telemetry feedback */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-medium pt-1">
              <span className="animate-pulse">{statusText}</span>
              <span className="text-slate-500">STABLE</span>
            </div>
          </div>
        </div>

        {/* Ambient bottom brand attribution line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xs font-mono text-slate-600 tracking-wider">
          SYSTEM.INITIALIZE(FRIENDS_PROTOCOL) // READY
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans" id="applet-main-container">
      {/* Global Navbar */}
      <Navbar
        user={currentUser ? { displayName: currentUser.displayName, email: currentUser.email, photoURL: currentUser.photoURL } : null}
        profile={userProfile}
        scoreCount={quizAttempts.reduce((acc, curr) => acc + curr.score, 0)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="flex-1 w-full flex flex-col">
        {currentUser ? (
          userProfile ? (
            <div className="flex-1">
              {/* If an active Chapter Quiz is launched */}
              {activeQuiz ? (
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                  <QuizSection
                    subjectId={activeQuiz.subjectId}
                    subjectName={activeQuiz.subjectName}
                    chapterId={activeQuiz.chapterId}
                    chapterName={activeQuiz.chapterName}
                    onQuizCompleted={handleQuizCompleted}
                    onCloseQuiz={() => setActiveQuiz(null)}
                  />
                </div>
              ) : (
                /* Primary catalog deck dashboard */
                <Dashboard
                  profile={userProfile}
                  quizAttempts={quizAttempts}
                  onSelectChapter={(ch, sub, type) => {
                    setSelectedChapter(ch);
                    setSelectedSubjectName(sub);
                    setReaderActiveTab(type);
                  }}
                  onSelectQuiz={(subId, subName, chId, chName) => {
                    setActiveQuiz({ subjectId: subId, subjectName: subName, chapterId: chId, chapterName: chName });
                  }}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              )}
            </div>
          ) : (
            /* First registration forced state */
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
              <div className="text-center space-y-3 max-w-sm">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Finalize Setup</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Please configure your localized grade and syllabus board settings to load curriculum booklets.
                </p>
                <button
                  id="btn-force-settings-open"
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-lg"
                >
                  Configure Profile Preferences
                </button>
              </div>
            </div>
          )
        ) : (
          /* GUEST LANDING LOBBY: Visual Greeting with Google Auth call-outs */
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 md:py-24">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              {/* Product value props & interactive guest animation */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative w-full bg-[#f1edfa] border border-[#e2dcf5] rounded-3xl p-8 md:p-12 text-center overflow-hidden shadow-md flex flex-col items-center justify-center min-h-[350px] select-none"
                  id="friends-animation-panel"
                >
                  {/* Glowing ambient background light behind the card */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none focus:outline-none" />

                  {/* Corner Brackets */}
                  <motion.div 
                    animate={{ 
                      x: [-1.5, 1.5, -1.5],
                      y: [-1.5, 1.5, -1.5],
                    }} 
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="absolute top-6 left-6 w-5 h-5 border-t-3 border-l-3 border-[#4338ca] rounded-tl-xs pointer-events-none" 
                  />
                  <motion.div 
                    animate={{ 
                      x: [1.5, -1.5, 1.5],
                      y: [1.5, -1.5, 1.5],
                    }} 
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className="absolute bottom-6 right-6 w-5 h-5 border-b-3 border-r-3 border-[#4338ca] rounded-br-xs pointer-events-none" 
                  />

                  {/* POWERED BY */}
                  <div className="text-2xs font-bold tracking-[0.3em] text-[#8e9bb4] uppercase mb-6 font-sans pointer-events-none relative z-10">
                    POWERED BY
                  </div>

                  {/* FRIENDS */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 250, damping: 15 }}
                    className="relative group cursor-pointer mb-5 z-10"
                    id="friends-logo-wrapper"
                  >
                    <h2 className="text-5xl md:text-6xl italic font-black text-[#1e293b] tracking-tight uppercase select-none drop-shadow-[0_4px_16px_rgba(99,102,241,0.35)] filter friends-hover-style">
                      FRIENDS
                    </h2>
                  </motion.div>

                  {/* Quote & Divider Block */}
                  <div className="max-w-md w-full my-3 relative px-2 z-10 pointer-events-none">
                    <p className="text-xs md:text-sm font-medium text-slate-500 italic mt-1 leading-relaxed font-sans" id="friends-quote-text">
                      "Cracking JEE 2028 is our Target. For it we should focus only on studies, so hurry up because time doesn't wait for anyone."
                    </p>
                    
                    {/* Horizontal Line Divider (with pulsing glow) */}
                    <div className="relative w-full h-[1px] bg-slate-200 mt-6 mb-6">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-indigo-600 to-transparent"
                      />
                    </div>
                  </div>

                  {/* SYSTEM command */}
                  <motion.div
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="font-mono text-2xs md:text-xs text-[#4f46e5] font-bold tracking-wider bg-white/60 px-4.5 py-1.5 rounded-lg border border-indigo-100 shadow-2xs z-10 pointer-events-none"
                    id="friends-protocol-initialize"
                  >
                    SYSTEM.INITIALIZE(FRIENDS_PROTOCOL)
                  </motion.div>
                </motion.div>
              </div>

              {/* Login Lobby Action Card */}
              <div className="md:col-span-5 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-xl space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Sign In to Continue</h3>
                  <p className="text-3xs text-slate-400 font-medium">Safe student-verified authorization platform</p>
                </div>

                {authError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-3xs text-amber-900 leading-relaxed text-left space-y-2"
                  >
                    <div className="font-bold flex items-center gap-1.5 text-2xs uppercase tracking-wide text-amber-800">
                      <svg className="h-4 w-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Authorization Notice</span>
                    </div>
                    <p>{authError}</p>
                    <div className="pt-1.5 border-t border-amber-200/40 text-4xs text-amber-700/90 leading-relaxed">
                      💡 <strong>Iframe Hint:</strong> Embedded previews often block cookies/popups by default. To bypass this, simply click the <strong>Open in a new tab</strong> button at the top-right of the preview and connect from there!
                    </div>
                  </motion.div>
                )}

                {/* Google Sign-in button */}
                <button
                  id="btn-google-auth-login-lobby"
                  onClick={handleSignIn}
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all active:scale-98"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#ea4335" d="M12 11h11.24v3H12V11z" />
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Connect with Google Student Auth</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-1 border-t border-slate-100" />
                  <span className="px-2.5 text-4xs text-slate-400 font-mono uppercase">Certified Security</span>
                  <div className="flex-1 border-t border-slate-100" />
                </div>

                <div className="flex items-center gap-3 justify-center text-3xs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>OAuth Protected</span>
                  </div>
                  <span className="font-bold">•</span>
                  <span>SSL encryption active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Academic Setup Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Book simulated reading viewport */}
      <ReaderModal
        isOpen={selectedChapter !== null}
        onClose={() => setSelectedChapter(null)}
        chapter={selectedChapter}
        subjectName={selectedSubjectName}
        userProfile={userProfile}
        activePublication={readerActiveTab}
      />
    </div>
  );
}
