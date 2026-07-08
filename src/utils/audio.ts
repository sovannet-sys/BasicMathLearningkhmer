/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Initialize Audio Context lazily to avoid auto-play blocking issues in browsers
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a cute bubble pop sound for counting or clicking items
 */
export function playPop() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Fast frequency sweep for a bouncy "pop" sound
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    console.warn('Audio play failed:', error);
  }
}

/**
 * Play a magical harp/chime sound for successes and correct answers
 */
export function playSuccess() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C, E, G, C, E
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.35);
    });
  } catch (error) {
    console.warn('Audio play failed:', error);
  }
}

/**
 * Play a gentle, funny slide-down sound for incorrect tries
 */
export function playIncorrect() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.25);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (error) {
    console.warn('Audio play failed:', error);
  }
}

/**
 * Speak the provided text aloud in Khmer using the Web Speech API
 */
export function speakKhmer(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      resolve();
      return;
    }

    // Cancel current speech to prevent overlapping
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'km-KH';
    utterance.rate = 0.85; // Slightly slower for struggling children to hear clearly
    utterance.pitch = 1.1; // Slightly higher pitch for a kid-friendly warm voice

    // Try to find a Khmer voice
    const voices = window.speechSynthesis.getVoices();
    const khmerVoice = voices.find(v => v.lang.startsWith('km') || v.name.toLowerCase().includes('khmer'));
    if (khmerVoice) {
      utterance.voice = khmerVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}
