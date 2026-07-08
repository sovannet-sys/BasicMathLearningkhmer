/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, HelpCircle, Volume2, Sparkles, AlertCircle, RefreshCw, Star } from 'lucide-react';
import { KHMER_NUMBERS } from '../data';
import { QuizQuestion, UserProgress } from '../types';
import { MascotMessage } from './MascotMessage';
import { renderItemSvg } from '../utils/visuals';
import { playPop, playSuccess, playIncorrect, speakKhmer } from '../utils/audio';

interface QuizViewProps {
  progress: UserProgress;
  onUpdateProgress: (updater: (prev: UserProgress) => UserProgress) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ progress, onUpdateProgress }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnsId, setSelectedAnsId] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [activeMascotPhrase, setActiveMascotPhrase] = useState<string>('');

  // Generate 5 random interactive quiz questions
  const generateQuiz = () => {
    const generated: QuizQuestion[] = [];
    const questionTypes: ('count' | 'match_khmer' | 'match_arabic' | 'missing_sequence' | 'listening')[] = [
      'count',
      'match_khmer',
      'match_arabic',
      'missing_sequence',
      'listening'
    ];

    for (let i = 0; i < 5; i++) {
      const type = questionTypes[i % questionTypes.length];
      const targetVal = Math.floor(Math.random() * 10) + 1; // 1 to 10
      const targetData = KHMER_NUMBERS[targetVal];

      // Generate options (1 correct, 2 distractors)
      const distractors: number[] = [];
      while (distractors.length < 2) {
        const rand = Math.floor(Math.random() * 10) + 1;
        if (rand !== targetVal && !distractors.includes(rand)) {
          distractors.push(rand);
        }
      }

      const optionValues = [targetVal, ...distractors].sort(() => Math.random() - 0.5);
      const options = optionValues.map((v) => ({
        id: v.toString(),
        value: v,
        khmerSymbol: KHMER_NUMBERS[v].khmerSymbol,
        arabicSymbol: KHMER_NUMBERS[v].arabicSymbol,
        khmerWord: KHMER_NUMBERS[v].khmerWord
      }));

      let questionText = '';
      let sequence: (number | null)[] | undefined = undefined;
      let visualItemsCount = undefined;
      let visualItemsType = undefined;

      switch (type) {
        case 'count':
          questionText = `តើរូបភាពខាងក្រោមនេះមានចំនួនប៉ុន្មាន?`;
          visualItemsCount = targetVal;
          visualItemsType = targetData.itemIcon;
          break;
        case 'match_khmer':
          questionText = `តើលេខសកល "${targetData.arabicSymbol}" ត្រូវនឹងលេខខ្មែរមួយណា?`;
          break;
        case 'match_arabic':
          questionText = `តើលេខខ្មែរ "${targetData.khmerSymbol}" ត្រូវនឹងលេខសកលមួយណា?`;
          break;
        case 'missing_sequence':
          // generate sequence like targetVal-1, targetVal, targetVal+1, targetVal+2
          const startSeq = Math.max(1, Math.min(7, targetVal - 1));
          sequence = [startSeq, startSeq + 1, startSeq + 2, startSeq + 3];
          // Find index of targetVal in this sequence
          const targetIndex = sequence.indexOf(targetVal);
          if (targetIndex !== -1) {
            sequence[targetIndex] = null; // Blank it
          } else {
            sequence[1] = null;
          }
          questionText = 'ចូរបំពេញលេខដែលបាត់នៅក្នុងប្រអប់ព្រួញ៖';
          break;
        case 'listening':
          questionText = 'ចូរចុចប៊ូតុងស្ដាប់សំឡេង រួចជ្រើសរើសលេខដែលត្រឹមត្រូវ៖';
          break;
      }

      generated.push({
        id: `q-${i}`,
        type,
        questionText,
        options,
        correctAnswerId: targetVal.toString(),
        visualItemsCount,
        visualItemsType,
        sequence
      });
    }

    setQuestions(generated);
    setCurrentIdx(0);
    setSelectedAnsId(null);
    setAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setActiveMascotPhrase('តោះចាប់ផ្ដើមធ្វើលំហាត់ដើម្បីសាកល្បងចំណេះដឹង និងប្រមូលផ្កាយណា!');
  };

  useEffect(() => {
    generateQuiz();
  }, []);

  // Handle listening cue
  useEffect(() => {
    if (questions.length > 0 && !quizFinished) {
      const q = questions[currentIdx];
      if (q.type === 'listening' && !answered) {
        const correctVal = parseInt(q.correctAnswerId);
        const correctWord = KHMER_NUMBERS[correctVal].khmerWord;
        speakKhmer(`សូមស្វែងរកលេខ ${correctWord}`);
      }
    }
  }, [currentIdx, questions, quizFinished]);

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const q = questions[currentIdx];
    const correctVal = parseInt(q.correctAnswerId);
    const correctWord = KHMER_NUMBERS[correctVal].khmerWord;
    speakKhmer(correctWord);
  };

  const handleOptionClick = (optionId: string) => {
    if (answered) return;
    setSelectedAnsId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnsId || answered) return;

    setAnswered(true);
    const q = questions[currentIdx];
    const isCorrect = selectedAnsId === q.correctAnswerId;

    if (isCorrect) {
      playSuccess();
      setScore((prev) => prev + 1);
      setActiveMascotPhrase('ត្រឹមត្រូវហើយកូន! កូនពូកែខ្លាំងណាស់!');
      speakKhmer('ត្រឹមត្រូវហើយកូន! ពូកែណាស់!');
    } else {
      playIncorrect();
      const correctVal = parseInt(q.correctAnswerId);
      const correctSymbol = KHMER_NUMBERS[correctVal].khmerSymbol;
      const correctWord = KHMER_NUMBERS[correctVal].khmerWord;
      setActiveMascotPhrase(`មិនអីទេកូន! ចម្លើយត្រឹមត្រូវគឺលេខ ${correctSymbol} (${correctWord}) ណា!`);
      speakKhmer(`ចម្លើយគឺលេខ ${correctWord}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnsId(null);
      setAnswered(false);
      setActiveMascotPhrase('តោះសាកល្បងសំណួរបន្ទាប់ទៀតកូន!');
    } else {
      // Quiz completed!
      setQuizFinished(true);
      playSuccess();
      
      // Calculate bonus stars
      const bonusStars = score; // 1 star per correct answer
      const extraTrophyStar = score === 5 ? 5 : 0; // +5 bonus stars for perfect score
      const totalAward = bonusStars + extraTrophyStar;

      speakKhmer(`កូនធ្វើបានពិន្ទុ ${score} ផ្កាយ! អបអរសាទរកូន!`);

      onUpdateProgress((prev) => {
        const newHighScore = Math.max(prev.quizHighScore, score);
        return {
          ...prev,
          stars: prev.stars + totalAward,
          quizHighScore: newHighScore
        };
      });
    }
  };

  if (questions.length === 0) {
    return <div className="p-8 text-center font-sans text-lg">កំពុងរៀបចំសំណួរ...</div>;
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4" id="quiz-view-root">
      {/* Quiz mascot tutor speaking bubble */}
      <MascotMessage
        message={activeMascotPhrase}
        mode={answered ? (selectedAnsId === currentQuestion.correctAnswerId ? 'cheering' : 'thinking') : 'happy'}
        autoSpeak={false}
      />

      <div className="bg-white rounded-[32px] md:rounded-[40px] border-8 border-white ring-4 ring-amber-100/80 shadow-2xl overflow-hidden p-6 md:p-8" id="quiz-card-container">
        {/* Progress bar */}
        {!quizFinished ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans text-sm font-black text-amber-950 bg-amber-50 border-4 border-amber-200 px-3.5 py-1.5 rounded-full shadow-inner">
                សំណួរទី៖ {currentIdx + 1} / {questions.length}
              </span>
              <span className="font-sans text-sm font-black text-emerald-800 bg-emerald-50 border-4 border-emerald-200 px-3.5 py-1.5 rounded-full shadow-inner">
                ពិន្ទុទទួលបាន៖ {score} 🌟
              </span>
            </div>

            <div className="w-full h-4 bg-amber-50 rounded-full mb-6 overflow-hidden border-4 border-amber-100">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Label */}
            <h3 className="font-sans text-xl md:text-2xl font-black text-amber-950 text-center mb-6 leading-snug">
              {currentQuestion.questionText}
            </h3>

            {/* Question Visualizer Board (Variable on type) */}
            <div className="bg-amber-50/30 border-4 border-dashed border-amber-200 rounded-[24px] p-6 mb-8 flex flex-col items-center justify-center min-h-[160px]" id="quiz-visualizer-box">
              {/* Type 1: Counting items */}
              {currentQuestion.type === 'count' && currentQuestion.visualItemsCount && (
                <div className="flex flex-wrap justify-center items-center gap-4 max-w-md">
                  {Array.from({ length: currentQuestion.visualItemsCount }).map((_, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-2xl border-4 border-amber-200 shadow-md">
                      {renderItemSvg(currentQuestion.visualItemsType || 'apple', 48)}
                    </div>
                  ))}
                </div>
              )}

              {/* Type 4: Fill missing sequence */}
              {currentQuestion.type === 'missing_sequence' && currentQuestion.sequence && (
                <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                  {currentQuestion.sequence.map((num, i) => {
                    if (num === null) {
                      return (
                        <div
                          key={i}
                          className="w-14 h-16 md:w-16 md:h-18 rounded-2xl bg-amber-50 border-4 border-dashed border-amber-400 flex items-center justify-center font-sans font-black text-amber-600 text-2xl animate-pulse shadow-inner"
                        >
                          ?
                        </div>
                      );
                    }
                    const numData = KHMER_NUMBERS[num];
                    return (
                      <div
                        key={i}
                        className="w-14 h-16 md:w-16 md:h-18 rounded-2xl bg-white border-4 border-amber-200 flex flex-col items-center justify-center font-sans font-black text-amber-950 text-xl shadow-sm"
                      >
                        <span>{numData.khmerSymbol}</span>
                        <span className="text-[10px] text-amber-700/80">{numData.arabicSymbol}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Type 5: Listening drill */}
              {currentQuestion.type === 'listening' && (
                <button
                  onClick={handlePlaySound}
                  className="p-5 bg-amber-500 hover:bg-amber-600 border-4 border-amber-600 text-white rounded-full shadow-[0_5px_0_#d97706] cursor-pointer flex flex-col items-center gap-2 transition-all active:translate-y-1 active:shadow-none animate-bounce"
                  style={{ animationDuration: '4s' }}
                  id="quiz-listen-drill-btn"
                >
                  <Volume2 className="w-10 h-10" />
                  <span className="font-sans text-xs font-black px-2">ចុចដើម្បីស្ដាប់សំឡេង</span>
                </button>
              )}

              {/* Standard Type: match_khmer / match_arabic fallback visual center */}
              {(currentQuestion.type === 'match_khmer' || currentQuestion.type === 'match_arabic') && (
                <div className="p-4 bg-white rounded-full border-4 border-amber-200 shadow flex items-center justify-center">
                  <HelpCircle className="w-12 h-12 text-amber-300 animate-spin" style={{ animationDuration: '12s' }} />
                </div>
              )}
            </div>

            {/* Answers Choice Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="quiz-choices-grid">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedAnsId === opt.id;
                const isCorrectAns = opt.id === currentQuestion.correctAnswerId;
                
                let buttonStyle = 'bg-white border-4 border-amber-200 text-amber-950 hover:bg-amber-50/50 hover:border-amber-300 shadow-sm transition-all duration-150';
                if (isSelected && !answered) {
                  buttonStyle = 'bg-amber-500 border-4 border-amber-600 text-white shadow-[0_4px_0_#d97706] scale-102 transition-all duration-150';
                } else if (answered) {
                  if (isCorrectAns) {
                    buttonStyle = 'bg-emerald-500 border-4 border-emerald-600 text-white shadow-[0_4px_0_#047857] cursor-not-allowed';
                  } else if (isSelected) {
                    buttonStyle = 'bg-rose-500 border-4 border-rose-600 text-white shadow-[0_4px_0_#be123c] cursor-not-allowed';
                  } else {
                    buttonStyle = 'bg-amber-50/20 border-4 border-amber-100 text-amber-900/40 opacity-50 cursor-not-allowed';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={answered}
                    onClick={() => handleOptionClick(opt.id)}
                    className={`p-5 rounded-2xl font-sans font-black text-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 active:translate-y-0.5 ${buttonStyle}`}
                    id={`quiz-option-node-${opt.id}`}
                  >
                    {currentQuestion.type === 'match_arabic' ? (
                      <span className="text-3xl font-black">{opt.arabicSymbol}</span>
                    ) : (
                      <span className="text-3xl font-black">{opt.khmerSymbol}</span>
                    )}
                    <span className="text-xs font-bold opacity-80 mt-1">
                      {currentQuestion.type === 'match_arabic' ? `លេខសកល (${opt.arabicSymbol})` : `អានថា (${opt.khmerWord})`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quiz Submit Actions Bar */}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-amber-100">
              {!answered ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedAnsId}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 border-4 border-amber-600 disabled:bg-amber-50 disabled:border-amber-200 disabled:text-amber-800/40 disabled:shadow-none disabled:translate-y-0 text-white font-sans font-black text-base rounded-2xl shadow-[0_4px_0_#d97706] cursor-pointer transition-all active:translate-y-1 active:shadow-none"
                  id="confirm-quiz-ans-btn"
                >
                  ផ្ទៀងផ្ទាត់ចម្លើយ
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 border-4 border-emerald-600 text-white font-sans font-black text-base rounded-2xl shadow-[0_4px_0_#047857] cursor-pointer transition-all active:translate-y-1 active:shadow-none"
                  id="next-quiz-question-btn"
                >
                  {currentIdx < questions.length - 1 ? 'សំណួរបន្ទាប់' : 'មើលលទ្ធផល'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Quiz Reward Summary screen */
          <div className="text-center py-8" id="quiz-finished-panel">
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="flex flex-col items-center max-w-md mx-auto bg-white p-8 border-8 border-white ring-4 ring-amber-100/80 rounded-[32px] md:rounded-[40px] shadow-2xl"
            >
              <div className="bg-amber-100 p-5 rounded-full mb-4 animate-bounce">
                <Trophy className="w-16 h-16 text-amber-600 fill-amber-300" />
              </div>

              <h3 className="font-sans text-3xl font-black text-amber-950 mb-2">
                អបអរសាទរកូន!
              </h3>
              <p className="font-sans text-sm text-amber-800 font-bold mb-6">
                កូនបានបញ្ចប់លំហាត់អនុវត្តកម្រិតដំបូងហើយ!
              </p>

              {/* Score Display Stars */}
              <div className="flex gap-2 justify-center mb-6" id="quiz-finished-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <Star
                      className={`w-10 h-10 ${
                        i < score ? 'text-amber-500 fill-amber-400' : 'text-amber-200'
                      }`}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Award Breakdown Card */}
              <div className="bg-amber-50/50 w-full rounded-2xl p-4 border-2 border-dashed border-amber-300 text-center mb-6">
                <p className="font-sans text-lg font-black text-amber-950">
                  ពិន្ទុដែលឆ្លើយត្រូវ៖ {score} / ៥
                </p>
                <div className="flex flex-col items-center gap-1 mt-2 text-emerald-600 font-sans text-sm font-black">
                  <span>ទទួលបានរង្វាន់មាស៖</span>
                  <span>+ {score} ផ្កាយ 🌟</span>
                  {score === 5 && <span>ប្រាក់រង្វាន់បន្ថែម៖ +៥ ផ្កាយ 🏆</span>}
                </div>
              </div>

              <button
                onClick={generateQuiz}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 border-4 border-amber-600 text-white font-sans font-black text-base rounded-2xl shadow-[0_4px_0_#d97706] transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none"
                id="replay-quiz-btn"
              >
                <RefreshCw className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '6s' }} />
                <span>លេងលំហាត់ថ្មីម្ដងទៀត</span>
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
