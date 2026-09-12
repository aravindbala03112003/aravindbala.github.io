import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const soundEnabledRef = useRef(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const getAudioContext = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
    return audioCtxRef.current;
  };

  const playTone = (frequency = 440, duration = 0.12, type = 'sine', startGain = 0.6, freqEnd = null) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      if (freqEnd) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 10), ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(startGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  };

  const playSynthSound = useCallback((soundType = 'click') => {
    if (!soundEnabledRef.current) return;
    
    if (soundType === 'click') {
      // Soft haptic glass click
      playTone(750, 0.05, 'sine', 0.5, 350);
    } else if (soundType === 'pop') {
      // Warm mechanical pop
      playTone(450, 0.08, 'triangle', 0.65, 850);
    } else if (soundType === 'like') {
      // Satisfying euphoric 4-note appreciation chord (C5 -> E5 -> G5 -> C6)
      playTone(523.25, 0.14, 'sine', 0.6); // C5
      setTimeout(() => playTone(659.25, 0.14, 'sine', 0.65), 50); // E5
      setTimeout(() => playTone(783.99, 0.14, 'sine', 0.7), 100); // G5
      setTimeout(() => playTone(1046.50, 0.22, 'sine', 0.8), 150); // C6
    } else if (soundType === 'document') {
      // Paper unfold glide
      playTone(320, 0.12, 'sine', 0.55, 680);
    } else if (soundType === 'chime') {
      // Luxury dual-tone chime
      playTone(659.25, 0.14, 'sine', 0.6); // E5
      setTimeout(() => playTone(880.00, 0.18, 'sine', 0.65), 60); // A5
    } else if (soundType === 'whoosh') {
      // Low-pass smooth sweep
      playTone(240, 0.12, 'sine', 0.5, 560);
    } else if (soundType === 'success') {
      // Bright double-bell success chime
      playTone(880, 0.12, 'sine', 0.65);
      setTimeout(() => playTone(1046.50, 0.2, 'sine', 0.75), 70);
    }
  }, []);

  const toggleSound = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    setSoundEnabled((prev) => {
      const next = !prev;
      soundEnabledRef.current = next;
      if (next) {
        // Immediate loud 3-note arpeggio chime feedback when sound is turned ON
        playTone(523.25, 0.12, 'sine', 0.6); // C5
        setTimeout(() => playTone(659.25, 0.12, 'sine', 0.6), 60); // E5
        setTimeout(() => playTone(783.99, 0.18, 'sine', 0.7), 120); // G5
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled, toggleSound, playSynthSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    return { soundEnabled: false, setSoundEnabled: () => {}, toggleSound: () => {}, playSynthSound: () => {} };
  }
  return context;
}
