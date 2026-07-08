/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Award, GraduationCap, ChevronRight } from 'lucide-react';
import { GameMode, UserProgress } from '../types';
import { MascotMessage } from './MascotMessage';

interface DashboardViewProps {
  progress: UserProgress;
  onChangeMode: (mode: GameMode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ progress, onChangeMode }) => {
  const cards = [
    {
      id: 'flashcards',
      title: '១. ស្គាល់លេខខ្មែរ និងលេខសកល',
      subtitle: 'Learn Numbers',
      desc: 'ស្វែងយល់ពីលេខខ្មែរ លេខសកល អក្សរខ្មែរ និងរូបភាពតំណាងឱ្យច្បាស់លាស់។',
      color: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      tag: 'សាកសមបំផុតដំបូង',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'counting',
      title: '២. ហាត់រាប់ចំនួនរូបភាព',
      subtitle: 'Count Objects',
      desc: 'រៀនរាប់ចំនួនសត្វ ផ្លែឈើ និងផ្កាយសប្បាយៗដោយការចុះប៉ះផ្ទាល់។',
      color: 'from-sky-400 to-blue-500',
      shadowColor: 'shadow-blue-500/25',
      icon: <Sparkles className="w-8 h-8 text-white" />,
      tag: 'រៀនយល់រហ័ស',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'tracing',
      title: '៣. ហាត់សរសេរលេខខ្មែរ',
      subtitle: 'Trace Khmer Numbers',
      desc: 'ហាត់សរសេរលេខ ០ ដល់ ១០ ដោយដៃផ្ទាល់នៅលើក្តារខៀនអន្តរកម្ម។',
      color: 'from-pink-400 to-rose-500',
      shadowColor: 'shadow-rose-500/25',
      icon: <Award className="w-8 h-8 text-white" />,
      tag: 'ហាត់ដៃទន់ភ្លន់',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'quiz',
      title: '៤. លំហាត់អនុវត្តកម្សាន្ត',
      subtitle: 'Play Quizzes',
      desc: 'លេងល្បែងឆ្លើយសំណួរ ផ្គូផ្គង និងស្តាប់សំឡេងដើម្បីប្រមូលផ្កាយរង្វាន់!',
      color: 'from-amber-400 to-orange-500',
      shadowColor: 'shadow-orange-500/25',
      icon: <Trophy className="w-8 h-8 text-white" />,
      tag: 'ប្រឡងយកពានរង្វាន់',
      badgeColor: 'bg-amber-100 text-amber-800'
    }
  ];

  // Calculate percentages
  const learnPercent = Math.min(100, Math.round((progress.completedFlashcards.length / 11) * 100));
  const countPercent = Math.min(100, Math.round((progress.completedCounting.length / 11) * 100));
  const tracePercent = Math.min(100, Math.round((progress.completedTracing.length / 11) * 100));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="dashboard-view-root">
      {/* Welcome Mascot */}
      <MascotMessage
        message="សួស្តីកូនៗជាទីស្រឡាញ់! ស្វាគមន៍មកកាន់ពិភពលេខខ្មែរ! តោះចូលរួមរៀន ស្គាល់ រាប់ សរសេរលេខ និងលេងល្បែងឆ្លើយសំណួរជាមួយបណ្ឌិតទីទុយណា!"
        mode="happy"
        autoSpeak={true}
      />

      {/* Main Feature Cards Grid */}
      <h2 className="font-sans text-2xl font-black text-amber-800 mb-6 text-center md:text-left flex items-center gap-2 justify-center md:justify-start" id="learning-path-title">
        <Sparkles className="w-6 h-6 text-amber-500" />
        តោះជ្រើសរើសមេរៀន៖
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" id="dashboard-cards-grid">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChangeMode(card.id as GameMode)}
            className="bg-white rounded-3xl border-4 border-amber-200 overflow-hidden cursor-pointer shadow-[0_8px_0_#fde68a] hover:shadow-[0_12px_0_#fcd34d] hover:border-amber-400 transition-all duration-300 flex flex-col justify-between"
            id={`dashboard-card-${card.id}`}
          >
            <div className="p-6">
              {/* Header inside card */}
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-tr ${card.color} shadow-lg ${card.shadowColor} border-2 border-white`}>
                  {card.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold shadow-sm ${card.badgeColor}`}>
                  {card.tag}
                </span>
              </div>
              
              <h3 className="font-sans text-xl font-black text-amber-950 leading-snug">
                {card.title}
              </h3>
              <p className="font-sans text-xs font-black text-amber-700/80 mb-3 tracking-wider uppercase">
                {card.subtitle}
              </p>
              <p className="font-sans text-sm md:text-base text-amber-900/85 leading-relaxed font-medium">
                {card.desc}
              </p>
            </div>
            
            <div className="bg-amber-50/50 px-6 py-4 border-t-2 border-amber-100/80 flex items-center justify-between">
              {/* Simple progress bar preview */}
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-xs font-sans font-bold text-amber-900/70 mb-1">
                  <span>វឌ្ឍនភាព (Progress)</span>
                  <span>
                    {card.id === 'flashcards' && `${progress.completedFlashcards.length}/11`}
                    {card.id === 'counting' && `${progress.completedCounting.length}/11`}
                    {card.id === 'tracing' && `${progress.completedTracing.length}/11`}
                    {card.id === 'quiz' && `ពិន្ទុខ្ពស់៖ ${progress.quizHighScore}`}
                  </span>
                </div>
                {card.id !== 'quiz' ? (
                  <div className="w-full h-2.5 bg-amber-100/80 rounded-full overflow-hidden border border-amber-200">
                    <div
                      className={`h-full bg-gradient-to-r ${card.color}`}
                      style={{
                        width: `${
                          card.id === 'flashcards' ? learnPercent :
                          card.id === 'counting' ? countPercent :
                          card.id === 'tracing' ? tracePercent : 0
                        }%`
                      }}
                    ></div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Sparkles
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(progress.quizHighScore / 2)
                            ? 'text-amber-500 fill-amber-400 animate-pulse'
                            : 'text-amber-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <ChevronRight className="w-6 h-6 text-amber-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress & Stat Summary Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white text-amber-950 rounded-[32px] md:rounded-[40px] p-8 shadow-2xl relative overflow-hidden border-8 border-white ring-4 ring-amber-100/80"
        id="dashboard-stats-banner"
      >
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-48 h-48 rounded-full bg-amber-100/30 blur-xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-32 h-32 rounded-full bg-amber-100/30 blur-lg"></div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <div>
            <h3 className="font-sans text-2xl font-black text-amber-950 mb-2">
              សាលមហោស្រពសមិទ្ធផលកូនតូច
            </h3>
            <p className="font-sans text-sm md:text-base font-bold text-amber-800/90 max-w-xl">
              រៀនកាន់តែច្រើន សរសេរកាន់តែពូកែ ដើម្បីប្រមូលមេដាយកិត្តិយស និងកាក់ផ្កាយមាសពីលោកគ្រូទីទុយ!
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6" id="dashboard-mini-stats">
            <div className="bg-amber-50/80 border-4 border-amber-100 px-5 py-4 rounded-2xl flex flex-col items-center min-w-[100px] shadow-sm">
              <span className="font-sans text-3xl font-black text-amber-600">{progress.stars}</span>
              <span className="font-sans text-xs font-bold mt-1 text-amber-800/80">ផ្កាយសរុប</span>
            </div>
            <div className="bg-amber-50/80 border-4 border-amber-100 px-5 py-4 rounded-2xl flex flex-col items-center min-w-[100px] shadow-sm">
              <span className="font-sans text-3xl font-black text-amber-600">{progress.completedFlashcards.length}/11</span>
              <span className="font-sans text-xs font-bold mt-1 text-amber-800/80">ស្គាល់លេខ</span>
            </div>
            <div className="bg-amber-50/80 border-4 border-amber-100 px-5 py-4 rounded-2xl flex flex-col items-center min-w-[100px] shadow-sm">
              <span className="font-sans text-3xl font-black text-amber-600">{progress.completedTracing.length}/11</span>
              <span className="font-sans text-xs font-bold mt-1 text-amber-800/80">សរសេរត្រូវ</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
