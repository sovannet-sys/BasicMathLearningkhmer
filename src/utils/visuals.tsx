/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  animate?: boolean;
}

export const AppleSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'animate-bounce' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    {/* Apple Body */}
    <path
      d="M50 32C35 25 20 30 20 52C20 74 36 88 50 85C64 88 80 74 80 52C80 30 65 25 50 32Z"
      fill="#ef4444"
    />
    {/* Highlights */}
    <ellipse cx="38" cy="45" rx="6" ry="12" fill="#fca5a5" transform="rotate(-15 38 45)" />
    {/* Stem */}
    <path
      d="M50 32C52 24 58 18 58 18"
      stroke="#78350f"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Leaf */}
    <path
      d="M50 25C44 20 42 12 48 10C54 8 56 16 50 25Z"
      fill="#22c55e"
    />
  </svg>
);

export const ButterflySvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'animate-pulse' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12))' }}
  >
    {/* Wings */}
    <path d="M50 50 C25 20, 10 40, 20 60 C25 70, 48 55, 50 50Z" fill="#38bdf8" />
    <path d="M50 50 C75 20, 90 40, 80 60 C75 70, 52 55, 50 50Z" fill="#38bdf8" />
    <path d="M50 50 C30 50, 15 65, 25 80 C32 85, 45 65, 50 50Z" fill="#0284c7" />
    <path d="M50 50 C70 50, 85 65, 75 80 C68 85, 55 65, 50 50Z" fill="#0284c7" />
    {/* Wing Patterns */}
    <circle cx="30" cy="45" r="5" fill="#fef08a" />
    <circle cx="70" cy="45" r="5" fill="#fef08a" />
    {/* Body */}
    <rect x="47" y="30" width="6" height="45" rx="3" fill="#1e293b" />
    {/* Antennae */}
    <path d="M48 30 C45 20, 35 18, 35 18" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M52 30 C55 20, 65 18, 65 18" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const StarSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'scale-110' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    <polygon
      points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
      fill="#fbbf24"
      stroke="#d97706"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="40" cy="42" r="3" fill="#1e293b" />
    <circle cx="60" cy="42" r="3" fill="#1e293b" />
    <path d="M45 52 Q50 58 55 52" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const BalloonSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'animate-bounce' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    <path
      d="M50 15 C28 15, 25 45, 25 55 C25 68, 38 78, 50 78 C62 78, 75 68, 75 55 C75 45, 72 15, 50 15 Z"
      fill="#a855f7"
    />
    <ellipse cx="40" cy="35" rx="6" ry="12" fill="#e9d5ff" opacity="0.6" transform="rotate(-20 40 35)" />
    <polygon points="50,78 45,84 55,84" fill="#a855f7" />
    <path
      d="M50 84 Q45 92 52 98"
      stroke="#64748b"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export const FlowerSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'rotate-12' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    <g transform="translate(50, 50)">
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-24"
          rx="12"
          ry="18"
          fill="#f43f5e"
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Center */}
      <circle cx="0" cy="0" r="16" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      <circle cx="-5" cy="-5" r="2" fill="#1e293b" />
      <circle cx="5" cy="-5" r="2" fill="#1e293b" />
      <path d="M-4 3 Q0 7 4 3" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const FishSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'translate-x-1' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    {/* Body */}
    <path
      d="M15 50 C30 30, 65 30, 80 50 C65 70, 30 70, 15 50 Z"
      fill="#06b6d4"
    />
    {/* Tail Fin */}
    <path
      d="M15 50 L2 35 L7 50 L2 65 Z"
      fill="#0891b2"
    />
    {/* Eye */}
    <circle cx="68" cy="45" r="4" fill="#ffffff" />
    <circle cx="70" cy="45" r="2" fill="#1e293b" />
    {/* Fins */}
    <path d="M48 37 Q40 25 52 25 Z" fill="#0891b2" />
    <path d="M48 63 Q40 75 52 75 Z" fill="#0891b2" />
  </svg>
);

export const LeafSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'rotate-6' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    <path
      d="M15 85 C30 65, 40 45, 85 15 C65 40, 45 50, 30 80"
      stroke="#15803d"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M30 80 C15 50, 35 25, 85 15 C80 50, 60 75, 30 80 Z"
      fill="#84cc16"
    />
    {/* Veins */}
    <path d="M43 53 Q53 47 55 45" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <path d="M54 42 Q64 36 66 34" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 60 Q34 50 32 48" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
    <path d="M51 49 Q45 39 43 37" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CandySvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'scale-105' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    {/* Twists on side */}
    <polygon points="25,50 10,35 10,65" fill="#d946ef" />
    <polygon points="75,50 90,35 90,65" fill="#d946ef" />
    {/* Candy Wrapper body */}
    <circle cx="50" cy="50" r="25" fill="#ec4899" />
    {/* Swirl */}
    <path
      d="M50 25 A25 25 0 0 0 35 68 A15 15 0 0 1 50 35 A10 10 0 0 0 50 65"
      fill="none"
      stroke="#ffffff"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export const CatSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'translate-y-1' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    {/* Ears */}
    <polygon points="25,45 15,15 40,30" fill="#f97316" />
    <polygon points="75,45 85,15 60,30" fill="#f97316" />
    {/* Face */}
    <circle cx="50" cy="50" r="32" fill="#fb923c" />
    {/* Eyes */}
    <circle cx="38" cy="44" r="5" fill="#ffffff" />
    <circle cx="38" cy="44" r="2.5" fill="#1e293b" />
    <circle cx="62" cy="44" r="5" fill="#ffffff" />
    <circle cx="62" cy="44" r="2.5" fill="#1e293b" />
    {/* Cheeks */}
    <ellipse cx="28" cy="54" rx="4" ry="2" fill="#f43f5e" opacity="0.5" />
    <ellipse cx="72" cy="54" rx="4" ry="2" fill="#f43f5e" opacity="0.5" />
    {/* Nose and Mouth */}
    <polygon points="50,53 46,49 54,49" fill="#1e293b" />
    <path d="M50 53 Q47 57 44 55" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 53 Q53 57 56 55" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

export const PencilSvg: React.FC<SvgProps> = ({ size = 64, className = '', animate = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={`${className} ${animate ? 'rotate-12' : ''}`}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    <g transform="rotate(45 50 50)">
      {/* Eraser */}
      <rect x="35" y="10" width="30" height="15" rx="3" fill="#fda4af" />
      <rect x="35" y="22" width="30" height="6" fill="#94a3b8" />
      {/* Body */}
      <rect x="35" y="28" width="30" height="42" fill="#0d9488" />
      {/* Stripes */}
      <rect x="43" y="28" width="6" height="42" fill="#0f766e" />
      <rect x="51" y="28" width="6" height="42" fill="#14b8a6" />
      {/* Tip wood */}
      <polygon points="35,70 65,70 50,90" fill="#fef08a" />
      {/* Graphite Lead Tip */}
      <polygon points="46,84 54,84 50,90" fill="#1e293b" />
    </g>
  </svg>
);

export const CircleOffSvg: React.FC<SvgProps> = ({ size = 64, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
  >
    <circle cx="50" cy="50" r="35" stroke="#94a3b8" strokeWidth="5" strokeDasharray="8,8" fill="none" />
    <line x1="25" y1="25" x2="75" y2="75" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const MascotOwl: React.FC<{ size?: number; mode?: 'happy' | 'thinking' | 'cheering'; animate?: boolean }> = ({
  size = 120,
  mode = 'happy',
  animate = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`${animate ? 'animate-bounce' : ''}`}
      style={{ animationDuration: '3s', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
    >
      {/* Branch */}
      <path d="M10 105 Q60 95 110 105" stroke="#78350f" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M25 102 Q15 90 10 92" stroke="#15803d" strokeWidth="3" fill="none" />
      
      {/* Body */}
      <ellipse cx="60" cy="65" rx="38" ry="42" fill="#7c2d12" />
      <ellipse cx="60" cy="70" rx="26" ry="30" fill="#fed7aa" />

      {/* Ears / Horns */}
      <polygon points="28,30 20,12 45,28" fill="#7c2d12" />
      <polygon points="92,30 100,12 75,28" fill="#7c2d12" />

      {/* Eyes */}
      <circle cx="42" cy="45" r="16" fill="#fef08a" stroke="#7c2d12" strokeWidth="2" />
      <circle cx="78" cy="45" r="16" fill="#fef08a" stroke="#7c2d12" strokeWidth="2" />

      {mode === 'happy' && (
        <>
          <circle cx="44" cy="45" r="8" fill="#1e293b" />
          <circle cx="76" cy="45" r="8" fill="#1e293b" />
          <circle cx="46" cy="42" r="3" fill="#ffffff" />
          <circle cx="78" cy="42" r="3" fill="#ffffff" />
        </>
      )}

      {mode === 'thinking' && (
        <>
          <circle cx="44" cy="43" r="6" fill="#1e293b" />
          <circle cx="76" cy="43" r="6" fill="#1e293b" />
          {/* Eyebrows */}
          <path d="M30 28 Q42 32 46 34" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M90 28 Q78 32 74 34" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {mode === 'cheering' && (
        <>
          {/* Closed smiling eyes */}
          <path d="M30 46 Q42 38 48 46" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M90 46 Q78 38 72 46" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Beak */}
      <polygon points="60,48 55,58 65,58" fill="#ea580c" />

      {/* Cheeks */}
      <circle cx="30" cy="58" r="4" fill="#f43f5e" opacity="0.4" />
      <circle cx="90" cy="58" r="4" fill="#f43f5e" opacity="0.4" />

      {/* Wings */}
      {mode === 'cheering' ? (
        <>
          {/* Wings up */}
          <path d="M22 65 Q5 40 20 30" stroke="#7c2d12" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M98 65 Q115 40 100 30" stroke="#7c2d12" strokeWidth="12" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          {/* Wings tucked */}
          <path d="M22 65 Q12 80 20 95" stroke="#7c2d12" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M98 65 Q108 80 100 95" stroke="#7c2d12" strokeWidth="10" strokeLinecap="round" fill="none" />
        </>
      )}

      {/* Feet */}
      <circle cx="48" cy="101" r="5" fill="#ea580c" />
      <circle cx="53" cy="102" r="5" fill="#ea580c" />
      <circle cx="67" cy="102" r="5" fill="#ea580c" />
      <circle cx="72" cy="101" r="5" fill="#ea580c" />

      {/* Cute Graduation Cap (Mascot Scholar) */}
      <polygon points="60,5 92,15 60,25 28,15" fill="#1e293b" />
      <rect x="52" y="18" width="16" height="8" fill="#1e293b" />
      <path d="M85 17 L88 32 C88 35, 83 38, 83 38" stroke="#facc15" strokeWidth="2.5" fill="none" />
      <circle cx="83" cy="38" r="2" fill="#facc15" />
    </svg>
  );
};

export const renderItemSvg = (iconName: string, size = 64, animate = false) => {
  switch (iconName) {
    case 'apple':
      return <AppleSvg size={size} animate={animate} />;
    case 'butterfly':
      return <ButterflySvg size={size} animate={animate} />;
    case 'star':
      return <StarSvg size={size} animate={animate} />;
    case 'balloon':
      return <BalloonSvg size={size} animate={animate} />;
    case 'flower':
      return <FlowerSvg size={size} animate={animate} />;
    case 'fish':
      return <FishSvg size={size} animate={animate} />;
    case 'leaf':
      return <LeafSvg size={size} animate={animate} />;
    case 'candy':
      return <CandySvg size={size} animate={animate} />;
    case 'cat':
      return <CatSvg size={size} animate={animate} />;
    case 'pencil':
      return <PencilSvg size={size} animate={animate} />;
    case 'circle-off':
    default:
      return <CircleOffSvg size={size} />;
  }
};
