/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Trophy, Volume2 } from 'lucide-react';
import { KHMER_NUMBERS } from '../data';
import { UserProgress } from '../types';
import { MascotMessage } from './MascotMessage';
import { renderItemSvg } from '../utils/visuals';
import { playPop, playSuccess, speakKhmer } from '../utils/audio';

interface CountingViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

interface InteractiveItem {
  id: number;
  x: number; // percentage width
  y: number; // percentage height
  scale: number;
  rotation: number;
  isTapped: boolean;
  tapOrder?: number;
}

export const CountingView: React.FC<CountingViewProps> = ({ progress, onUpdateProgress }) => {
  const [targetNumber, setTargetNumber] = useState<number>(3);
  const [items, setItems] = useState<InteractiveItem[]>([]);
  const [tappedCount, setTappedCount] = useState<number>(0);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [theme, setTheme] = useState<'meadow' | 'sky' | 'aquarium'>('meadow');

  // Randomize a new game level
  const generateLevel = () => {
    // Select a random number between 1 and 10
    const nextVal = Math.floor(Math.random() * 10) + 1;
    setTargetNumber(nextVal);
    setTappedCount(0);
    setIsVictory(false);

    // Randomize background theme
    const themes: ('meadow' | 'sky' | 'aquarium')[] = ['meadow', 'sky', 'aquarium'];
    const chosenTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(chosenTheme);

    // Generate items with non-overlapping positions (approximately)
    const newItems: InteractiveItem[] = [];
    for (let i = 0; i < nextVal; i++) {
      // Find suitable random positions
      let attempts = 0;
      let posX = 0;
      let posY = 0;
      let tooClose = true;

      while (tooClose && attempts < 50) {
        posX = 15 + Math.random() * 70; // 15% to 85% range
        posY = 20 + Math.random() * 60; // 20% to 80% range
        attempts++;

        // Verify distance from existing items
        tooClose = newItems.some((item) => {
          const dx = item.x - posX;
          const dy = item.y - posY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < 15; // Minimum distance
        });
      }

      newItems.push({
        id: i,
        x: posX,
        y: posY,
        scale: 0.85 + Math.random() * 0.3,
        rotation: -25 + Math.random() * 50,
        isTapped: false
      });
    }

    setItems(newItems);
  };

  // Start initial level
  useEffect(() => {
    generateLevel();
  }, []);

  const handleItemTap = (item: InteractiveItem) => {
    if (item.isTapped || isVictory) return;

    playPop();
    const nextOrder = tappedCount + 1;
    setTappedCount(nextOrder);

    // Speak Khmer counting aloud
    const khmerCountWord = KHMER_NUMBERS[nextOrder]?.khmerWord || nextOrder.toString();
    speakKhmer(khmerCountWord);

    // Mark item as tapped
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, isTapped: true, tapOrder: nextOrder } : it))
    );

    // Check if game is won
    if (nextOrder === targetNumber) {
      setIsVictory(true);
      playSuccess();
      
      // Speak positive praise
      setTimeout(() => {
        const targetKhmer = KHMER_NUMBERS[targetNumber];
        speakKhmer(`អស្ចារ្យណាស់កូន! កូនរាប់បាន ${targetKhmer.khmerSymbol} ផ្លែឈើ!`);
      }, 800);

      // Award star and record progress
      onUpdateProgress((prev) => {
        const isAlreadyDone = prev.completedCounting.includes(targetNumber);
        return {
          ...prev,
          stars: prev.stars + (isAlreadyDone ? 0 : 2), // 2 stars for new counting milestone
          completedCounting: isAlreadyDone
            ? prev.completedCounting
            : [...prev.completedCounting, targetNumber]
        };
      });
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'sky':
        return {
          bg: 'bg-gradient-to-b from-sky-300 via-sky-200 to-amber-50',
          title: 'ប៉េងប៉ោងហោះហើរក្នុងមេឃ',
          icon: 'balloon',
          decor: '🌤️ ☁️ 🎈'
        };
      case 'aquarium':
        return {
          bg: 'bg-gradient-to-b from-cyan-400 via-teal-200 to-emerald-100',
          title: 'ត្រីហែលលេងក្នុងបឹងទឹកថ្លា',
          icon: 'fish',
          decor: '💧 🐚 🌊 🫧'
        };
      case 'meadow':
      default:
        return {
          bg: 'bg-gradient-to-b from-emerald-100 via-green-50 to-lime-100',
          title: 'មេអំបៅហោះហើរលើវាលស្មៅ',
          icon: 'butterfly',
          decor: '🌸 🌻 🌿 🐞'
        };
    }
  };

  const currentTheme = getThemeStyles();
  const targetKhmerData = KHMER_NUMBERS[targetNumber];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="counting-view-root">
      {/* Dynamic Mascot Guidance */}
      <MascotMessage
        message={
          isVictory
            ? `ពូកែណាស់កូន! កូនបានរាប់ ${currentTheme.title} គ្រប់ចំនួន ${targetKhmerData?.khmerSymbol} (${targetKhmerData?.khmerWord}) ឥតខ្ចោះ!`
            : `តោះជួយបណ្ឌិតទីទុយរាប់ ${currentTheme.title} ទាំងអស់គ្នា! ចុចលើរូបមួយៗដើម្បីរាប់ណា!`
        }
        mode={isVictory ? 'cheering' : 'happy'}
        autoSpeak={false}
      />

      <div className="bg-white rounded-[32px] md:rounded-[40px] border-8 border-white ring-4 ring-amber-100/80 shadow-2xl overflow-hidden p-6 md:p-8" id="counting-game-board">
        {/* Game Stats & Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b-2 border-amber-100">
          <div>
            <h3 className="font-sans text-xl font-black text-amber-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>ល្បែងរាប់រូបភាពសប្បាយៗ</span>
            </h3>
            <p className="font-sans text-xs font-bold text-amber-700 uppercase mt-0.5">
              ប្រធានបទ៖ {currentTheme.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-sans text-lg font-black bg-amber-50 text-amber-950 px-4 py-2 rounded-2xl border-4 border-amber-200 shadow-inner">
              បានរាប់៖ {tappedCount} / {targetNumber}
            </span>
            <button
              onClick={generateLevel}
              className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 border-4 border-amber-600 text-white rounded-2xl font-sans font-black shadow-[0_4px_0_#d97706] cursor-pointer transition-all active:translate-y-1 active:shadow-none"
              id="new-counting-game-btn"
            >
              <RefreshCw className="w-5 h-5 text-white" />
              <span>ប្ដូររូបថ្មី</span>
            </button>
          </div>
        </div>

        {/* Play Sandbox/Stage */}
        <div
          className={`relative h-[380px] md:h-[450px] w-full rounded-[24px] md:rounded-[32px] overflow-hidden border-8 border-amber-50/50 shadow-inner ${currentTheme.bg} transition-colors duration-500`}
          id="counting-sandbox-canvas"
        >
          {/* Aesthetic environmental floating particles/emojis */}
          <div className="absolute top-4 left-6 text-2xl select-none opacity-40">{currentTheme.decor.split(' ')[0]}</div>
          <div className="absolute top-12 right-12 text-3xl select-none opacity-40">{currentTheme.decor.split(' ')[1]}</div>
          <div className="absolute bottom-16 left-12 text-2xl select-none opacity-40">{currentTheme.decor.split(' ')[2]}</div>
          <div className="absolute bottom-6 right-8 text-3xl select-none opacity-40">{currentTheme.decor.split(' ')[3]}</div>

          {/* Render Interactive Items */}
          {items.map((item) => {
            const numKhmer = KHMER_NUMBERS[item.tapOrder || 0]?.khmerSymbol || '';
            return (
              <motion.div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`
                }}
                whileHover={{ scale: item.scale * 1.15, rotate: item.rotation + 10 }}
                whileTap={{ scale: item.scale * 0.9 }}
                onClick={() => handleItemTap(item)}
                className="cursor-pointer relative z-10"
                id={`interactive-item-node-${item.id}`}
              >
                {/* SVG Illustration wrapper */}
                <div className={`p-1.5 rounded-full bg-white/40 backdrop-blur-[1px] hover:bg-white/80 border-2 border-transparent hover:border-amber-400/80 transition-all shadow-md hover:shadow-lg`}>
                  {renderItemSvg(currentTheme.icon, 70, item.isTapped)}
                </div>

                {/* Khmer Number Indicator after tap */}
                <AnimatePresence>
                  {item.isTapped && (
                    <motion.div
                      initial={{ scale: 0, y: 15 }}
                      animate={{ scale: 1.1, y: -20 }}
                      className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-sans font-black text-base w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg z-20"
                    >
                      {numKhmer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Big Target display at the center bottom */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white border-4 border-amber-300 px-6 py-2.5 rounded-full shadow-lg text-center flex items-center gap-3">
            <span className="font-sans text-sm font-black text-amber-950">ចូរស្វែងរកចំនួន៖</span>
            <div className="flex items-center gap-1">
              <span className="font-sans text-2xl font-black text-amber-600">
                {targetKhmerData?.khmerSymbol}
              </span>
              <span className="font-sans text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                ({targetKhmerData?.arabicSymbol})
              </span>
            </div>
            <span className="font-sans text-sm font-black text-amber-600">
              {targetKhmerData?.khmerWord}
            </span>
          </div>

          {/* Victory Overlay Screen inside Canvas */}
          <AnimatePresence>
            {isVictory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-amber-950/40 backdrop-blur-sm flex flex-col justify-center items-center z-30 p-6 text-center"
                id="victory-overlay-canvas"
              >
                <motion.div
                  initial={{ scale: 0.6, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="bg-white border-8 border-white ring-4 ring-amber-100 shadow-2xl rounded-3xl p-8 max-w-sm flex flex-col items-center"
                >
                  <div className="bg-amber-100 p-4 rounded-full mb-4 animate-bounce">
                    <Trophy className="w-12 h-12 text-amber-600 fill-amber-300" />
                  </div>

                  <h3 className="font-sans text-2xl font-black text-amber-950 leading-snug">
                    អស្ចារ្យណាស់កូន!
                  </h3>
                  <p className="font-sans text-sm text-amber-800 font-bold mb-5 leading-relaxed">
                    កូនរាប់បានចំនួន {targetKhmerData?.khmerSymbol} យ៉ាងត្រឹមត្រូវ។ ទទួលបានរង្វាន់ផ្កាយមាស +២ 🌟
                  </p>

                  <div className="flex flex-col gap-2.5 w-full">
                    <button
                      onClick={generateLevel}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 border-4 border-emerald-600 text-white font-sans font-black text-base rounded-2xl shadow-[0_4px_0_#047857] transition-all cursor-pointer active:translate-y-1 active:shadow-none"
                    >
                      លេងវគ្គបន្ទាប់
                    </button>
                    <button
                      onClick={() => speakKhmer(`លេខ ${targetKhmerData?.khmerWord}`)}
                      className="w-full py-2.5 bg-white border-4 border-amber-200 text-amber-950 hover:bg-amber-50 text-xs font-sans font-black rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      ស្ដាប់ការអានឡើងវិញ
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
