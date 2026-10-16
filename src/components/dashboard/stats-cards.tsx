'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { isDart, isLogged, rate } from '@/lib/osha';
import { motion } from 'framer-motion';

interface StatCard {
  label: string;
  value: string;
  note: string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

export function StatsCards() {
  const { incidents, establishment, setActiveView } = useAppStore();

  const needsSignoff = incidents.filter((i) => i.review.status === 'pending').length;
  const logged = incidents.filter(isLogged);
  const dartCases = logged.filter(isDart).length;
  const trir = rate(logged.length, establishment.totalHoursWorked);
  const dart = rate(dartCases, establishment.totalHoursWorked);
  const fmt = (n: number | null) => (n === null ? '--' : n.toFixed(2));

  const stats: StatCard[] = [
    {
      label: 'Needs Your Sign-off',
      value: String(needsSignoff),
      note: 'Classified, awaiting you',
      color: 'var(--accent)',
      bgColor: 'var(--accent-subtle)',
      onClick: () => setActiveView('review'),
    },
    {
      label: 'Recordable Cases',
      value: String(logged.length),
      note: 'On the 300 log this year',
      color: 'var(--alert)',
      bgColor: 'var(--alert-subtle)',
      onClick: () => setActiveView('log'),
    },
    {
      label: 'TRIR',
      value: fmt(trir),
      note: 'Recordables per 100 workers',
      color: 'var(--ink)',
      bgColor: 'var(--card-hover)',
    },
    {
      label: 'DART Rate',
      value: fmt(dart),
      note: 'Days away / restricted',
      color: 'var(--blue)',
      bgColor: 'var(--blue-subtle)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          onClick={stat.onClick}
          className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
          style={{ backgroundColor: 'var(--card)', cursor: stat.onClick ? 'pointer' : 'default' }}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2, boxShadow: '0 8px 24px -8px rgba(0,0,0,0.08)', borderColor: 'var(--border-strong)' }}
        >
          <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-body)' }}>
            {stat.label}
          </p>
          <div className="flex items-end gap-3 flex-wrap">
            <span className="text-3xl font-bold tabular-nums" style={{ color: stat.color, fontFamily: 'var(--font-display)' }}>
              {stat.value}
            </span>
            <span
              className="text-xs mb-1 px-2 py-0.5 rounded-full"
              style={{ color: stat.color, backgroundColor: stat.bgColor, fontFamily: 'var(--font-mono)' }}
            >
              {stat.note}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
