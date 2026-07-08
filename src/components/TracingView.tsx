/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, RotateCcw, CheckCircle, Award, Sparkles } from 'lucide-react';
import { KHMER_NUMBERS } from '../data';
import { UserProgress } from '../types';
import { MascotMessage } from './MascotMessage';
import { playSuccess, speakKhmer } from '../utils/audio';

interface TracingViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const TracingView: React.FC<TracingViewProps> = ({ progress, onUpdateProgress }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(1); // Default to '1' (១)
  const [brushColor, setBrushColor] = useState<string>('#3b82f6'); // Default sky blue
  const [brushWidth, setBrushWidth] = useState<number>(12);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [tracedSuccessfully, setTracedSuccessfully] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const activeNumber = KHMER_NUMBERS[selectedIndex];

  // Tracing brush choices
  const colors = [
    { name: 'ខៀវ', value: '#3b82f6' },
    { name: 'ក្រហម', value: '#ef4444' },
    { name: 'លឿង', value: '#f59e0b' },
    { name: 'បៃតង', value: '#10b981' },
    { name: 'ស្វាយ', value: '#a855f7' }
  ];

  // Re-draw or reset canvas template when number changes
  useEffect(() => {
    resetCanvas();
    setTracedSuccessfully(false);
  }, [selectedIndex]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support high DPI screens
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    setHasDrawn(false);
    drawBackgroundGuide(rect.width, rect.height);
  };

  const drawBackgroundGuide = (width: number, height: number) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    // Clear previous drawing
    ctx.clearRect(0, 0, width, height);

    // Draw grid board lines for visual schoolroom feel
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    // Horizontal grids
    for (let y = 30; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Vertical grids
    for (let x = 30; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw a big dashed dashed guide circle and outline for Khmer number
    ctx.font = 'black 190px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw very faint dashed target text
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(activeNumber.khmerSymbol, width / 2, height / 2);

    // Draw little start point arrow guide
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('✍️ ចាប់ផ្ដើមត្រង់នេះ', width / 2 - 20, height / 2 - 85);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineWidth = brushWidth;
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current?.closePath();
      setIsDrawing(false);
    }
  };

  const handleVerify = () => {
    if (!hasDrawn) {
      speakKhmer('សូមកូនហាត់សរសេរលេខនៅលើក្តារខៀនសិនណា!');
      return;
    }

    setTracedSuccessfully(true);
    playSuccess();

    // Congratulate child
    const speechText = `កូនសរសេរលេខ ${activeNumber.khmerSymbol} បានស្អាតខ្លាំងណាស់! ពូកែខ្លាំងណាស់កូន!`;
    speakKhmer(speechText);

    // Save tracing progress
    onUpdateProgress((prev) => {
      const isAlreadyDone = prev.completedTracing.includes(activeNumber.value);
      return {
        ...prev,
        stars: prev.stars + (isAlreadyDone ? 0 : 2), // +2 stars for first trace completion
        completedTracing: isAlreadyDone
          ? prev.completedTracing
          : [...prev.completedTracing, activeNumber.value]
      };
    });
  };

  const isCompleted = progress.completedTracing.includes(activeNumber.value);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="tracing-view-root">
      {/* Dynamic Tutor Dialogue */}
      <MascotMessage
        message={
          tracedSuccessfully
            ? `អស្ចារ្យណាស់កូន! លេខ ${activeNumber.khmerSymbol} (${activeNumber.khmerWord}) កូនសរសេរបានស្អាតខ្លាំងណាស់! ទទួលបានផ្កាយមាស +២ 🌟`
            : `មកហាត់សរសេរលេខខ្មែរ ${activeNumber.khmerSymbol} ទាំងអស់គ្នា! ចូរយកម្រាមដៃ ឬកណ្ដុរគូរដានតាមបន្ទាត់ព្រាលៗនៅលើក្តារខៀនណា!`
        }
        mode={tracedSuccessfully ? 'cheering' : 'happy'}
        autoSpeak={false}
      />

      {/* Grid of Tracing numbers */}
      <div className="flex flex-wrap justify-center gap-2 mb-6" id="tracing-number-selector">
        {KHMER_NUMBERS.map((num, idx) => {
          const isSelected = selectedIndex === idx;
          const isTraced = progress.completedTracing.includes(num.value);
          return (
            <button
              key={num.value}
              onClick={() => setSelectedIndex(idx)}
              className={`w-11 h-11 md:w-12 md:h-12 rounded-xl font-sans font-black text-base flex items-center justify-center relative cursor-pointer border-4 transition-all ${
                isSelected
                  ? 'bg-amber-500 border-amber-600 text-white shadow-[0_4px_0_#d97706] scale-105'
                  : 'bg-white hover:bg-amber-50 border-amber-200 text-amber-700'
              }`}
              id={`trace-selector-${num.value}`}
            >
              <span>{num.khmerSymbol}</span>
              {isTraced && (
                <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 border border-white">
                  <CheckCircle className="w-2.5 h-2.5 fill-emerald-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="tracing-main-layout">
        {/* Left Control Column */}
        <div className="lg:col-span-4 flex flex-col justify-between p-6 bg-white rounded-[32px] md:rounded-[40px] border-8 border-white ring-4 ring-amber-100/80 shadow-2xl" id="tracing-control-panel">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pencil className="w-5 h-5 text-amber-500" />
              <h3 className="font-sans text-lg font-black text-amber-950">
                ប្រអប់ឧបករណ៍សរសេរ
              </h3>
            </div>

            {/* Colors picker */}
            <div className="mb-6">
              <span className="font-sans text-xs font-black text-amber-800 uppercase tracking-wider block mb-2">
                ជ្រើសរើសពណ៌ប៊ិច៖
              </span>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setBrushColor(c.value)}
                    className="w-9 h-9 rounded-full border-4 transition-all hover:scale-105 active:scale-95 flex items-center justify-center relative cursor-pointer"
                    style={{
                      backgroundColor: c.value,
                      borderColor: brushColor === c.value ? '#78350f' : 'transparent',
                      boxShadow: brushColor === c.value ? '0 0 0 2px #fde68a' : 'none'
                    }}
                    title={c.name}
                    id={`color-pen-${c.value}`}
                  >
                    {brushColor === c.value && (
                      <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness selector */}
            <div className="mb-6">
              <span className="font-sans text-xs font-black text-amber-800 uppercase tracking-wider block mb-2">
                ទំហំមុខប៊ិច៖ ({brushWidth === 6 ? 'ស្តើង' : brushWidth === 12 ? 'មធ្យម' : 'ក្រាស់'})
              </span>
              <div className="flex gap-2">
                {[6, 12, 20].map((w) => (
                  <button
                    key={w}
                    onClick={() => setBrushWidth(w)}
                    className={`flex-1 py-2 border-4 rounded-xl font-sans text-xs font-black transition-all cursor-pointer ${
                      brushWidth === w
                        ? 'bg-amber-500 border-amber-600 text-white shadow-[0_3px_0_#d97706]'
                        : 'bg-white border-amber-200 text-amber-950 hover:bg-amber-50'
                    }`}
                  >
                    {w === 6 ? 'ស្តើង' : w === 12 ? 'មធ្យម' : 'ក្រាស់'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-2xl p-4 border-2 border-dashed border-amber-300 text-center mb-6">
            <h4 className="font-sans text-sm font-black text-amber-950 mb-1">
              គំរូ៖ លេខ {activeNumber.khmerWord}
            </h4>
            <div className="flex justify-center items-center gap-3 mt-2">
              <div className="bg-white border-2 border-amber-200 px-3 py-1 rounded-xl font-sans font-black text-amber-600 text-2xl shadow-sm">
                {activeNumber.khmerSymbol}
              </div>
              <span className="text-amber-400 font-bold text-lg">➔</span>
              <div className="bg-white border-2 border-amber-200 px-3 py-1 rounded-xl font-sans font-black text-amber-900/60 text-2xl shadow-sm">
                {activeNumber.arabicSymbol}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={resetCanvas}
              className="py-3 bg-white border-4 border-amber-300 hover:border-amber-400 text-amber-950 font-sans font-black text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:translate-y-0.5"
              id="clear-canvas-btn"
            >
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>លុបសរសេរឡើងវិញ</span>
            </button>
            <button
              onClick={handleVerify}
              className="py-3.5 bg-emerald-500 hover:bg-emerald-600 border-4 border-emerald-600 text-white font-sans font-black text-base rounded-2xl shadow-[0_4px_0_#047857] transition-all cursor-pointer active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              id="verify-trace-btn"
            >
              <CheckCircle className="w-5 h-5" />
              <span>ផ្ទៀងផ្ទាត់ការសរសេរ</span>
            </button>
          </div>
        </div>

        {/* Right Blackboard Panel */}
        <div className="lg:col-span-8 flex flex-col justify-between" id="blackboard-panel">
          <div className="relative bg-white border-8 border-white ring-4 ring-amber-100/80 rounded-[32px] md:rounded-[40px] p-4 shadow-2xl overflow-hidden flex flex-col justify-between h-[360px] md:h-[420px]">
            {/* Whiteboard canvas wrapper */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full bg-amber-50/20 border-2 border-dashed border-amber-200 rounded-2xl cursor-crosshair touch-none"
              id="tracing-html-canvas"
            ></canvas>

            {/* Overlay if completed */}
            {tracedSuccessfully && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-emerald-600/10 backdrop-blur-[2px] rounded-3xl pointer-events-none flex items-center justify-center z-10"
              >
                <div className="bg-white border-4 border-emerald-400 p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
                  <Sparkles className="w-6 h-6 text-emerald-500 fill-emerald-200" />
                  <span className="font-sans text-base font-black text-emerald-800">
                    សរសេរបានល្អណាស់កូន! +២ 🌟
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
