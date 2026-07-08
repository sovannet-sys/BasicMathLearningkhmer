/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { MascotOwl } from '../utils/visuals';
import { speakKhmer } from '../utils/audio';

interface MascotMessageProps {
  message: string;
  mode?: 'happy' | 'thinking' | 'cheering';
  autoSpeak?: boolean;
}

export const MascotMessage: React.FC<MascotMessageProps> = ({
  message,
  mode = 'happy',
  autoSpeak = false
}) => {
  useEffect(() => {
    if (autoSpeak) {
      speakKhmer(message);
    }
  }, [message, autoSpeak]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakKhmer(message);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-white rounded-3xl border-4 border-amber-200 shadow-[0_8px_0_#fde68a] max-w-3xl mx-auto my-8" id="mascot-container">
      <div className="relative cursor-pointer hover:scale-105 transition-transform duration-300" onClick={handleSpeak}>
        <MascotOwl mode={mode} size={110} />
        <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2.5 rounded-full border-2 border-white shadow-md animate-pulse">
          <Volume2 className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex-1 relative">
        {/* Triangle arrow for dialogue bubble */}
        <div className="hidden md:block absolute top-1/2 -left-3 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-amber-100 border-b-8 border-b-transparent"></div>
        <div className="hidden md:block absolute top-1/2 -left-[14px] -translate-y-1/2 w-0 h-0 border-t-[10px] border-t-transparent border-r-[14px] border-r-amber-200 border-b-[10px] border-b-transparent -z-10"></div>
        
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 shadow-inner">
          <p className="font-sans text-lg md:text-xl font-black text-amber-950 leading-relaxed text-center md:text-left">
            {message}
          </p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-full text-xs font-sans font-black shadow transition-all duration-150 btn-3d-amber"
              id="speak-bubble-btn"
            >
              <Volume2 className="w-4 h-4" />
              ស្ដាប់សំឡេង
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
