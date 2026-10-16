'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { motion } from 'framer-motion';

interface StatCard {
  label: string;
  value: number;
  change?: string;
  color: string;
  bgColor: string;
}

export function StatsCards() {
  const { incidents } = useAppStore();

  const totalIncidents = incidents.length;
  const pendingReview = incidents.filter((i) => i.status === 'pending-review').length;
  const recordable = incidents.filter((i) => i.oshaRecordable === true).length;
  const daysAway = incidents.filter((i) => i.severity === 'days-away' || i.severity === 'death').length;

  const stats: StatCard[] = [
    {
      label: 'Total Incidents',
      value: totalIncidents,
      change: '+2 this week',
      color: 'var(--ink)',
      bgColor: 'var(--card)',
    },
    {
      label: 'Pending Review',
      value: pendingReview,
      color: 'var(--accent)',
      bgColor: 'var(--accent-subtle)',
    },
    {
      label: 'OSHA Recordable',
      value: recordable,
      change: 'Requires logging',
      color: 'var(--alert)',
      bgColor: 'var(--alert-subtle)',
    },
    {
      label: 'Missed Work Cases',
      value: daysAway,
      change: 'Days away or restricted duty',
      color: 'var(--blue)',
      bgColor: 'var(--blue-subtle)',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5 cursor-default"
          style={{ backgroundColor: 'var(--card)' }}
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -2,
            boxShadow: '0 8px 24px -8px rgba(0,0,0,0.08)',
            borderColor: 'var(--border-strong)',
          }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wider mb-3"
            style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-body)' }}
          >
            {stat.label}
          </p>
          <div className="flex items-end gap-3">
            <span
              className="text-3xl font-bold tabular-nums"
              style={{ color: stat.color, fontFamily: 'var(--font-display)' }}
            >
              {stat.value}
            </span>
            {stat.change && (
              <span
                className="text-xs mb-1 px-2 py-0.5 rounded-full"
                style={{
                  color: stat.color,
                  backgroundColor: stat.bgColor,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {stat.change}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
