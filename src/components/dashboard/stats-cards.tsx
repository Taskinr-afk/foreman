'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { isDart, isLogged, rate } from '@/lib/osha';
import { motion } from 'framer-motion';

const SIZE = 104;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;

interface RingProps {
  value: string;
  unit: string;
  fraction: number;
  color: string;
  label: string;
  sub: React.ReactNode;
  onClick?: () => void;
  index: number;
}

function Ring({ value, unit, fraction, color, label, sub, onClick, index }: RingProps) {
  const clamped = Math.min(Math.max(fraction, 0), 1);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="group flex flex-col items-center text-center gap-3 py-1 disabled:cursor-default"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.97 } : undefined}
    >
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90 overflow-visible">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            style={{ stroke: `color-mix(in oklch, ${color} 14%, transparent)` }}
          />
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            style={{ stroke: color, filter: `drop-shadow(0 0 3px color-mix(in oklch, ${color} 35%, transparent))` }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: clamped === 0 ? 0.001 : clamped }}
            transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums leading-none text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
            {value}
          </span>
          <span className="text-[10px] mt-1 uppercase tracking-wider text-[var(--ink-faint)]">{unit}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[var(--ink)] group-enabled:group-hover:text-[var(--accent)] transition-colors">{label}</p>
        <div className="text-[11px] text-[var(--ink-faint)] mt-0.5">{sub}</div>
      </div>
    </motion.button>
  );
}

function Card({ title, note, children, delay }: { title: string; note?: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h3 className="text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
        {note && <span className="text-[11px] text-[var(--ink-faint)]">{note}</span>}
      </div>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </motion.div>
  );
}

function rateStatus(r: number | null, target: number) {
  if (r === null || !target) return { color: 'var(--ink-faint)', text: 'Add hours worked in Settings' };
  if (r >= target) return { color: 'var(--alert)', text: 'Over target' };
  if (r >= target * 0.8) return { color: 'var(--accent)', text: 'Close to target' };
  return { color: 'var(--engine)', text: 'Under target' };
}

export function StatsCards() {
  const { incidents, establishment, setActiveView } = useAppStore();

  const total = incidents.length;
  const needsSignoff = incidents.filter((i) => i.review.status === 'pending').length;
  const logged = incidents.filter(isLogged);
  const trir = rate(logged.length, establishment.totalHoursWorked);
  const dart = rate(logged.filter(isDart).length, establishment.totalHoursWorked);

  const rateRing = (r: number | null, target: number, label: string, code: string, index: number) => {
    const s = rateStatus(r, target);
    return (
      <Ring
        index={index}
        value={r === null ? '--' : r.toFixed(2)}
        unit="per 100"
        fraction={r === null || !target ? 0 : r / target}
        color={s.color}
        label={label}
        sub={
          <>
            <span style={{ color: s.color }} className="font-medium">{s.text}</span>
            <span> · goal {target}</span>
            <span className="block mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>{code}</span>
          </>
        }
      />
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Cases" note={`${total} reported this year`} delay={0}>
        <Ring
          index={0}
          value={String(needsSignoff)}
          unit="cases"
          fraction={total ? needsSignoff / total : 0}
          color="var(--accent)"
          label="To Sign Off"
          sub={`of ${total} reported`}
          onClick={() => setActiveView('review')}
        />
        <Ring
          index={1}
          value={String(logged.length)}
          unit="cases"
          fraction={total ? logged.length / total : 0}
          color="var(--alert)"
          label="Recordable"
          sub={`of ${total} reported`}
          onClick={() => setActiveView('log')}
        />
      </Card>
      <Card title="Injury Rates" note="Per 100 full-time workers" delay={0.06}>
        {rateRing(trir, establishment.injuryRateTarget, 'Injury Rate', 'TRIR', 2)}
        {rateRing(dart, establishment.missedWorkRateTarget, 'Missed Work', 'DART', 3)}
      </Card>
    </div>
  );
}
