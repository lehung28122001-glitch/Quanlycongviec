import { useCallback, useRef } from 'react';

export function useSound() {
  const audioCtxRef = useRef(null);

  function getCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  // Pleasant "ding" when marking a task complete
  const playCompleteSound = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // Main tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(660, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Harmonic layer for richness
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.06);
      gain2.gain.setValueAtTime(0.07, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.2);
    } catch (e) {
      // Silently fail if audio is not supported
    }
  }, []);

  // Soft "dink" when unchecking a task
  const playUncheckedSound = useCallback(() => {
    try {
      const ctx = getCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.07);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      // Silently fail
    }
  }, []);

  return { playCompleteSound, playUncheckedSound };
}
