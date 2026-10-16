'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/stores/app-store';
import { isLogged } from '@/lib/osha';
import { daysBetween, useNow } from '@/lib/use-now';
import { ShieldIcon } from './chip';

function parseDay(d: string) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day).getTime();
}

export function SafetyStreak() {
  const { incidents } = useAppStore();
  const now = useNow();
  if (now === null) return <div className="h-[52px]" />;

  const today = new Date(now);
  const yearStart = new Date(today.getFullYear(), 0, 1).getTime();
  const dates = incidents
    .filter(isLogged)
    .map((i) => parseDay(i.date))
    .filter((t) => t >= yearStart)
    .sort((a, b) => a - b);

  const last = dates.at(-1);
  const current = daysBetween(last ?? yearStart, now);
  const points = [yearStart, ...dates, now];
  const best = points.slice(1).reduce((m, t, i) => Math.max(m, daysBetween(points[i], t)), 0);
  const good = current >= 30;

  return (
    <motion.div
      className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-[var(--radius-lg)] border bg-[var(--card)]"
      style={{ borderColor: good ? 'color-mix(in oklch, var(--engine) 35%, transparent)' : 'var(--border)' }}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      title={last ? `Last recordable injury: ${new Date(last).toLocaleDateString('en-US', { dateStyle: 'medium' })}` : 'No recordable injuries this year'}
    >
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ color: 'var(--engine)', backgroundColor: 'var(--engine-subtle)' }}
      >
        <ShieldIcon />
      </span>
      <div className="leading-tight">
        <p className="text-sm text-[var(--ink)]">
          <span className="text-xl font-bold tabular-nums mr-1" style={{ fontFamily: 'var(--font-display)' }}>
            {current}
          </span>
          days since last recordable
        </p>
        <p className="text-[11px] text-[var(--ink-faint)]">Best this year: {best} days</p>
      </div>
    </motion.div>
  );
}
