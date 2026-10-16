'use client';

import { motion } from 'framer-motion';

export function ComplianceChart() {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const data = [
    { incidents: 3, recordable: 1 },
    { incidents: 5, recordable: 2 },
    { incidents: 2, recordable: 0 },
    { incidents: 4, recordable: 2 },
    { incidents: 6, recordable: 3 },
    { incidents: 5, recordable: 3 },
  ];

  const maxVal = Math.max(...data.map((d) => d.incidents));

  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-sm font-semibold text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Incident Trend
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--border-strong)' }} />
            <span className="text-[11px] text-[var(--ink-faint)]">Total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--accent)' }} />
            <span className="text-[11px] text-[var(--ink-faint)]">Recordable</span>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 h-[140px]">
        {data.map((d, i) => (
          <motion.div
            key={months[i]}
            className="flex-1 flex flex-col items-center gap-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full flex items-end gap-1 h-[110px]">
              <motion.div
                className="flex-1 rounded-t-[3px]"
                style={{ backgroundColor: 'var(--border-strong)' }}
                initial={{ height: 0 }}
                animate={{ height: `${(d.incidents / maxVal) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="flex-1 rounded-t-[3px]"
                style={{ backgroundColor: 'var(--accent)' }}
                initial={{ height: 0 }}
                animate={{ height: `${(d.recordable / maxVal) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-[10px] text-[var(--ink-faint)] font-medium">{months[i]}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
