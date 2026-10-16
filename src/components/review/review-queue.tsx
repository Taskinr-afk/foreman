'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { SEVERITY_LABELS } from '@/lib/schemas/incident';
import type { Severity } from '@/lib/schemas/incident';
import { motion, AnimatePresence } from 'framer-motion';

export function ReviewQueue() {
  const { incidents, updateIncident } = useAppStore();
  const pending = incidents.filter((i) => i.status === 'pending-review');

  if (pending.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-14 h-14 rounded-full bg-[var(--engine-subtle)] flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
        >
          <svg className="w-7 h-7 text-[var(--engine)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </motion.div>
        <h3 className="text-lg font-semibold text-[var(--ink)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          All Clear
        </h3>
        <p className="text-sm text-[var(--ink-muted)]">
          No incidents pending review.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.p
        className="text-sm text-[var(--ink-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {pending.length} incident{pending.length !== 1 ? 's' : ''} awaiting safety manager review
      </motion.p>

      <AnimatePresence>
        {pending.map((incident, i) => (
          <motion.div
            key={incident.id}
            className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{
              duration: 0.35,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            layout
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                    {incident.employeeName}
                  </h4>
                  <span className="text-[11px] font-mono text-[var(--ink-faint)]" style={{ fontFamily: 'var(--font-mono)' }}>
                    {incident.id}
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-muted)]">
                  {incident.location} - {incident.date}
                </p>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                {SEVERITY_LABELS[incident.severity as Severity]}
              </span>
            </div>

            <p className="text-sm text-[var(--ink)] mb-5 leading-relaxed">
              {incident.description}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
              <div className="flex-1">
                <p className="text-[11px] text-[var(--ink-faint)] mb-1">OSHA Recordable?</p>
                <p className="text-xs text-[var(--ink-muted)]">
                  AI suggests: <span className="font-medium text-[var(--accent)]">Likely recordable</span> (medical treatment beyond first aid)
                </p>
              </div>
              <motion.button
                onClick={() => updateIncident(incident.id, { status: 'reviewed', oshaRecordable: true })}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-[var(--radius-md)]"
                style={{ backgroundColor: 'var(--alert)' }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Recordable
              </motion.button>
              <motion.button
                onClick={() => updateIncident(incident.id, { status: 'reviewed', oshaRecordable: false })}
                className="px-3 py-1.5 text-xs font-medium text-[var(--engine)] rounded-[var(--radius-md)] border border-[var(--engine)]"
                whileHover={{ scale: 1.04, y: -1, backgroundColor: 'var(--engine-subtle)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Not Recordable
              </motion.button>
              <motion.button
                onClick={() => updateIncident(incident.id, { status: 'rejected' })}
                className="px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] rounded-[var(--radius-md)] border border-[var(--border)]"
                whileHover={{ scale: 1.04, y: -1, backgroundColor: 'var(--card-hover)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Reject
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
