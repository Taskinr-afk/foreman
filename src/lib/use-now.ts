'use client';

import { useEffect, useState } from 'react';

// Null until mounted so time-based text never mismatches the static prerender.
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [intervalMs]);
  return now;
}

export const DAY_MS = 86_400_000;

export function daysBetween(from: number, to: number) {
  return Math.floor((to - from) / DAY_MS);
}
