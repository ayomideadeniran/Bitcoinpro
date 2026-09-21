import { useState, useEffect } from 'react';

/**
 * Returns 0 as default base so only actual, real registered users are counted.
 */
export function calculateCurrentWaitlistBase(): number {
  return 0;
}

/**
 * Animates a number from 1 to the target value with a smooth easing curve.
 */
export function useCountUp(target: number, duration: number = 1800): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === undefined || target === null || target <= 0) {
      setCount(0);
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
