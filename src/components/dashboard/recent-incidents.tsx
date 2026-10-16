'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { SEVERITY_LABELS, STATUS_LABELS } from '@/lib/schemas/incident';
import type { IncidentStatus, Severity } from '@/lib/schemas/incident';
import { motion } from 'framer-motion';

const STATUS_COLORS: Record<IncidentStatus, { bg: string; text: string }> = {
  'pending-review': { bg: 'var(--accent-subtle)', text: 'var(--accent)' },
  reviewed: { bg: 'var(--engine-subtle)', text: 'var(--engine)' },
  recorded: { bg: 'var(--blue-subtle)', text: 'var(--blue)' },
  rejected: { bg: 'var(--alert-subtle)', text: 'var(--alert)' },
};

const SEVERITY_COLORS: Record<Severity, string> = {
  'first-aid': 'var(--engine)',
  medical: 'var(--accent)',
  restricted: 'var(--accent)',
  'days-away': 'var(--alert)',
  death: 'var(--alert)',
};

export function RecentIncidents() {
  const { incidents, setActiveView } = useAppStore();

  return (
    <motion.div
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3
          className="text-sm font-semibold text-[var(--ink)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Recent Incidents
        </h3>
        <motion.button
          onClick={() => setActiveView('incidents')}
          className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          style={{ transitionDuration: 'var(--duration-fast)' }}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          View all
        </motion.button>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {incidents.slice(0, 5).map((incident, i) => {
          const statusStyle = STATUS_COLORS[incident.status as IncidentStatus];
          return (
            <motion.div
              key={incident.id}
              className="flex items-center gap-4 px-5 py-3.5 cursor-pointer"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.05 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                backgroundColor: 'var(--card-hover)',
                x: 2,
              }}
            >
              <motion.div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: SEVERITY_COLORS[incident.severity as Severity] }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 + 0.05 * i }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium text-[var(--ink)]"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {incident.employeeName}
                  </span>
                  <span
                    className="text-[11px] font-mono text-[var(--ink-faint)]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {incident.id}
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)] truncate mt-0.5">
                  {incident.description}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: SEVERITY_COLORS[incident.severity as Severity] }}
                >
                  {SEVERITY_LABELS[incident.severity as Severity]}
                </span>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                  }}
                >
                  {STATUS_LABELS[incident.status as IncidentStatus]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
