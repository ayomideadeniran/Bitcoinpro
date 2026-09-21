import { useState, useEffect } from 'react';

/**
 * Calculates dynamic baseline count:
 * Starts at 1,428 on anchor date (Sept 21, 2026) and automatically increments by 20 each day.
 */
export function calculateCurrentWaitlistBase(): number {
  const BASE_COUNT = 1428;
  const ANCHOR_DATE = new Date('2026-09-21T00:00:00Z').getTime();
  const now = Date.now();
  const daysPassed = Math.max(0, Math.floor((now - ANCHOR_DATE) / (1000 * 60 * 60 * 24)));
  return BASE_COUNT + (daysPassed * 20);
}

/**
 * Animates a number from 1 to the target value with a smooth easing curve.
 */
export function useCountUp(target: number, duration: number = 1800): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!target || target <= 1) {
      setCount(1);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Quartic ease-out: rapid acceleration from 1, decelerating gently to the target
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(1 + (target - 1) * easeOut);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return count;
}
