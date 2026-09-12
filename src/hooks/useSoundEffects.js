import { useCallback, useEffect, useRef, useState } from 'react';

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthSound = useCallback((type = 'click') => {
    if (!soundEnabled) return;
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'chime') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch (e) {
      // Gracefully ignore audio restrictions
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    initAudio();
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        // Play instant chime sound when sound is turned ON
        setTimeout(() => {
          try {
            const ctx = audioCtxRef.current;
            if (ctx) {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(523.25, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12);
              gain.gain.setValueAtTime(0.15, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.16);
            }
          } catch (err) {}
        }, 50);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return { soundEnabled, setSoundEnabled, toggleSound, playSynthSound };
}
