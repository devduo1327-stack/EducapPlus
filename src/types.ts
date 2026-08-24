/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  userId: string;
  name: string;
  language: string; // "English", "Hindi"
  board: string;    // "CBSE", "ICSE", "State Board"
  state?: string;   // "Uttar Pradesh (UPMSP)", "Bihar (BSEB)", etc.
  grade: string;    // "11", "12"
  updatedAt: string; // ISO String (used in Firestore)
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  summary: string;
  topics: string[];
  ncertSolutions: SolutionItem[];
  refSolutions: PublicationSolution[];
  boards?: string[]; // e.g. ["CBSE", "ICSE", "State Board"]
}

export interface SolutionItem {
  id: string;
  question: string;
  answer: string;
  stepByStep: string[];
}

export interface PublicationSolution {
  publicationName: string; // e.g. "RD Sharma" or "HC Verma"
  author: string;
  problemId: string;
  question: string;
  answer: string;
  stepByStep: string[];
}

export interface SubjectData {
  id: string;
  name: string;
  hindiName: string;
  color: string;
  chapters: Chapter[];
}

export interface QuizAttempt {
  userId: string;
  subjectId: string;
  chapterId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
