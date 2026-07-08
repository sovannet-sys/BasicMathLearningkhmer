/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, ChevronLeft, ChevronRight, CheckCircle, Award } from 'lucide-react';
import { KHMER_NUMBERS } from '../data';
import { NumberData, UserProgress } from '../types';
import { MascotMessage } from './MascotMessage';
import { renderItemSvg } from '../utils/visuals';
import { playPop, playSuccess, speakKhmer } from '../utils/audio';

interface FlashcardViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ progress, onUpdateProgress }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(1); // Default to '1' (១)
  const [tappedItems, setTappedItems] = useState<number[]>([]); // Track indexes of items tapped
  const [cheered, setCheered] = useState<boolean>(false);

  const activeNumber = KHMER_NUMBERS[selectedIndex];

  // Reset tapped state when changing numbers
  useEffect(() => {
    setTappedItems([]);
    setCheered(false);
  }, [selectedIndex]);

  const handleSpeakWord = () => {
    const text = `លេខខ្មែរ ${activeNumber.khmerSymbol} លេខសកល ${activeNumber.arabicSymbol} អានថា ${activeNumber.khmerWord}`;
    speakKhmer(text);
  };

  const handleItemTap = (index: number) => {
    if (tappedItems.includes(index)) {
      // Allow re-tapping but count sequentially
      playPop();
      return;
    }

    const nextCount = tappedItems.length + 1;
    // Sequential pronunciation in Khmer
    const countWord = KHMER_NUMBERS[nextCount]?.khmerWord || nextCount.toString();
    speakKhmer(countWord);
    playPop();

    const updated = [...tappedItems, index];
    setTappedItems(updated);

    // If all items are tapped
    if (updated.length === activeNumber.value) {
      setCheered(true);
      playSuccess();
      
      // Update user progress to mark this flashcard as completed and award 1 star
      onUpdateProgress((prev) => {
        if (prev.completedFlashcards.includes(activeNumber.value)) {
          return prev;
        }
        return {
          ...prev,
          stars: prev.stars + 1,
          completedFlashcards: [...prev.completedFlashcards, activeNumber.value]
        };
      });
    }
  };

  const handleNext = () => {
    if (selectedIndex < KHMER_NUMBERS.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const isCompleted = progress.completedFlashcards.includes(activeNumber.value);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="flashcards-view-root">
      {/* Intro Mascot */}
      <MascotMessage
        message={
          cheered
            ? `អស្ចារ្យណាស់កូន! កូនបានរាប់ ${activeNumber.itemName} ចំនួន ${activeNumber.khmerSymbol} (${activeNumber.khmerWord}) បានត្រូវឥតខ្ចោះ!`
            : `តោះរៀនស្គាល់លេខ ${activeNumber.khmerSymbol} ជាមួយគ្នា! ចុចលើរូប ${activeNumber.itemName} ខាងក្រោមមួយៗដើម្បីរៀនរាប់ណា!`
        }
        mode={cheered ? 'cheering' : 'happy'}
        autoSpeak={false}
      />

      {/* Number Selector Strip */}
      <div className="flex justify-center gap-1.5 md:gap-2 overflow-x-auto py-4 mb-6 scrollbar-thin" id="number-strip-selector">
        {KHMER_NUMBERS.map((num, idx) => {
          const isSelected = selectedIndex === idx;
          const isLearned = progress.completedFlashcards.includes(num.value);
          return (
            <motion.button
              key={num.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-12 h-14 md:w-14 md:h-16 rounded-2xl border-4 font-sans font-black text-lg md:text-xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-amber-500 border-amber-600 text-white shadow-[0_4px_0_#d97706] scale-105'
                  : 'bg-white hover:bg-amber-50 border-amber-200 text-amber-700'
              }`}
              id={`selector-btn-${num.value}`}
            >
              <span>{num.khmerSymbol}</span>
              <span className="text-[10px] md:text-xs opacity-80">{num.arabicSymbol}</span>
              {isLearned && (
                <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                  <CheckCircle className="w-3 h-3 fill-emerald-500" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Main Flashcard Card Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="flashcard-main-layout">
        {/* Left Side: Number symbols displaying card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 bg-white rounded-[32px] md:rounded-[40px] border-8 border-white ring-4 ring-amber-100/80 shadow-2xl relative overflow-hidden" id="card-symbol-panel">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isCompleted && (
              <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-sans font-bold rounded-full border-2 border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                បានរៀនរួច
              </span>
            )}
          </div>

          <div className="text-center my-6">
            <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-amber-600">
              សញ្ញាសម្គាល់លេខខ្មែរ / Khmer Number Symbol
            </span>
            {/* Khmer Symbol Display */}
            <motion.div
              key={activeNumber.value}
              initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`text-8xl md:text-9xl font-sans font-black mt-4 mb-2 drop-shadow-sm ${activeNumber.textColor}`}
            >
              {activeNumber.khmerSymbol}
            </motion.div>
          </div>

          {/* Spell out spelling word and pronunciation */}
          <div className="bg-amber-50/50 rounded-2xl p-5 border-2 border-dashed border-amber-300 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-amber-400 text-white text-[11px] font-sans font-black rounded-full border border-white">
              អក្សរខ្មែរ / Khmer Word
            </div>
            <h3 className="font-sans text-3xl font-black text-amber-950 mt-2 mb-1">
              {activeNumber.khmerWord}
            </h3>
            <p className="font-sans text-sm font-bold text-amber-800/80 italic">
              Pronounced: {activeNumber.pronunciationGuide}
            </p>
          </div>

          {/* Bottom control row: voice button and Arabic symbol */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <div className="flex flex-col items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl border-4 border-amber-200 shadow-inner">
              <span className="text-[10px] font-sans font-extrabold text-amber-600">សកល</span>
              <span className="font-sans text-2xl font-black text-amber-950">{activeNumber.arabicSymbol}</span>
            </div>

            <button
              onClick={handleSpeakWord}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-sans font-black text-lg shadow-[0_6px_0_#d97706] transition-all active:translate-y-1 active:shadow-none bg-amber-500 hover:bg-amber-600`}
              id="flashcard-speak-btn"
            >
              <Volume2 className="w-6 h-6 animate-pulse" />
              <span>ស្ដាប់ការអានលេខ</span>
            </button>
          </div>
        </div>

        {/* Right Side: Interactive item counting grid */}
        <div className="lg:col-span-7 bg-white rounded-[32px] md:rounded-[40px] border-8 border-white ring-4 ring-amber-100/80 shadow-2xl p-6 md:p-8 flex flex-col justify-between min-h-[450px]" id="card-items-panel">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans text-lg md:text-xl font-extrabold text-amber-800">
                រាប់ {activeNumber.itemName} ទាំងអស់គ្នា៖
              </h3>
              <span className="font-sans text-sm font-bold text-amber-600 bg-white border border-amber-200 px-3 py-1 rounded-full">
                បានរាប់ {tappedItems.length} / {activeNumber.value}
              </span>
            </div>

            {/* Tap-to-count objects grid */}
            {activeNumber.value === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 bg-white/70 rounded-2xl border-2 border-dashed border-slate-300 p-8">
                {renderItemSvg('circle-off', 100)}
                <p className="font-sans text-lg font-bold text-slate-600 mt-4 text-center">
                  លេខ សូន្យ (០) គឺគ្មានអ្វីទាំងអស់កូន!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 justify-center items-center py-4" id="counting-item-canvas">
                {Array.from({ length: activeNumber.value }).map((_, idx) => {
                  const isTapped = tappedItems.includes(idx);
                  // Find order in tappedItems
                  const tappedOrder = tappedItems.indexOf(idx) + 1;
                  const orderKhmer = KHMER_NUMBERS[tappedOrder]?.khmerSymbol || '';

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleItemTap(idx)}
                      className={`relative cursor-pointer aspect-square bg-amber-50/40 rounded-2xl border-4 flex items-center justify-center shadow-sm p-2 transition-all duration-150 ${
                        isTapped
                          ? 'border-emerald-400 bg-emerald-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]'
                          : 'border-amber-200 hover:border-amber-400 hover:bg-white'
                      }`}
                      id={`counting-target-item-${idx}`}
                    >
                      {renderItemSvg(activeNumber.itemIcon, 56, isTapped)}
                      
                      {/* Number Badge floating over tapped item */}
                      <AnimatePresence>
                        {isTapped && (
                          <motion.div
                            initial={{ scale: 0, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-2.5 -right-2.5 bg-emerald-500 text-white font-sans font-black text-sm w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                          >
                            {orderKhmer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Congratulations overlay if completed */}
          {cheered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-500 text-white rounded-2xl p-4 flex items-center gap-4 border-2 border-white shadow-lg mt-6"
              id="cheer-success-badge"
            >
              <div className="bg-white text-emerald-600 p-2.5 rounded-xl shadow">
                <Award className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <p className="font-sans text-base font-black">
                  អបអរសាទរ! កូនទទួលបានផ្កាយប្រាក់ ១ ហើយ! 🌟
                </p>
                <p className="font-sans text-xs opacity-95 font-bold">
                  អ្នកបានរាប់ដឹងចំនួនលេខ {activeNumber.khmerSymbol} បានជោគជ័យ។
                </p>
              </div>
            </motion.div>
          )}

          {/* Stepper Buttons */}
          <div className="flex justify-between items-center gap-4 border-t-2 border-amber-100 pt-6 mt-6">
            <button
              onClick={handlePrev}
              disabled={selectedIndex === 0}
              className="flex items-center gap-2 px-6 py-3.5 bg-white border-4 border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-950 disabled:opacity-40 disabled:pointer-events-none rounded-2xl font-sans font-black text-sm md:text-base cursor-pointer shadow-md transition-all active:translate-y-0.5 active:shadow-sm"
              id="prev-number-btn"
            >
              <ChevronLeft className="w-5 h-5 text-amber-600" />
              <span>ថយក្រោយ</span>
            </button>

            <button
              onClick={handleNext}
              disabled={selectedIndex === KHMER_NUMBERS.length - 1}
              className="flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 border-4 border-amber-600 text-white disabled:opacity-40 disabled:pointer-events-none rounded-2xl font-sans font-black text-sm md:text-base cursor-pointer shadow-[0_4px_0_#d97706] transition-all active:translate-y-1 active:shadow-none"
              id="next-number-btn"
            >
              <span>លេខបន្ទាប់</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
