'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { isDart, isLogged, rate } from '@/lib/osha';
import { motion } from 'framer-motion';

const cardMotion = (i: number) => ({
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  whileHover: { y: -2, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.08)', borderColor: 'var(--border-strong)' },
});

const CARD = 'rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5';
const LABEL = 'text-xs font-medium uppercase tracking-wider mb-3 text-[var(--ink-faint)]';

export function StatsCards() {
  const { incidents, establishment, setActiveView } = useAppStore();

  const needsSignoff = incidents.filter((i) => i.review.status === 'pending').length;
  const logged = incidents.filter(isLogged);
  const trir = rate(logged.length, establishment.totalHoursWorked);
  const dart = rate(logged.filter(isDart).length, establishment.totalHoursWorked);
  const fmt = (n: number | null) => (n === null ? '--' : n.toFixed(2));

  const counts = [
    { label: 'Needs Your Sign-off', value: needsSignoff, note: 'Classified, awaiting you', color: 'var(--accent)', bg: 'var(--accent-subtle)', view: 'review' },
    { label: 'Recordable Cases', value: logged.length, note: 'On the 300 log this year', color: 'var(--alert)', bg: 'var(--alert-subtle)', view: 'log' },
  ];

  const rates = [
    { label: 'Injury Rate', sub: 'Every case on the log', value: fmt(trir), code: 'TRIR', color: 'var(--ink)' },
    { label: 'Downtime Rate', sub: 'Days off or light duty', value: fmt(dart), code: 'DART', color: 'var(--blue)' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {counts.map((c, i) => (
        <motion.div key={c.label} onClick={() => setActiveView(c.view)} className={`${CARD} cursor-pointer`} {...cardMotion(i)}>
          <p className={LABEL}>{c.label}</p>
          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-3xl font-bold tabular-nums" style={{ color: c.color, fontFamily: 'var(--font-display)' }}>
              {c.value}
            </span>
            <span className="text-xs mb-1 px-2 py-0.5 rounded-full" style={{ color: c.color, backgroundColor: c.bg, fontFamily: 'var(--font-mono)' }}>
              {c.note}
            </span>
          </div>
        </motion.div>
      ))}

      <motion.div className={`${CARD} sm:col-span-2`} {...cardMotion(2)}>
        <p className={LABEL}>Injury Rates · per 100 full-time workers</p>
        <div className="divide-y divide-[var(--border)]">
          {rates.map((r) => (
            <div key={r.code} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--ink)]">{r.label}</p>
                {r.sub && <p className="text-[11px] text-[var(--ink-faint)]">{r.sub}</p>}
              </div>
              <span className="text-2xl font-bold tabular-nums" style={{ color: r.color, fontFamily: 'var(--font-display)' }}>
                {r.value}
              </span>
              <span className="text-[10px] w-9 text-right text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
                {r.code}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
