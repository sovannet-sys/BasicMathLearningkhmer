/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NumberData {
  value: number;
  khmerSymbol: string;
  arabicSymbol: string;
  khmerWord: string;
  pronunciationGuide: string;
  itemName: string; // e.g. "ផ្លែប៉ោម" (Apple), "មេអំបៅ" (Butterfly)
  itemIcon: string; // Lucide icon name or emoji/SVG category
  color: string; // Tailwind color classes for background/accents
  borderColor: string;
  textColor: string;
}

export type GameMode = 'dashboard' | 'flashcards' | 'counting' | 'tracing' | 'quiz' | 'achievements';

export interface QuizQuestion {
  id: string;
  type: 'count' | 'match_khmer' | 'match_arabic' | 'missing_sequence' | 'listening';
  questionText: string;
  options: {
    id: string;
    khmerSymbol: string;
    arabicSymbol: string;
    khmerWord: string;
    value: number;
  }[];
  correctAnswerId: string;
  visualItemsCount?: number;
  visualItemsType?: string;
  sequence?: (number | null)[]; // e.g., [3, 4, null, 6]
}

export interface UserProgress {
  stars: number;
  completedFlashcards: number[]; // values 0-10
  completedTracing: number[];    // values 0-10
  completedCounting: number[];   // values 0-10
  quizHighScore: number;
  completedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  targetCount: number;
  type: 'stars' | 'flashcards' | 'tracing' | 'counting' | 'quiz';
  rewardStar: number;
}
