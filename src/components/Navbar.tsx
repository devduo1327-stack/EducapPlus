/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, LogOut, Settings, Award, GraduationCap, Globe, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  profile: UserProfile | null;
  scoreCount: number;
  onOpenSettings: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export default function Navbar({
  user,
  profile,
  scoreCount,
  onOpenSettings,
  onSignIn,
  onSignOut
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200">
            <BookOpen className="h-5 w-5" id="nav-brand-icon" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl font-sans">
              EduCap+
            </span>
          </div>
        </div>

        {/* User Academic Badge Summary (if logged in) */}
        {user && profile && (
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-100">
              <GraduationCap className="h-4 w-4 text-blue-500" />
              <span>Grade {profile.grade}</span>
              <span className="h-3 w-px bg-slate-200 mx-1" />
              <span className="text-indigo-600 uppercase">{profile.board}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-100">
              <Globe className="h-3.5 w-3.5 text-amber-500" />
              <span>{profile.language} Medium</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              <Award className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span>{scoreCount} Points</span>
            </div>
          </div>
        )}

        {/* Auth / Settings Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Settings button */}
              <button
                id="btn-settings-toggle"
                onClick={onOpenSettings}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors relative"
                title="Academic Settings"
              >
                <Settings className="h-4.5 w-4.5" />
              </button>

              {/* User Avatar & Name */}
              <div className="flex items-center gap-2 pl-1 border-l border-gray-100">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Student'}
                    className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold text-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <span className="hidden max-w-[100px] truncate text-sm font-medium text-gray-700 lg:block">
                  {profile?.name || user.displayName || 'Student'}
                </span>
              </div>

              {/* Logout */}
              <button
                id="btn-logout-auth"
                onClick={onSignOut}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <motion.button
              id="btn-google-login-nav"
              whileTap={{ scale: 0.98 }}
              onClick={onSignIn}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-100 transition-colors"
            >
              <svg className="h-4 w-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.43 10.55-10.712 0-.727-.08-1.28-.173-1.83H12.24z" />
              </svg>
              <span>Sign In with Google</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
