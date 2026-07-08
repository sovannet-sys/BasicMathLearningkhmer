/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Award, Home, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { GameMode, UserProgress } from '../types';

interface NavbarProps {
  currentMode: GameMode;
  onChangeMode: (mode: GameMode) => void;
  progress: UserProgress;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onChangeMode,
  progress,
  soundEnabled,
  onToggleSound,
  onResetProgress
}) => {
  const getNavClass = (mode: GameMode) => {
    const isActive = currentMode === mode;
    return `flex items-center gap-2 px-4 py-2 rounded-2xl font-sans text-sm md:text-base font-black transition-all duration-150 border-2 ${
      isActive
        ? 'bg-amber-500 text-white border-amber-600 shadow-[0_4px_0_#d97706]'
        : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-300'
    }`;
  };

  return (
    <header className="bg-white border-b-4 border-amber-200 py-4 px-6 shadow-sm rounded-2xl md:rounded-[32px] max-w-7xl w-[95%] mx-auto mt-4 sticky top-4 z-50 ring-4 ring-amber-100" id="app-header">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Brand Logo and Title */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onChangeMode('dashboard')} id="header-brand">
          <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-inner border-2 border-amber-300">
            ១២
          </div>
          <div>
            <h1 className="font-sans text-3xl font-black text-amber-900 leading-tight">
              រៀនលេខខ្មែរ
            </h1>
            <p className="font-sans text-sm font-bold text-amber-700">
              រៀនសប្បាយជាមួយរូបភាព
            </p>
          </div>
        </div>

        {/* Dynamic Nav Tabs */}
        <nav className="flex flex-wrap justify-center gap-2 md:gap-3" id="header-navigation">
          <button onClick={() => onChangeMode('dashboard')} className={getNavClass('dashboard')} id="nav-btn-home">
            <Home className="w-4 h-4" />
            <span>ទំព័រដើម</span>
          </button>
          
          <button onClick={() => onChangeMode('flashcards')} className={getNavClass('flashcards')} id="nav-btn-flash">
            <Award className="w-4 h-4" />
            <span>ស្គាល់លេខ</span>
          </button>

          <button onClick={() => onChangeMode('counting')} className={getNavClass('counting')} id="nav-btn-count">
            <Sparkles className="w-4 h-4" />
            <span>ហាត់រាប់</span>
          </button>

          <button onClick={() => onChangeMode('tracing')} className={getNavClass('tracing')} id="nav-btn-trace">
            <Award className="w-4 h-4" />
            <span>ហាត់សរសេរ</span>
          </button>

          <button onClick={() => onChangeMode('quiz')} className={getNavClass('quiz')} id="nav-btn-quiz">
            <Trophy className="w-4 h-4" />
            <span>លំហាត់អនុវត្ត</span>
          </button>
        </nav>

        {/* Status Indicators (Stars and Settings) */}
        <div className="flex items-center gap-4" id="header-status">
          {/* Stars Counter */}
          <motion.div
            key={progress.stars}
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-white px-4 py-2 rounded-2xl shadow-md border-2 border-white"
            id="stars-badge"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
            >
              <Sparkles className="w-5 h-5 fill-white text-yellow-100" />
            </motion.div>
            <span className="font-sans text-lg font-black tracking-wider">
              {progress.stars}
            </span>
            <span className="font-sans text-xs font-bold opacity-90 hidden sm:inline">
              ផ្កាយ
            </span>
          </motion.div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2.5 rounded-2xl border-4 transition-all duration-200 active:scale-95 shadow-md ${
              soundEnabled
                ? 'bg-white border-amber-400 text-amber-700 hover:bg-amber-50'
                : 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100'
            }`}
            title={soundEnabled ? "បិទសំឡេង" : "បើកសំឡេង"}
            id="sound-toggle-btn"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm("តើអ្នកពិតជាចង់កំណត់វឌ្ឍនភាពឡើងវិញមែនទេ?")) {
                onResetProgress();
              }
            }}
            className="p-2.5 bg-white border-4 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all duration-200 active:scale-95 shadow-md"
            title="កំណត់វឌ្ឍនភាពឡើងវិញ"
            id="reset-progress-btn"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
