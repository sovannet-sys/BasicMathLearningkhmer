/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FlashcardView } from './components/FlashcardView';
import { CountingView } from './components/CountingView';
import { TracingView } from './components/TracingView';
import { QuizView } from './components/QuizView';
import { GameMode, UserProgress, Achievement } from './types';
import { ACHIEVEMENTS } from './data';
import { playSuccess, speakKhmer } from './utils/audio';
import { Sparkles, Award } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'khmer_numbers_learner_progress_v2';

const initialProgress: UserProgress = {
  stars: 0,
  completedFlashcards: [],
  completedTracing: [],
  completedCounting: [],
  quizHighScore: 0,
  completedAchievements: []
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('dashboard');
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);

  // Load progress on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }, []);

  // Update and save progress helper
  const handleUpdateProgress = (updater: (prev: UserProgress) => UserProgress) => {
    setProgress((prev) => {
      const updated = updater(prev);
      
      // Perform Achievements check on the updated progress!
      const finalProgressWithAchievements = checkAchievements(updated);

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalProgressWithAchievements));
      } catch (e) {
        console.warn('LocalStorage save failed:', e);
      }
      return finalProgressWithAchievements;
    });
  };

  const checkAchievements = (current: UserProgress): UserProgress => {
    const newlyCompleted: string[] = [...current.completedAchievements];
    let addedStars = 0;
    let unlockedObj: Achievement | null = null;

    ACHIEVEMENTS.forEach((ach) => {
      if (newlyCompleted.includes(ach.id)) return;

      let metCondition = false;
      switch (ach.type) {
        case 'stars':
          metCondition = current.stars >= ach.targetCount;
          break;
        case 'flashcards':
          metCondition = current.completedFlashcards.length >= ach.targetCount;
          break;
        case 'counting':
          metCondition = current.completedCounting.length >= ach.targetCount;
          break;
        case 'tracing':
          metCondition = current.completedTracing.length >= ach.targetCount;
          break;
        case 'quiz':
          metCondition = current.quizHighScore >= 4; // Adjusted to match 5-question limit (80% score)
          break;
      }

      if (metCondition) {
        newlyCompleted.push(ach.id);
        addedStars += ach.rewardStar;
        unlockedObj = ach;
      }
    });

    if (unlockedObj) {
      // Trigger achievement unlocked overlay
      setNewlyUnlockedAchievement(unlockedObj);
      playSuccess();
      const achTitle = (unlockedObj as Achievement).title;
      speakKhmer(`អបអរសាទរកូន! កូនបានទទួលមេដាយកិត្តិយស ${achTitle} ហើយ!`);
    }

    return {
      ...current,
      stars: current.stars + addedStars,
      completedAchievements: newlyCompleted
    };
  };

  const handleResetProgress = () => {
    setProgress(initialProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialProgress));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    setCurrentMode('dashboard');
    speakKhmer('កំណត់វឌ្ឍនភាពឡើងវិញបានជោគជ័យ!');
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      speakKhmer('បើកសំឡេងជោគជ័យ!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col justify-between" id="app-viewport">
      {/* Dynamic Header */}
      <Navbar
        currentMode={currentMode}
        onChangeMode={(mode) => {
          setCurrentMode(mode);
          speakKhmer(`មេរៀន ${mode === 'dashboard' ? 'ទំព័រដើម' : mode === 'flashcards' ? 'ស្គាល់លេខ' : mode === 'counting' ? 'ហាត់រាប់' : mode === 'tracing' ? 'ហាត់សរសេរ' : 'លំហាត់អនុវត្ត'}`);
        }}
        progress={progress}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetProgress={handleResetProgress}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {currentMode === 'dashboard' && (
              <DashboardView progress={progress} onChangeMode={setCurrentMode} />
            )}

            {currentMode === 'flashcards' && (
              <FlashcardView progress={progress} onUpdateProgress={handleUpdateProgress} />
            )}

            {currentMode === 'counting' && (
              <CountingView progress={progress} onUpdateProgress={handleUpdateProgress} />
            )}

            {currentMode === 'tracing' && (
              <TracingView progress={progress} onUpdateProgress={handleUpdateProgress} />
            )}

            {currentMode === 'quiz' && (
              <QuizView progress={progress} onUpdateProgress={handleUpdateProgress} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Achievements Unlocked Celebratory Banner overlay */}
      <AnimatePresence>
        {newlyUnlockedAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-center"
            id="achievement-popup-overlay"
          >
            <div className="bg-white border-4 border-amber-400 rounded-3xl p-8 max-w-sm shadow-2xl relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-24 h-24 rounded-full bg-amber-100/50"></div>
              
              <div className="bg-amber-100 text-amber-600 p-4 rounded-full mb-4 animate-bounce">
                <Award className="w-12 h-12 stroke-[2]" />
              </div>

              <h3 className="font-sans text-2xl font-black text-slate-800 mb-1">
                មេដាយកិត្តិយសថ្មី!
              </h3>
              <p className="font-sans text-xs font-black text-amber-500 tracking-wider uppercase mb-3">
                Achievement Unlocked
              </p>

              <h4 className="font-sans text-lg font-black text-amber-700 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full mb-2 shadow-inner">
                {newlyUnlockedAchievement.title}
              </h4>
              <p className="font-sans text-sm text-slate-500 font-bold mb-6">
                {newlyUnlockedAchievement.description}
              </p>

              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-sans font-black flex items-center gap-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>រង្វាន់បន្ថែម៖ +{newlyUnlockedAchievement.rewardStar} ផ្កាយមាស 🌟</span>
              </div>

              <button
                onClick={() => setNewlyUnlockedAchievement(null)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-sans font-black text-base rounded-2xl shadow-md transition-all cursor-pointer"
                id="close-achievement-btn"
              >
                ចាស៎/បាទ ទទួលរង្វាន់
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative clean footer */}
      <footer className="mt-8 flex flex-col items-center justify-center gap-4 pb-12 px-4 text-center" id="app-footer-brand">
        <div className="flex gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-12 h-3 rounded-full bg-amber-300"></div>
          <div className="w-3 h-3 rounded-full bg-amber-200"></div>
          <div className="w-3 h-3 rounded-full bg-amber-200"></div>
          <div className="w-3 h-3 rounded-full bg-amber-200"></div>
        </div>
        <p className="font-sans text-xs text-amber-700/80 font-bold">
          © 2026 រៀនលេខខ្មែរ - Khmer Number Academy. រចនាឡើងដើម្បីជួយសិស្សឱ្យរីកចម្រើនយ៉ាងរហ័ស។
        </p>
      </footer>
    </div>
  );
}
