'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { isDart, isLogged, rate } from '@/lib/osha';
import { motion } from 'framer-motion';

interface RingProps {
  value: string;
  fraction: number;
  color: string;
  label: string;
  sub: string;
  code?: string;
  onClick?: () => void;
  index: number;
}

const SIZE = 84;
const STROKE = 7;
const R = (SIZE - STROKE) / 2;

function Ring({ value, fraction, color, label, sub, code, onClick, index }: RingProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="flex flex-col items-center text-center gap-2 py-2 rounded-[var(--radius-md)] disabled:cursor-default"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? { y: -2 } : undefined}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: Math.min(Math.max(fraction, 0), 1) }}
            transition={{ duration: 0.9, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {value}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--ink)]">{label}</p>
        <p className="text-[11px] text-[var(--ink-faint)]">
          {sub}
          {code && <span style={{ fontFamily: 'var(--font-mono)' }}> · {code}</span>}
        </p>
      </div>
    </motion.button>
  );
}

export function StatsCards() {
  const { incidents, establishment, setActiveView } = useAppStore();

  const total = incidents.length;
  const needsSignoff = incidents.filter((i) => i.review.status === 'pending').length;
  const logged = incidents.filter(isLogged);
  const trir = rate(logged.length, establishment.totalHoursWorked);
  const dart = rate(logged.filter(isDart).length, establishment.totalHoursWorked);

  const rateRing = (r: number | null, target: number) => ({
    value: r === null ? '--' : r.toFixed(2),
    fraction: r === null || !target ? 0 : r / target,
    color: r !== null && target && r >= target ? 'var(--alert)' : 'var(--engine)',
  });

  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          Your site at a glance
        </h3>
        <span className="text-[11px] text-[var(--ink-faint)]">Rates per 100 full-time workers</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Ring
          index={0}
          value={String(needsSignoff)}
          fraction={total ? needsSignoff / total : 0}
          color="var(--accent)"
          label="To Sign Off"
          sub={`of ${total} reported`}
          onClick={() => setActiveView('review')}
        />
        <Ring
          index={1}
          value={String(logged.length)}
          fraction={total ? logged.length / total : 0}
          color="var(--alert)"
          label="Recordable"
          sub={`of ${total} reported`}
          onClick={() => setActiveView('log')}
        />
        <Ring
          index={2}
          {...rateRing(trir, establishment.injuryRateTarget)}
          label="Injury Rate"
          sub={`target ${establishment.injuryRateTarget}`}
          code="TRIR"
        />
        <Ring
          index={3}
          {...rateRing(dart, establishment.missedWorkRateTarget)}
          label="Missed Work"
          sub={`target ${establishment.missedWorkRateTarget}`}
          code="DART"
        />
      </div>
    </motion.div>
  );
}
