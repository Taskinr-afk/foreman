'use client';

import { useAppStore } from '@/lib/stores/app-store';
import { TYPE_LABELS, SEVERITY_LABELS } from '@/lib/schemas/incident';
import type { IncidentType, Severity } from '@/lib/schemas/incident';
import { motion } from 'framer-motion';

export function OshaLog() {
  const { incidents } = useAppStore();
  const recordable = incidents.filter((i) => i.oshaRecordable === true);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--ink-muted)]">
            OSHA Form 300 - Log of Work-Related Injuries and Illnesses
          </p>
          <p className="text-xs text-[var(--ink-faint)] mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
            Establishment: Demo Corp | Year: 2024
          </p>
        </div>
        <motion.button
          className="px-3 py-1.5 text-xs font-medium text-[var(--accent)] rounded-[var(--radius-md)] border border-[var(--accent)]"
          whileHover={{ scale: 1.04, y: -1, backgroundColor: 'var(--accent-subtle)' }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          Export CSV
        </motion.button>
      </div>

      <motion.div
        className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-x-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>Case #</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider">Employee</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider">Body Part</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-[var(--ink-faint)] uppercase tracking-wider">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {recordable.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-[var(--ink-faint)]">
                  No recordable incidents logged yet.
                </td>
              </tr>
            ) : (
              recordable.map((inc, i) => (
                <motion.tr
                  key={inc.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ backgroundColor: 'var(--card-hover)' }}
                  className="cursor-default"
                >
                  <td className="px-4 py-3 font-mono text-xs text-[var(--ink-muted)]" style={{ fontFamily: 'var(--font-mono)' }}>{inc.id}</td>
                  <td className="px-4 py-3 font-medium text-[var(--ink)]">{inc.employeeName}</td>
                  <td className="px-4 py-3 text-[var(--ink-muted)]">{inc.date}</td>
                  <td className="px-4 py-3 text-[var(--ink-muted)]">{inc.location}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium">{TYPE_LABELS[inc.type as IncidentType]}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--ink-muted)]">{inc.bodyPart}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-[var(--accent)]">{SEVERITY_LABELS[inc.severity as Severity]}</span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
